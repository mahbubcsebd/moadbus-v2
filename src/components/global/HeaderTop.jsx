import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

const HeaderTop = ({ title, text, link, linkText }) => {
  return (
    <>
      <Link
        to={link}
        className="inline-flex items-center gap-2 mb-6 text-gray-600 transition-colors hover:text-primary"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">{linkText}</span>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500">{text}</p>
      </motion.div>
    </>
  );
};

export default HeaderTop;
