import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { toDate } from 'radix-vue/date';

const defaultLocale = 'en-US';

const formatOptions = {
    "longDate": { dateStyle: 'long' },
    "monthYearDate": { month: 'long', year: 'numeric' },
    "monthName": { month: 'long', },
    "yearNumeric": { year: 'numeric' },
    "murica": { month: '2-digit', day: '2-digit', year: 'numeric'}
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

const addDateSuffix = (dateString: string) => {
    const date = parseInt(dateString);
    if(isNaN(date)){
        return '';
    }

    if (date >= 11 && date <= 13) {
        return `${date}th`;
    };

    switch (date % 10) {
        case 1: return `${date}st`;
        case 2: return `${date}nd`;
        case 3: return `${date}rd`;
        default: return `${date}th`;
    }
};

export default { format, addDateSuffix };