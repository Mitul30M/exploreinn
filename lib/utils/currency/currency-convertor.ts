type CurrencyConverterOptions = {
  amount: number;
  toCurrency: string; // Target currency (e.g., "INR")
  fromCurrency: string; // Source currency, default is "USD"
};

/**
 * Converts an amount of money from one currency to another.
 *
 * @param {CurrencyConverterOptions} options
 * @returns {Promise<string>} - The converted amount formatted as a string with the target currency
 */
export const convertCurrency = async (
  options: CurrencyConverterOptions,
): Promise<string> => {
  // Fetch latest exchange rate from API
  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY as string;
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${options.fromCurrency}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache response for 1 hour
    });

    if (!response.ok) {
      // If the response is not OK, return the original amount formatted as a string with the default currency
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(options.amount);
    }

    const data = await response.json() as {
      conversion_rates: Record<string, number>;
    };

    if (!data.conversion_rates[options.toCurrency]) {
      // If the target currency is not available, return the original amount formatted as a string with the default currency
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(options.amount);
    }

    const conversionRate = data.conversion_rates[options.toCurrency];
    const convertedAmount = options.amount * conversionRate;

    // Return the converted amount formatted as a string with the target currency
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: options.toCurrency,
    }).format(convertedAmount);
  } catch (error) {
    console.error("Currency conversion error:", error);
    // If there is an error, return the original amount formatted as a string with the default currency
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(options.amount);
  }
};
