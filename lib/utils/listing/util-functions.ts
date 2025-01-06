export const getRatingLabel = (rating: number): string => {
  if (rating >= 9) return "Excellent";
  if (rating >= 7) return "Very Good";
  if (rating >= 5) return "Good";
  if (rating >= 3) return "Fair";
  return "Poor";
};
