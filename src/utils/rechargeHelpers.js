export const parseTopUpList = (response) => {
  const rs = response?.rs || response;

  if (!rs || !rs.p) return [];

  return rs.p
    .split('|')
    .filter(Boolean)
    .map((item) => {
      const parts = item.split(';');
      if (parts.length < 3) return null;

      const id = parts[0];
      const name = parts[1];
      const phone = parts[2];

      return {
        value: phone,
        label: `${phone} (${name})`,
        id: id,
        name: name,
        phone: phone,
        operatorCode: parts[3] || '',
        operatorName: parts[4] || '',
      };
    })
    .filter(Boolean);
};

/**
 * Parses Confirmation Receipt String
 */
export const parseRechargeReceipt = (rcptString) => {
  if (!rcptString) return [];

  // Format: "Key#Value|Key#Value|..."
  return rcptString
    .split('|')
    .filter(Boolean)
    .map((item) => {
      const [key, value] = item.split('#');
      return { label: key, value: value || '' };
    });
};

/**
 * Generates Unique ID for transaction
 */
export const generateUniqueID = () => {
  return `${Date.now()}_${Math.floor(Math.random() * 1000000000)}`;
};
