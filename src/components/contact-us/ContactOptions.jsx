import { motion } from 'framer-motion';
import { Globe, Mail, Phone } from 'lucide-react';
// import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router';

const ContactCard = ({ icon, title, content, link, linkPrefix = '', color }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.05, y: -5 }}
    className={`bg-white rounded-xl shadow-lg border-2 ${
      color === 'orange'
        ? 'border-primary/10 hover:border-primary/30'
        : 'border-blue-100 hover:border-blue-300'
    } p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-xl group`}
  >
    <Link to={linkPrefix + link} target="_blank" className="block">
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
        className={`flex items-center justify-center w-14 h-14 mx-auto rounded-full mb-4 ${
          color === 'orange'
            ? 'bg-linear-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/50 group-hover:to-primary group-hover:text-white'
            : 'bg-linear-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white'
        } transition-all duration-300`}
      >
        {icon}
      </motion.div>
      <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">{title}</p>
      <p
        className={`text-sm font-semibold ${
          color === 'orange'
            ? 'text-primary group-hover:text-orange-700'
            : 'text-blue-600 group-hover:text-blue-700'
        } transition-colors truncate`}
      >
        {content}
      </p>
    </Link>
  </motion.div>
);

const ContactOptions = ({ data }) => {
  const cardData = [
    {
      icon: <FaWhatsapp className="w-6 h-6" />,
      title: data.whatsapp.label,
      content: data.whatsapp.number,
      link: `https://wa.me/${data.whatsapp.number.replace(/\D/g, '')}`,
      color: 'orange',
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: data.call.label,
      content: data.call.number,
      link: `tel:${data.call.number}`,
      color: 'blue',
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: data.email.label,
      content: data.email.address,
      link: `mailto:${data.email.address}`,
      color: 'orange',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: data.website.label,
      content: data.website.url.replace('https://', ''),
      link: data.website.url,
      color: 'blue',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
      {cardData.map((card, index) => (
        <ContactCard
          key={index}
          icon={card.icon}
          title={card.title}
          content={card.content}
          link={card.link}
          color={card.color}
        />
      ))}
    </div>
  );
};

export default ContactOptions;
