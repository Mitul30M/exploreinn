import prisma from "@/lib/prisma-client";
import { Transaction } from "@prisma/client";
import { startOfYear, endOfYear, getMonth } from "date-fns";

/**
 * Retrieves all transactions for a given listing.
 * The function returns a promise that resolves to an array of transactions in descending order of creation date.
 * @param listingId - The id of the listing whose transactions are to be retrieved.
 * @returns A promise that resolves to an array of transactions in descending order of creation date.
 */
export async function getListingTransactions(listingId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      listingId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return transactions;
}

/**
 * Calculates the revenue from a given transaction.
 * The revenue calculation is based on the payment method and payment status of the transaction.
 * For online payments, the revenue is the total cost minus 5% platform fee.
 * For pay later bookings, the revenue is the total cost minus 5% late cancellation fee (if applicable),
 * plus 5% platform fee.
 * For normal offline payments, the revenue is the total cost.
 * @param transaction - The transaction for which to calculate the revenue.
 * @returns The revenue from the transaction.
 */
export function getRevenueFromTransaction(transaction: Transaction) {
  if (transaction.paymentMethod === "ONLINE_PAYMENT") {
    if (transaction.paymentStatus === "refunded") {
      // If refunded within 48 hours of creation, no revenue (full refund)
      if (
        new Date(transaction.refundedAt!).getTime() -
          new Date(transaction.createdAt).getTime() <=
        48 * 60 * 60 * 1000
      ) {
        return 0;
      }
      // If refunded after 48 hours, keep 5% as late cancellation fee
      return transaction.totalCost * 0.05;
    }
    // Normal online payment, 5% platform fee
    return transaction.totalCost * 0.95;
  } else {
    // For pay later bookings
    if (transaction.paymentStatus === "charged") {
      // For late cancellations, charge 5% fee with 5% platform fee
      return transaction.totalCost * 0.95;
    } else if (
      transaction.paymentStatus === "cancelled" ||
      transaction.paymentStatus === "pending"
    ) {
      // For normal cancellations or pending payments, no revenue
      return 0;
    }
    // For normal offline payments
    return transaction.totalCost;
  }
}

/**
 * Retrieves the monthly revenue for a given listing for the current year.
 * The function returns a promise that resolves to an array of objects containing the month and revenue.
 * @param listingId - The id of the listing whose monthly revenue is to be retrieved.
 * @returns A promise that resolves to an array of objects containing the month and revenue.
 */
export async function getMonthlyRevenue(listingId: string) {
  const transactions = await getListingTransactions(listingId);

  // Get the current year range
  const startDate = startOfYear(new Date());
  const endDate = endOfYear(new Date());

  // Initialize an array to store monthly revenue
  const monthlyRevenue = Array(12).fill(0);

  // Filter transactions within the current year and calculate net revenue
  transactions.forEach(async (transaction) => {
    const transactionDate = new Date(transaction.createdAt);

    // Ensure the transaction falls within the current year
    if (transactionDate >= startDate && transactionDate <= endDate) {
      const month = getMonth(transactionDate); // 0 = January, 11 = December
      const netRevenue = getRevenueFromTransaction(transaction); // Deduct 5% application fee if payment method is online
      monthlyRevenue[month] += netRevenue;
    }
  });

  // Format the data for the chart
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return monthlyRevenue.map((revenue, index) => ({
    month: months[index],
    revenue: parseFloat(revenue.toFixed(2)), // Round to 2 decimal places
  }));
}

/**
 * Compares the monthly revenue for a given listing between the current year and the past year.
 * The function returns a promise that resolves to an array of objects containing the month,
 * the revenue in the past year, and the revenue in the current year.
 * @param listingId - The id of the listing whose monthly revenue is to be compared.
 * @returns A promise that resolves to an array of objects with the month, past year's revenue, and current year's revenue.
 */
export async function getMonthlyRevenueComparison(listingId: string) {
  const transactions = await getListingTransactions(listingId);

  const currentYear = new Date().getFullYear();
  const pastYear = currentYear - 1;

  // Get the year ranges
  const pastYearStartDate = startOfYear(new Date(pastYear, 0, 1));
  const pastYearEndDate = endOfYear(new Date(pastYear, 0, 1));
  const currentYearStartDate = startOfYear(new Date(currentYear, 0, 1));
  const currentYearEndDate = endOfYear(new Date(currentYear, 0, 1));

  // Initialize arrays to store monthly revenue
  const pastYearRevenue = Array(12).fill(0);
  const currentYearRevenue = Array(12).fill(0);

  // Calculate revenue for each month in both years
  transactions.forEach(async (transaction) => {
    const transactionDate = new Date(transaction.createdAt);
    const month = getMonth(transactionDate);
    const netRevenue = getRevenueFromTransaction(transaction);
    if (
      transactionDate >= pastYearStartDate &&
      transactionDate <= pastYearEndDate
    ) {
      pastYearRevenue[month] += netRevenue;
    } else if (
      transactionDate >= currentYearStartDate &&
      transactionDate <= currentYearEndDate
    ) {
      currentYearRevenue[month] += netRevenue;
    }
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months.map((month, index) => ({
    month,
    pastYear: parseFloat(pastYearRevenue[index].toFixed(2)),
    currentYear: parseFloat(currentYearRevenue[index].toFixed(2)),
  }));
}

/**
 * Retrieves the most recent transaction for a given listing.
 * The function returns a promise that resolves to the most recent transaction.
 * @param listingId - The id of the listing whose most recent transaction is to be retrieved.
 * @returns A promise that resolves to the most recent transaction.
 */
export async function getRecentListingTransaction(listingId: string) {
  const transactions = await prisma.transaction.findFirst({
    where: {
      listingId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      guest: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phoneNo: true,
          profileImg: true,
        },
      },
    },
  });
  return transactions;
}

/**
 * Calculates the revenue for a given listing over different time periods.
 * This function retrieves transactions for a listing and calculates the revenue
 * for the current day, week, month, and year, taking into account online payment
 * refunds by deducting a 5% application fee.
 *
 * @param listingId - The id of the listing for which revenue is to be calculated.
 * @returns A promise that resolves to an object containing the revenue for today,
 *          this week, this month, and this year, each rounded to two decimal places.
 */
export async function getRevenueByTimePeriod(listingId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      listingId,
    },
  });

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  let today = 0,
    week = 0,
    month = 0,
    year = 0;

  transactions.forEach(async (transaction) => {
    const revenue = getRevenueFromTransaction(transaction);

    const transactionDate = new Date(transaction.createdAt);

    if (transactionDate >= startOfDay) {
      today += revenue;
    }
    if (transactionDate >= startOfWeek) {
      week += revenue;
    }
    if (transactionDate >= startOfMonth) {
      month += revenue;
    }
    if (transactionDate >= startOfYear) {
      year += revenue;
    }
  });

  return {
    today: parseFloat(today.toFixed(2)),
    week: parseFloat(week.toFixed(2)),
    month: parseFloat(month.toFixed(2)),
    year: parseFloat(year.toFixed(2)),
  };
}

/**
 * Retrieves an overview of payment statuses for transactions of a given listing.
 * The function returns a promise that resolves to an object with the following keys:
 * - pending: The number of transactions with a pending status.
 * - completed: The number of transactions with a completed status.
 * - cancelled: The number of transactions with a cancelled status.
 * - requested_refund: The number of transactions with a requested refund status.
 * - refunded: The number of transactions with a refunded status.
 * @param listingId - The id of the listing whose transaction payment statuses are to be retrieved.
 * @returns A promise that resolves to an object with the payment status overview.
 */
export async function getPaymentStatusOverview(listingId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      listingId: listingId,
    },
    select: {
      paymentStatus: true,
    },
  });

  const statusOverview = {
    pending: 0,
    completed: 0,
    cancelled: 0,
    requested_refund: 0,
    refunded: 0,
    charged: 0,
  };

  transactions.forEach((transaction) => {
    statusOverview[transaction.paymentStatus] += 1;
  });

  return statusOverview;
}
