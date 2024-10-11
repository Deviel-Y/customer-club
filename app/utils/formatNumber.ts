const formatNumber = (number: number): string => {
  return new Intl.NumberFormat("fa-IR").format(number);
};

export default formatNumber;
