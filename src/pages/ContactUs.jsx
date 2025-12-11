import ContactOptions from '@/components/contact-us/ContactOptions';
import MapLocation from '@/components/contact-us/MapLocation';
import HeaderTop from '@/components/global/HeaderTop';
import { motion } from 'framer-motion';

// Contact Data
const contactData = {
  whatsapp: {
    number: '+1 (703) 953-7415',
    label: 'WHATSAPP',
  },
  call: {
    number: '+1 (703) 953-7415',
    label: 'CALL US AT',
  },
  email: {
    address: 'info@finxact.com',
    label: 'EMAIL ADDRESS',
  },
  website: {
    url: 'https://www.finxact.com/',
    label: 'WEBSITE',
  },
  office: {
    name: 'Moadbus from Fiserv',
    address1: '1301 Riverplace Blvd #500T,',
    address2: 'Jacksonville, FL 32207, United States',
    mapCenter: { lat: import.meta.env.VITE_LATITUDE, lng: import.meta.env.VITE_LONGITUDE },
  },
};

export default function ContactUs() {
  return (
    <div className="p-6">
      <HeaderTop
        title="Contact Us"
        text="We're here to help. If you have any questions or suggestions about our products or services, please reach us on any of the options below."
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Contact Options Grid */}
        <ContactOptions data={contactData} />

        {/* Map and Location Detail */}
        <MapLocation locationData={contactData.office} />
      </motion.div>
    </div>
  );
}
