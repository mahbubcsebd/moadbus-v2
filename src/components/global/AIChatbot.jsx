import useChatbotStore from '@/store/chatbotStore';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CreditCard,
  DollarSign,
  HelpCircle,
  Minus,
  Paperclip,
  RefreshCw,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// --- Quick Suggestion Chips ---
const suggestions = [
  { id: 1, label: 'Check Balance', icon: DollarSign },
  { id: 2, label: 'Transaction History', icon: RefreshCw },
  { id: 3, label: 'Block Card', icon: CreditCard },
  { id: 4, label: 'Update Profile', icon: User },
];

export default function AIChatbot() {
  const { isOpen, isMinimized, closeChatbot, minimizeChatbot, restoreChatbot } = useChatbotStore();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // --- Initial Messages ---
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am Moadbus AI Assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- Handlers ---
  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // 2. Simulate AI Response Delay
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Your request is being processed. Please wait a moment...',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <>
      {/* --- Minimized Icon (Messenger Style) --- */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed z-50 bottom-20 right-4 md:bottom-6 md:right-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restoreChatbot}
              className="relative flex items-center justify-center w-10 h-10 text-white rounded-full shadow-2xl md:w-14 md:h-14 shadow-primary/50/30 bg-linear-to-r from-primary/50 to-primary"
            >
              <Sparkles className="w-5 h-5 md:w-7 md:h-7" />
              {/* Notification Dot */}
              <span className="absolute top-0 right-0 flex w-3 h-3">
                <span className="absolute inline-flex w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Chat Window Modal --- */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 md:bottom-10 md:right-6 z-50 w-[calc(100%-2rem)] md:w-full max-w-[400px] h-[600px] md:h-[650px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col font-sans"
          >
            {/* 1. Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-primary border-b border-orange-300 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* AI Icon with Primary Color */}
                  <div className="flex items-center justify-center w-10 h-10 text-white bg-white rounded-full shadow-md">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Moadbus AI</h3>
                  <p className="flex items-center gap-1 text-xs font-medium text-white">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Online & Ready
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={minimizeChatbot}
                  className="p-2 text-white transition-colors rounded-full hover:bg-gray-100"
                  title="Minimize"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <button
                  onClick={closeChatbot}
                  className="p-2 text-white transition-colors rounded-full hover:bg-red-50 hover:text-red-500"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. Messages Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto bg-gray-50/50 scroll-smooth">
              {/* Date Separator */}
              <div className="flex justify-center">
                <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wide">
                  Today
                </span>
              </div>

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex w-full flex-col gap-1 ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`flex max-w-[85%] ${
                      msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    } gap-3 items-end`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-orange-100 text-primary'
                      }`}
                    >
                      {msg.sender === 'user' ? 'ME' : <Sparkles className="w-4 h-4" />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`relative p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm' // User Message Blue
                          : 'bg-white text-gray-700 border border-gray-100 rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Time placed below bubble */}
                  <span
                    className={`text-[10px] text-gray-400 px-1 ${
                      msg.sender === 'user' ? 'mr-11' : 'ml-11'
                    }`}
                  >
                    {msg.time}
                  </span>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start ml-11"
                >
                  <div className="flex items-center justify-center w-16 p-4 bg-white border border-gray-100 rounded-bl-sm shadow-sm rounded-2xl">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 3. Quick Suggestions (Horizontal Scroll) */}
            <div className="px-4 pt-3 pb-2 border-t border-gray-100 bg-gray-50/50">
              {/* 'touch-pan-x' and 'overflow-x-auto' ensures scrolling on all devices */}
              <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide touch-pan-x">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSendMessage(suggestion.label)}
                    className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all shadow-sm shrink-0 select-none"
                  >
                    <suggestion.icon className="w-3 h-3" />
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative flex items-end gap-2 p-2 transition-all border border-gray-200 bg-gray-50 rounded-xl">
                {/* Attachment Button */}
                <button className="p-2 text-gray-400 transition-colors rounded-lg hover:text-blue-600 hover:bg-blue-50">
                  <Paperclip className="w-5 h-5" />
                </button>

                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your question here..."
                  className="w-full max-h-24 bg-transparent border-none focus:border-0 focus:ring-0 outline-none focus:outline-none resize-none text-sm text-gray-800 placeholder:text-gray-400 py-2.5"
                  rows={1}
                  style={{ minHeight: '40px' }}
                />

                {/* Send Button */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    inputValue.trim()
                      ? 'bg-primary text-white shadow-md hover:bg-primary hover:scale-105 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Footer Branding */}
              <div className="mt-2 text-center">
                <p className="text-[10px] text-gray-400 font-medium flex items-center justify-center gap-1">
                  Powered by <span className="font-bold text-blue-600">Moadbus AI</span>
                  <HelpCircle className="w-3 h-3" />
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
