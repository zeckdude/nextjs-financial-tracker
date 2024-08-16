export const validateCurrencyAmount = (value: number | undefined | null) => {
  const errorMessage = 'Enter a valid and positive amount (e.g., 22.00, 44.99)';
  if (value === undefined || value === null) {
    return errorMessage;
  }
  const regex = /^\d+(\.\d{0,2})?$/;
  return regex.test(value.toString()) || errorMessage;
};

export const formatCurrencyAmount = (value: number | undefined) => {
  if (value === undefined) return '';
  return value.toFixed(2);
};
