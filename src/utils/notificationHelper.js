/**
 * Parse Global Notifications
 * Handles both Raw String ("59#A#...") and Categorized Object ({ alert: "...", reminder: "..." })
 */
export const parseNotifications = (data) => {
  // 1. Initialize Categories
  const categories = {
    alerts: { id: 'alert', title: 'Alert Notifications', messages: [] },
    promotions: { id: 'promo', title: 'Promotion Notifications', messages: [] },
    reminders: { id: 'remind', title: 'Reminder Notifications', messages: [] },
  };

  if (!data) return Object.values(categories);

  // 2. Combine data into a single raw string for processing
  let combinedString = '';

  if (typeof data === 'string') {
    // If it's the raw "nfg" string
    combinedString = data;
  } else if (typeof data === 'object') {
    // If it's an object like { alert: "...", reminder: "..." }
    // We join all values with a pipe | to process them uniformly
    combinedString = [
      data.alert || '',
      data.promotion || '',
      data.reminder || '',
      data.nfg || '', // fallback
    ].join('|');
  }

  // 3. Split and Process
  const rawList = combinedString.split('|').filter((item) => item && item.trim() !== '');

  rawList.forEach((item) => {
    // Expected Format: ID#Type#Scope#Message#Status
    const parts = item.split('#');

    // Safety check: Need at least ID, Type, and Message
    if (parts.length < 4) return;

    const id = parts[0];
    const type = parts[1]?.trim(); // A, P, R (Trim added for safety)
    let content = parts[3] || '';

    // Double Decode for content (handles %2520 -> %20 -> Space)
    try {
      content = decodeURIComponent(decodeURIComponent(content));
    } catch (e) {
      // Keep original if decode fails
    }

    const messageObj = {
      id,
      content,
      date: new Date().toISOString().split('T')[0], // Fallback date
      type,
    };

    // 4. Categorize
    if (type === 'A') {
      categories.alerts.messages.push(messageObj);
    } else if (type === 'P') {
      categories.promotions.messages.push(messageObj);
    } else if (type === 'R') {
      categories.reminders.messages.push(messageObj);
    }
  });

  return Object.values(categories);
};
