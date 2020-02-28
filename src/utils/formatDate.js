import dateFnsFormat from 'date-fns/format';

export function formatDate(date, format, locale) {
    return dateFnsFormat(date, format, { locale });
}