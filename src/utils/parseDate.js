import { DateUtils } from 'react-day-picker';
import dateFnsParse from 'date-fns/parse';

export function parseDate(str, format, locale) {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
        return parsed;
    }
    return undefined;
}