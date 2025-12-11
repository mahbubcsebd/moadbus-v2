// utils/branchAtmHelpers.js

export function parseBranchAtmResponse(response) {
  try {
    // Wrapper 'rs' object return kore, tai direct check korchi
    const rs = response?.rs || response;

    if (!rs || !rs.lc) {
      return {
        success: false,
        locations: [],
        message: rs?.msg || 'No locations found',
      };
    }

    // 1. Pipe (|) diye split kore alada location ber kora
    const rawLocations = rs.lc.split('|').filter((item) => item.trim() !== '');

    const locations = rawLocations
      .map((item, index) => {
        // 2. Hash (#) diye split kore details ber kora
        const parts = item.split('#');

        // Safe check for coordinates
        const coords = parts[2] ? parts[2].split(',') : [0, 0];

        // Type 'b' = Branch, 'a' = ATM
        const typeCode = parts[3];
        const type = typeCode === 'a' ? 'ATM' : 'Branch';

        // Time Parsing
        const openTime = parts[6];
        const closeTime = parts[7];
        let formattedTime = 'N/A';

        if (openTime && closeTime) {
          formattedTime = `${openTime} - ${closeTime}`;
        } else if (type === 'ATM') {
          formattedTime = '24 Hours';
        }

        // Distance formatting (index 12 or last valid part)
        // Screenshot e distance format chilo: "1 m ( 1 min )"
        const distanceRaw = parts[12] || '';

        return {
          id: index + 1,
          name: decodeURIComponent(parts[0] || `Unknown ${type}`),
          address: decodeURIComponent(parts[1] || ''),
          lat: parseFloat(coords[0]) || 0,
          lng: parseFloat(coords[1]) || 0,
          type: type,
          phone: parts[4] || 'N/A',
          fax: parts[10] || 'N/A',
          time: formattedTime,
          distance: decodeURIComponent(distanceRaw),
        };
      })
      .filter((loc) => loc.lat !== 0); // Invalid coordinate remove kora

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
