export const parseActivityLogs = (atsString) => {
  if (!atsString || typeof atsString !== 'string') return [];

  const rawActivities = atsString
    .split('|')
    .filter((item) => item && item.trim() !== '')
    .map((item) => {
      // Split ONLY on first '#' to separate Date and Message
      const firstHashIndex = item.indexOf('#');
      if (firstHashIndex === -1) return null;

      const dateStr = item.substring(0, firstHashIndex).trim(); // "11/27/2025"
      const message = item.substring(firstHashIndex + 1).trim(); // "Session created..."

      return {
        date: dateStr,
        description: message,
        // Assuming time is not explicitly in the string based on your payload sample,
        // but if it were, we'd extract it. For now, using placeholder or deriving from logic if needed.
        // Your mock had time, but payload only shows Date#Message.
        time: '', // Placeholder, or maybe the message contains time?
      };
    })
    .filter(Boolean);

  // Group by Date
  // Result: [{ date: '11/27/2025', activities: [...] }, ...]
  const grouped = rawActivities.reduce((acc, curr) => {
    const existingGroup = acc.find((g) => g.date === curr.date);
    if (existingGroup) {
      existingGroup.activities.push(curr);
    } else {
      acc.push({ date: curr.date, activities: [curr] });
    }
    return acc;
  }, []);

  return grouped;
};
