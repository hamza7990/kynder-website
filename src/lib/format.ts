/**
 * Number and date formatting for the dashboard.
 *
 * Numbers, dates and times ALWAYS render in Western (Latin) digits and a clear,
 * stable format — in both English and Arabic. We pin the formatting locale to
 * 'en-GB' so Arabic mode never falls back to Arabic-Indic digits (٠١٢…), which
 * the brief requires. Interface *labels* are translated; *data* is not.
 */
const FORMAT_LOCALE = 'en-GB';

export function formatDate(value: Date | string | number): string {
  return new Date(value).toLocaleDateString(FORMAT_LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(value: Date | string | number): string {
  return new Date(value).toLocaleString(FORMAT_LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatNumber(value: number): string {
  return value.toLocaleString(FORMAT_LOCALE);
}
