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
  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.createdAt);

    // Ensure the transaction falls within the current year
    if (transactionDate >= startDate && transactionDate <= endDate) {
      const month = getMonth(transactionDate); // 0 = January, 11 = December
      const netRevenue = transaction.totalCost * 0.95; // Deduct 5% application fee
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
