/**
 * Parse message string format: "id#date#subject#status|id#date#subject#status|"
 * Or for read messages: "id#date#subject#content#status|"
 */
export function parseMessages(messageString) {
  if (!messageString || typeof messageString !== 'string' || messageString.trim() === '') {
    return [];
  }

  return messageString
    .split('|')
    .filter(Boolean)
    .map((msg) => {
      const parts = msg.split('#');

      // Check if it has content (read message format)
      const hasContent = parts.length > 4;

      return {
        id: parseInt(parts[0]) || 0,
        date: parts[1]?.trim() || '',
        subject: parts[2]?.trim() || '',
        content: hasContent ? parts[3]?.trim() || '' : '',
        status: hasContent ? parts[4]?.trim() || 'P' : parts[3]?.trim() || 'P',
        isRead: (hasContent ? parts[4]?.trim() : parts[3]?.trim()) === 'R',
        category: parts[2]?.trim() || '',
      };
    });
}

/**
 * Transform API response - handles pipe-separated message strings
 */
export function transformMessageResponse(response) {
  try {
    const rs = response?.rs || response;

    if (!rs) {
      throw new Error('Invalid response structure');
    }

    // Check if response is successful
    const isSuccess = rs.status === 'success' || rs.ec === '0' || rs.ec === 0;

    // Check if ats field exists
    if (rs.ats !== undefined && rs.ats !== null) {
      if (rs.ats === '' || rs.ats.trim() === '') {
        return {
          success: isSuccess,
          messages: [],
          message: 'No messages available',
        };
      }

      // If ats has data, parse it
      if (typeof rs.ats === 'string') {
        const parsedMessages = parseMessages(rs.ats);

        return {
          success: isSuccess,
          messages: parsedMessages,
          message: rs.msg || 'Success',
        };
      }
    }

    // If ats field doesn't exist but response is successful
    if (isSuccess) {
      return {
        success: true,
        messages: [],
        message: 'No messages available',
      };
    }

    // If response is not successful
    return {
      success: false,
      messages: [],
      message: rs.msg || 'Failed to load messages',
    };
  } catch (error) {
    console.error('Transform error:', error);
    return {
      success: false,
      messages: [],
      message: error.message || 'Failed to parse messages',
    };
  }
}

/**
 * Parse single message response (for read message)
 */
export function parseSingleMessageResponse(response) {
  try {
    const rs = response?.rs || response;

    if (!rs) {
      throw new Error('Invalid response structure');
    }

    // Check if ats field exists (message content)
    if (rs.ats && typeof rs.ats === 'string') {
      const parsedMessages = parseMessages(rs.ats);

      // Should only have one message
      if (parsedMessages.length > 0) {
        return {
          success: rs.status === 'success' || rs.ec === '0' || rs.ec === 0,
          message: parsedMessages[0],
          rawMessage: rs.msg || 'Success',
        };
      }
    }

    return {
      success: false,
      message: null,
      rawMessage: rs.msg || 'No message content',
    };
  } catch (error) {
    console.error('Parse single message error:', error);
    return {
      success: false,
      message: null,
      rawMessage: error.message || 'Failed to parse message',
    };
  }
}

/**
 * Filter messages based on criteria
 */
export function filterMessages(messages, filters) {
  return messages.filter((msg) => {
    // Category filter
    if (filters.category && filters.category !== 'All Categories') {
      if (!msg.subject.toLowerCase().includes(filters.category.toLowerCase())) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'Select') {
      const messageDate = new Date(msg.date);
      const now = new Date();

      // Custom date range
      if (filters.dateRange === 'Custom' && filters.customDateRange) {
        const fromDate = new Date(filters.customDateRange.from);
        const toDate = new Date(filters.customDateRange.to);

        // Set time to start/end of day for accurate comparison
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        if (messageDate < fromDate || messageDate > toDate) {
          return false;
        }
      } else {
        // Predefined date ranges
        switch (filters.dateRange) {
          case 'Last 30 Days':
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);
            if (messageDate < thirtyDaysAgo) return false;
            break;
          case 'Last 90 Days':
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(now.getDate() - 90);
            if (messageDate < ninetyDaysAgo) return false;
            break;
          case 'Last 6 Months':
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(now.getMonth() - 6);
            if (messageDate < sixMonthsAgo) return false;
            break;
          case 'Last Year':
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            if (messageDate < oneYearAgo) return false;
            break;
        }
      }
    }

    return true;
  });
}
