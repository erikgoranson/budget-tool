import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { toDate } from 'radix-vue/date';

const defaultLocale = 'en-US';

const formatOptions = {
    "longDate": { dateStyle: 'long' },
    "monthYearDate": { month: 'long', year: 'numeric' },
    "monthName": { month: 'long', },
    "yearNumeric": { year: 'numeric' }
};

const format = (dateValue: string | CalendarDate, optionName: string, locale: string = defaultLocale) => {

    let date = {} as Date;
    if (typeof dateValue === 'string')
    {
        date = toDate(parseDate(dateValue));
    }
    else 
    {
        date = toDate(dateValue);
    };

    const option = formatOptions[optionName];
    if (!option) 
    {
		throw new Error(`Invalid option for ${optionName}`);
	}

    const formatter = new DateFormatter(locale, option);
    return formatter.format(date);
};

export default { format };