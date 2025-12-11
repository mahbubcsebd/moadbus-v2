import useChatbotStore from '@/store/chatbotStore';
import { useTranslation } from '@/utils/t';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Calendar, Send, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function QuickActions() {
  const { toggleChatbot } = useChatbotStore();
  const t = useTranslation();

  const actions = [
    {
      id: 1,
      title: 'Transfer',
      description: t('nav2_between_my_account_p'),
      icon: ArrowLeftRight,
      bgColor: 'bg-primary/10',
      slug: 'dashboard/transfers/transfer-between-own-acccounts',
    },
    {
      id: 2,
      title: 'AI Agent',
      description: 'Chat with more advanced AI',
      icon: Send,
      bgColor: 'bg-primary/10',
      slug: 'pay-bill',
    },
    {
      id: 3,
      title: 'Appointment',
      description: 'Meet with our banking specialists for personalized assistance',
      icon: Calendar,
      bgColor: 'bg-primary/10',
      slug: 'dashboard/appointments',
    },
    {
      id: 4,
      title: 'P2P Payments',
      description: 'Send money quickly and securely to friends, family, and contacts',
      icon: Users,
      bgColor: 'bg-primary/10',
      slug: 'dashboard/p2p-send',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid items-stretch grid-cols-2 gap-2 xl:grid-cols-4 lg:gap-4"
    >
      {actions.map((action) => {
        const Icon = action.icon;

        // If it's the AI Agent → open chatbot instead of routing
        if (action.id === 2) {
          return (
            <motion.button
              key={action.id}
              onClick={toggleChatbot}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center w-full h-full gap-2 p-2 text-left transition-all bg-white border border-gray-200 rounded-lg lg:rounded-xl md:p-4 lg:p-4 xl:p-5 hover:border-orange-200 hover:shadow-md lg:block lg:gap-0"
            >
              <div
                className={`w-8 lg:w-10 h-8 lg:h-10 rounded-lg flex items-center justify-center lg:mb-3 ${action.bgColor}`}
              >
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              </div>

              <h3 className="font-semibold text-[#09090B] text-sm md:text-base lg:mb-2">
                {action.title}
              </h3>
              <p className="hidden lg:block text-xs md:text-sm text-[#71717A] leading-snug">
                {action.description}
              </p>
            </motion.button>
          );
        }

        // Default items (use <Link>)
        return (
          <Link key={action.id} to={`/${action.slug}`} className="block h-full">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center h-full gap-2 p-2 text-left transition-all bg-white border border-gray-200 rounded-lg lg:rounded-xl md:p-4 lg:p-4 xl:p-5 hover:border-orange-200 hover:shadow-md lg:block lg:gap-0"
            >
              <div
                className={`w-8 lg:w-10 h-8 lg:h-10 rounded-lg flex items-center justify-center lg:mb-3 ${action.bgColor}`}
              >
                <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              </div>

              <h3 className="font-semibold text-[#09090B] text-sm md:text-base lg:mb-2">
                {action.title}
              </h3>
              <p className="hidden lg:block text-xs md:text-sm text-[#71717A] leading-snug">
                {action.description}
              </p>
            </motion.div>
          </Link>
        );
      })}
    </motion.div>
  );
}
