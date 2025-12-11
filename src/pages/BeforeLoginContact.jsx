import ContactOptions from '@/components/contact-us/ContactOptions';
import MapLocation from '@/components/contact-us/MapLocation';
import Banner from '@/components/global/Banner';
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

export default function BeforeLoginContact() {
  return (
    <>
      <Banner
        image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
        title="Contact Us"
        text="Build something extraordinary with us."
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 p-4"
      >
        {/* Contact Options Grid */}
        <ContactOptions data={contactData} />

        {/* Map and Location Detail */}
        <MapLocation locationData={contactData.office} />
      </motion.div>
    </>
  );
}
