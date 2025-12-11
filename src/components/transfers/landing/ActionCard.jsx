import { motion } from 'framer-motion';
import { useEffect } from 'react';
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

const ActionCard = ({ title, icon: Icon, href, description, badge }) => {
  useEffect(() => {}, []);
  return (
    <Link to={href} className="block h-full">
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-lg lg:rounded-xl p-4 border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all text-left block h-full"
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-primary/5 `}>
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-[#09090B] text-sm md:text-base">{title}</h3>
      </motion.div>
    </Link>
  );
};

export default ActionCard;
