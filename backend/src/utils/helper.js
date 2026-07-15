/**
 * Sensoring actual whatsapp number
 *
 * @param {string} phoneNumber 
 * @returns {string} 
 */
export const formatAndMaskResponse = (rawNumber) => {
  if (!rawNumber) return null;

  let cleanNum = String(rawNumber).replace(/\D/g, '');

  if (cleanNum.startsWith('62')) {
    const localPart = '0' + cleanNum.slice(2);
    
    const prefix = localPart.slice(0, 3); 
    const suffix = localPart.slice(-3); 
    const maskedLength = localPart.length - 6;
    
    const asterisks = '*'.repeat(maskedLength);

    return `+62 ${prefix}${asterisks}${suffix}`;
  }

  if (cleanNum.length > 6) {
    return `${cleanNum.slice(0, 3)}****${cleanNum.slice(-3)}`;
  }

  return cleanNum;
};


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

/**
 * Conditional status each status type
 *
 * @param {"temp" | "humid" | "gas"} typeStatus 
 * @param {string} status 
 * @returns {("🔵" | "🟢" | "🟡" | "🔴" | "🟤" | "🟠" | "undefined")} 
 */
export const emojiStatusCondition = (typeStatus, status) => {
  switch (typeStatus) {
    case 'temp':
      if (status === 'cold') return '🔵'
      if (status === 'normal') return '🟢'
      if (status === 'hot') return '🟡'
      if (status === 'very hot') return '🔴'
      break;
    case 'humid':
      if (status === 'very dry') return '🟤'
      if (status === 'dry') return '🟡'
      if (status === 'normal') return '🟢'
      if (status === 'humid') return '🔴'
      break;
    case 'gas':
      if (status === 'normal') return '🟢'
      if (status === 'warning') return '🟡'
      if (status === 'danger') return '🟠'
      if (status === 'critical') return '🔴'
      break;
  }
}

/**
 * Parsing the period input from grafik command
 *
 * @param {*} periodInput 
 * @returns {({ isValid: boolean; totalDays: number; interval: string; message: string; } | { isValid: boolean; message: string })} 
 */
export const parsePeriod = (periodInput) => {
  if (!periodInput) {
    return { isValid: true, totalDays: 1, interval: '1h', message: 'Default 1 day' };
  }

  const regex = /^(\d+)([dwm])$/;
  const match = periodInput.toLowerCase().trim().match(regex);

  if (!match) return {
    isValid: false,
    message: "❌ Format periode salah! Gunakan angka diikuti d/w/m.\nContoh: `!grafik 3d`, `!grafik 2w`, `!grafik 1m`"
  }

  const value = parseInt(match[1], 10)
  const unit = match[2];

  let totalDays = 0;
  let interval = '1d';

  switch (unit) {
    case 'd':
      totalDays = value;
      interval = '1h'; // Rule: Day range -> hourly average
      break;
    case 'w':
      totalDays = value * 7;
      interval = '6h'; // Rule: Weekly range -> average per 6 hours
      break;
    case 'm':
      totalDays = value * 30;
      interval = '1d'; // Rule: Month range -> daily average
      break;
  }

  if (totalDays > 365) {
    return {
      isValid: false,
      message: '❌ Batas maksimal pelaporan grafik adalah 1 tahun (365 hari atau 12m)!'
    };
  }

  return {
    isValid: true,
    totalDays,
    interval,
    message: 'success'
  };
}

/**
 * Whatsapp ID number formatter
 *
 * @param {string} chatId 
 * @returns {string} 
 */
export const extractPhoneNumber = (chatId) => {
  if (!chatId || typeof chatId !== 'string') return null;

  if (chatId.endsWith('@c.us')) {
    return chatId.replace('@c.us', '');
  }

  if (chatId.endsWith('@g.us')) {
    return chatId.replace('@g.us', '');
  }

  return chatId;
};