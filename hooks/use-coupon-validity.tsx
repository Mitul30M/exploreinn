import { useCallback } from "react";
import { addMonths } from "date-fns";

/**
 * Provides a hook to calculate the validity of a coupon.
 *
 * @returns A tuple where the first element is a function, `getCouponValidity`, which
 * takes two parameters: `redeemedOn` and `validForMonths`. The return value is a
 * string indicating the validity of the coupon in terms of months and days.
 */
export const useCouponValidity = () => {
  const getExpirationDate = useCallback(
    (redeemedOn: Date, validForMonths: number) =>
      addMonths(redeemedOn, validForMonths),
    []
  );

  const getCouponValidity = useCallback(
    (redeemedOn: Date, validForMonths: number) => {
      const expirationDate = getExpirationDate(redeemedOn, validForMonths);
      const monthsUntilExpiration = Math.ceil(
        (expirationDate.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      );
      const daysUntilExpiration =
        Math.ceil(
          (expirationDate.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        ) % 30;

      return `Valid for ${monthsUntilExpiration} months and ${daysUntilExpiration} days`;
    },
    [getExpirationDate]
  );

  return { getCouponValidity };
};
