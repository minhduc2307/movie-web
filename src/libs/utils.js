export const formatCurrency = (number, currency = "VND") => {
    const formatter = new Intl.NumberFormat("vi", {
        style: "currency",
        currency,
    });
    return formatter.format(number);
};
