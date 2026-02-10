class DateTimeService {
    static formatTimestamp(ts?: string): string {
        if (!ts) return "";
        const d = new Date(ts);
        if (Number.isNaN(d.getTime())) return ts;
        return d.toLocaleString();
    }

    static formatTime(
        value?: string | number | Date,
        locale?: string,
        options?: Intl.DateTimeFormatOptions
    ): string {
        if (value == null || value === "") return "";
        try {
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) return "";
            return d.toLocaleTimeString(locale, options);
        } catch {
            return "";
        }
    }

    static formatDateTime(
        value?: string | number | Date,
        locale?: string,
        options?: Intl.DateTimeFormatOptions,
        invalidFallback = ""
    ): string {
        if (value == null || value === "") return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return invalidFallback;
        return d.toLocaleString(locale, options);
    }
}

export default DateTimeService;
