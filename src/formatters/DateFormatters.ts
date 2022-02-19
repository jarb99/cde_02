const dateFormatOptions: Intl.DateTimeFormatOptions = {day: "numeric", month: "short", year: "numeric"};
const timeFormatOptions: Intl.DateTimeFormatOptions = {hour12: true, hour: "numeric", minute: "2-digit"};

const formatDate = (date: Date | null): string =>
  date ? date.toLocaleString(undefined, dateFormatOptions) : "";

const formatTime = (date: Date | null): string =>
  date ? date.toLocaleString(undefined, timeFormatOptions) : "";

export {formatDate, formatTime};


