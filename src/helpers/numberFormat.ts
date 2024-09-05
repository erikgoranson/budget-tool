//import settings

const locale = 'en-US';
const style = 'currency';
const currency = 'USD';

const currencyFormatter = new Intl.NumberFormat(
    locale, {
        style: style,
        currency: currency,
});

export default currencyFormatter;
