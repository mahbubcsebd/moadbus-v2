import {
  deleteMessage,
  getInboxMessages,
  getMessageSubjects,
  getOutboxMessages,
  readInboxMessage,
  readSentMessage,
  sendSecureMessage,
} from '@/api/endpoints';
import { generatedRoi } from '@/globals/appGlobals';
import {
  filterMessages,
  parseSingleMessageResponse,
  transformMessageResponse,
} from '@/utils/messageHelpers';
import { create } from 'zustand';

export const useMessageStore = create((set, get) => ({
  // State
  messages: [],
  filteredMessages: [],
  subjects: [],
  currentStatus: 'Inbox',
  filters: {
    status: 'Inbox',
    category: 'All Categories',
    dateRange: 'Select',
  },
  loading: false,
  error: null,
  sending: false,
  readingMessage: false,

  // Fetch Inbox Messages
  fetchInboxMessages: async () => {
    set({ loading: true, error: null, currentStatus: 'Inbox' });

    try {
      const response = await getInboxMessages();
      console.log('Inbox Response:', response);

      const result = transformMessageResponse(response);

      if (result.success) {
        set({
          messages: result.messages,
          filteredMessages: result.messages,
          loading: false,
        });
      } else {
        set({ error: result.message, loading: false });
      }
    } catch (error) {
      console.error('Fetch inbox error:', error);
      set({ error: error.message || 'Failed to fetch inbox', loading: false });
    }
  },

  // Fetch Outbox Messages
  fetchOutboxMessages: async () => {
    set({ loading: true, error: null, currentStatus: 'Outbox' });

    try {
      const response = await getOutboxMessages();
      console.log('Outbox Response:', response);

      const result = transformMessageResponse(response);

      if (result.success) {
        set({
          messages: result.messages,
          filteredMessages: result.messages,
          loading: false,
        });
      } else {
        set({ error: result.message, loading: false });
      }
    } catch (error) {
      console.error('Fetch outbox error:', error);
      set({ error: error.message || 'Failed to fetch outbox', loading: false });
    }
  },

  // Change Status (Inbox/Outbox)
  changeStatus: async (status) => {
    set({
      filters: { ...get().filters, status },
    });

    if (status === 'Inbox') {
      await get().fetchInboxMessages();
    } else if (status === 'Outbox') {
      await get().fetchOutboxMessages();
    }
  },

  // Update Filters
  updateFilters: (newFilters) => {
    set({ filters: newFilters });

    const { messages } = get();
    const filtered = filterMessages(messages, newFilters);
    set({ filteredMessages: filtered });
  },

  // Clear Filters
  clearFilters: () => {
    const defaultFilters = {
      status: get().currentStatus,
      category: 'All Categories',
      dateRange: 'Select',
    };

    set({
      filters: defaultFilters,
      filteredMessages: get().messages,
    });
  },

  // Fetch Subjects
  fetchSubjects: async () => {
    try {
      const response = await getMessageSubjects();
      console.log('Subjects Response:', response);

      const rs = response?.rs || response;

      if (rs.ats && typeof rs.ats === 'string') {
        const subjectsArray = rs.ats
          .split('|')
          .filter(Boolean)
          .map((item) => {
            const [id, label] = item.split('#');
            return {
              value: id?.trim() || '',
              label: label?.trim() || '',
            };
          });

        console.log('Parsed Subjects:', subjectsArray);
        set({ subjects: subjectsArray });
      }
    } catch (error) {
      console.error('Fetch subjects error:', error);
    }
  },

  // Send New Message
  sendMessage: async (messageData) => {
    set({ sending: true, error: null });

    try {
      const payload = {
        roi: generatedRoi,
        msgLoad: messageData.subject || '',
        message: messageData.message || '',
        respType: 'json',
      };

      console.log('Sending message payload:', payload);

      const response = await sendSecureMessage(payload);
      console.log('Send Message Response:', response);

      const rs = response?.rs || response;
      const success = rs.status === 'success' || rs.ec === '0' || rs.ec === 0;

      if (success) {
        if (get().currentStatus === 'Inbox') {
          await get().fetchInboxMessages();
        } else {
          await get().fetchOutboxMessages();
        }

        set({ sending: false });

        return {
          success: true,
          message: rs.msg || 'Message sent successfully',
          ticketNumber: rs.ats || '',
        };
      } else {
        set({ sending: false, error: rs.msg || 'Failed to send message' });
        return {
          success: false,
          message: rs.msg || 'Failed to send message',
        };
      }
    } catch (error) {
      console.error('Send message error:', error);
      set({ sending: false, error: error.message || 'Failed to send message' });
      return {
        success: false,
        message: error.message || 'Failed to send message',
      };
    }
  },

  // Read Message
  readMessage: async (messageId) => {
    set({ readingMessage: true });

    try {
      const payload = {
        roi: generatedRoi,
        mnc: messageId.toString(),
        respType: 'json',
      };

      console.log('Reading message payload:', payload);

      const currentStatus = get().currentStatus;
      const response =
        currentStatus === 'Inbox'
          ? await readInboxMessage(payload)
          : await readSentMessage(payload);

      console.log('Read Message Response:', response);

      const result = parseSingleMessageResponse(response);

      if (result.success && result.message) {
        const messages = get().messages.map((msg) =>
          msg.id === messageId ? { ...msg, ...result.message, isRead: true } : msg,
        );

        const filteredMessages = get().filteredMessages.map((msg) =>
          msg.id === messageId ? { ...msg, ...result.message, isRead: true } : msg,
        );

        set({
          messages,
          filteredMessages,
          readingMessage: false,
        });

        return {
          success: true,
          message: result.message,
          rawMessage: result.rawMessage,
        };
      } else {
        set({ readingMessage: false });
        return {
          success: false,
          message: null,
          rawMessage: result.rawMessage,
        };
      }
    } catch (error) {
      console.error('Read message error:', error);
      set({ readingMessage: false });
      return {
        success: false,
        message: null,
        rawMessage: error.message || 'Failed to read message',
      };
    }
  },

  // Delete Message
  deleteMessage: async (messageId) => {
    try {
      const payload = {
        roi: generatedRoi,
        mnc: messageId.toString(),
        respType: 'json',
      };

      console.log('Deleting message payload:', payload);

      const response = await deleteMessage(payload);
      console.log('Delete Response:', response);

      const rs = response?.rs || response;
      const success = rs.status === 'success' || rs.ec === '0' || rs.ec === 0;

      if (success) {
        const messages = get().messages.filter((msg) => msg.id !== messageId);
        const filteredMessages = get().filteredMessages.filter((msg) => msg.id !== messageId);

        set({ messages, filteredMessages });
        return {
          success: true,
          message: rs.msg || 'Message deleted successfully',
        };
      } else {
        return {
          success: false,
          message: rs.msg || 'Failed to delete message',
        };
      }
    } catch (error) {
      console.error('Delete message error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete message',
      };
    }
  },

  // Reset Store
  reset: () =>
    set({
      messages: [],
      filteredMessages: [],
      subjects: [],
      currentStatus: 'Inbox',
      filters: {
        status: 'Inbox',
        category: 'All Categories',
        dateRange: 'Select',
      },
      loading: false,
      error: null,
      sending: false,
      readingMessage: false,
    }),
}));
