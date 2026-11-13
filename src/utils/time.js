/**
 * Bangladesh Standard Time (BST / Asia/Dhaka, UTC+6) Utilities
 * Provides unified, timezone-consistent timestamps across all components.
 */

/**
 * Returns the current time formatted for Bangladesh Standard Time (Asia/Dhaka).
 *
 * @param {Object} [options]
 * @param {boolean} [options.includeSeconds=true] - Whether to include seconds (e.g. '03:45:12 PM' vs '03:45 PM')
 * @param {boolean} [options.hour12=true] - 12-hour format with AM/PM
 * @param {Date} [options.date=new Date()] - Custom date instance (defaults to now)
 * @returns {string} Formatted BST time string
 */
export const getDhakaTime = (options = {}) => {
  const { includeSeconds = true, hour12 = true, date = new Date() } = options;

  try {
    const formatOptions = {
      timeZone: 'Asia/Dhaka',
      hour: includeSeconds ? '2-digit' : 'numeric',
      minute: '2-digit',
      hour12,
    };
    if (includeSeconds) {
      formatOptions.second = '2-digit';
    }
    return new Intl.DateTimeFormat('en-US', formatOptions).format(date);
  } catch {
    try {
      const fallbackOptions = {
        hour: includeSeconds ? '2-digit' : 'numeric',
        minute: '2-digit',
        hour12,
      };
      if (includeSeconds) {
        fallbackOptions.second = '2-digit';
      }
      return date.toLocaleTimeString('en-US', fallbackOptions);
    } catch {
      return '';
    }
  }
};
