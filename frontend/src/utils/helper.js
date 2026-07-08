/**
 * Formated date-time string into dd/mm/yyyy hh:min:ss
 *
 * @param {string} isoString 
 * @returns {string} - Format is DD/MM/YYYY hh:min:ss
 */
export const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  
  const yy = String(date.getFullYear()); // 2 digit year
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // month (01-12)
  const dd = String(date.getDate()).padStart(2, '0'); // date (01-31)
  const hh = String(date.getHours()).padStart(2, '0'); // hour (00-23)
  const min = String(date.getMinutes()).padStart(2, '0'); // minute (00-59)
  const ss = String(date.getSeconds()).padStart(2, '0'); // second (00-59)

  return `${dd}/${mm}/${yy} ${hh}:${min}:${ss}`;
}

/**
 * Formated time string into hh:min:ss
 *
 * @param {*} isoString 
 * @returns {string} - Format is hh:min:ss
 */
export const formatTime = (isoString) => {
  const date = new Date(isoString)

  const hh = String(date.getHours()).padStart(2, '0'); // hour (00-23)
  const min = String(date.getMinutes()).padStart(2, '0'); // minute (00-59)
  const ss = String(date.getSeconds()).padStart(2, '0'); // second (00-59)

  return `${hh}:${min}:${ss}`;
}

export const calculateTrend = (currentValue, previousValue) => {
  if (
    currentValue === undefined ||
    currentValue === null ||
    previousValue === undefined ||
    previousValue === null
  ) {
    return {
      text: '--',
      isUp: null
    };
  }

  let diff;
  // Avoid 0 divide
  if (previousValue === 0) {
    if (currentValue === 0) {
      return {
        text: '0.0%',
        isUp: false
      };
    }

    diff = currentValue - previousValue;
    return {
      text: `↑ +${diff.toFixed(1)}`,
      isUp: true
    };
  }

  diff = currentValue - previousValue;
  const percent = Math.abs((diff / previousValue) * 100);

  return {
    text: `${diff >= 0 ? '↑' : '↓'} ${percent.toFixed(1)}%`,
    isUp: diff >= 0
  };
};