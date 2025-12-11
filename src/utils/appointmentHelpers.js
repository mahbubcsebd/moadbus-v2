// utils/branchAtmHelpers.js

/**
 * Formats YYYY-MM-DD (Input Date) to MM/DD/YYYY (API Date)
 */
export const formatDateForApi = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${month}/${day}/${year}`;
};

/**
 * Parse Services
 */
export const parseServices = (rawString) => {
  if (!rawString) return [];
  const items = rawString.split('|').filter(Boolean);

  return items.map((item) => {
    const cleanItem = item.replace(/;/g, '');
    const parts = cleanItem.split('#');
    return {
      value: parts[0],
      label: parts[1],
    };
  });
};

/**
 * Parse Times
 */
export const parseTimes = (rawString) => {
  if (!rawString) return [];
  const items = rawString.split('|').filter(Boolean);

  return items.map((item) => {
    const parts = item.split('#');
    return parts[1]; // Return just the time string
  });
};

/**
 * Parse Branch/ATM Response (Updated ID Logic)
 */
export function parseBranchAtmResponse(response) {
  try {
    const rs = response?.rs || response;

    if (!rs || !rs.lc) {
      return {
        success: false,
        locations: [],
        message: rs?.msg || 'No locations found',
      };
    }

    const rawLocations = rs.lc.split('|').filter((item) => item.trim() !== '');

    const locations = rawLocations
      .map((item) => {
        const parts = item.split('#');
        const coords = parts[2] ? parts[2].split(',') : [0, 0];
        const typeCode = parts[3];
        const type = typeCode === 'a' ? 'ATM' : 'Branch';

        const openTime = parts[6];
        const closeTime = parts[7];
        let formattedTime = 'N/A';
        if (openTime && closeTime) {
          formattedTime = `${openTime} - ${closeTime}`;
        } else if (type === 'ATM') {
          formattedTime = '24 Hours';
        }

        // CRITICAL FIX: Use parts[5] as ID. If missing, fallback to random/index
        // Screenshot shows 'Branch 1' has 0 at index 5. 'Branch 2' has 1.
        const realId = parts[5];

        return {
          id: realId, // Use the real ID from server
          name: decodeURIComponent(parts[0] || `Unknown ${type}`),
          address: decodeURIComponent(parts[1] || ''),
          lat: parseFloat(coords[0]) || 0,
          lng: parseFloat(coords[1]) || 0,
          type: type,
          phone: parts[4] || 'N/A',
          time: formattedTime,
          distance: decodeURIComponent(parts[12] || ''),
        };
      })
      .filter((loc) => loc.lat !== 0);

    return {
      success: true,
      locations: locations,
      message: 'Success',
    };
  } catch (error) {
    console.error('Parse branch/ATM response error:', error);
    return {
      success: false,
      locations: [],
      message: 'Failed to parse data',
    };
  }
}

/**
 * Parse Receipt String
 * Input: "Where# Branch 2| Service Officer#| Service#Accounts..."
 * Output: [{ label: "Where", value: "Branch 2" }, ...]
 */
export const parseReceipt = (rcptString) => {
  if (!rcptString) return [];

  const items = rcptString.split('|').filter((item) => item && item.trim().length > 0);

  return items
    .map((item) => {
      const parts = item.split('#');
      return {
        label: parts[0]?.trim(),
        value: parts[1]?.trim(),
      };
    })
    .filter((item) => item.value && item.value !== '');
};
