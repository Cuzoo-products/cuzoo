export const formatVendorCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (value >= 1_000) {
    return `₦${(value / 1_000).toFixed(0)}K`;
  }
  if (value === 0) {
    return "₦0";
  }
  return `₦${value.toLocaleString("en-NG")}`;
};
