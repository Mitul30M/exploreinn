type CurrencyConverterOptions = {
  amount: number;
  toCurrency: string; // Target currency (e.g., "INR")
  fromCurrency?: string; // Source currency, default is "USD"
};

// Utility function for currency conversion
export const convertCurrency = async ({
  amount,
  toCurrency,
  fromCurrency = "USD",
}: CurrencyConverterOptions): Promise<string> => {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY; // Add your API key here
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache response for 1 hour
    });
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();

    if (!data.conversion_rates[toCurrency]) {
      throw new Error(`Invalid target currency: ${toCurrency}`);
    }

    // Convert the amount
    const conversionRate = data.conversion_rates[toCurrency];
    const convertedAmount = amount * conversionRate;

    // Format as currency
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: toCurrency,
    }).format(convertedAmount);
  } catch (error) {
    console.error("Currency conversion error:", error);
    return `${amount} ${fromCurrency}`;
  }
};
