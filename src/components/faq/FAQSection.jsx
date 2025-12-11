import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { useState } from 'react';

const faqData = [
  {
    id: '1',
    question: 'What is online banking?',
    answer:
      'Online banking allows you to manage your bank accounts, pay bills, transfer money, and access financial services through a secure internet connection from anywhere, at any time.',
  },
  {
    id: '2',
    question: 'How do I register for online banking?',
    answer:
      'To register, click on "New Customer" or "Register" on the login page. You will need your account number, personal information, and a valid email address or phone number to complete the registration process.',
  },
  {
    id: '3',
    question: 'Is online banking secure?',
    answer:
      'Yes, we use industry-standard encryption and security measures to protect your information. We recommend using strong passwords, enabling two-factor authentication, and never sharing your login credentials.',
  },
  {
    id: '4',
    question: 'What should I do if I forget my password?',
    answer:
      'Click on "Forgot Password" on the login page. You will receive instructions via email or SMS to reset your password securely.',
  },
  {
    id: '5',
    question: 'Can I access my account from multiple devices?',
    answer:
      'Yes, you can access your online banking account from any device with an internet connection, including computers, tablets, and smartphones.',
  },
  {
    id: '6',
    question: 'How do I transfer money to another account?',
    answer:
      'Log in to your account, navigate to "Transfers", select the accounts, enter the amount, and confirm the transaction. You can transfer between your own accounts or to other bank accounts.',
  },
  {
    id: '7',
    question: 'Are there any fees for online banking?',
    answer:
      'Basic online banking services are typically free. However, certain transactions like international transfers or expedited payments may incur fees. Check our fee schedule for details.',
  },
  {
    id: '8',
    question: 'How long do transactions take to process?',
    answer:
      'Internal transfers are usually instant. Transfers to other banks may take 1-3 business days. International transfers can take 3-5 business days depending on the destination.',
  },
  {
    id: '9',
    question: 'What are the daily transaction limits?',
    answer:
      'Transaction limits vary by account type and can be viewed in your account settings. You can also request to increase limits by contacting customer support.',
  },
  {
    id: '10',
    question: 'How do I contact customer support?',
    answer:
      'You can reach our customer support team via phone, email, or live chat. Support is available 24/7 for urgent issues and during business hours for general inquiries.',
  },
];

const FAQSection = () => {
  const [openItem, setOpenItem] = useState('');

  const leftColumnFaqs = faqData.filter((_, index) => index % 2 === 0);
  const rightColumnFaqs = faqData.filter((_, index) => index % 2 !== 0);

  return (
    <section className="px-4 py-12 sm:py-16 md:py-20 bg-linear-to-br from-primary/5 via-white to-primary/5">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center sm:mb-12"
        >
          <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl sm:mb-4">
            Frequently Asked Questions
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-gray-600 sm:text-base md:text-lg">
            Find answers to common questions about our online banking services
          </p>
        </motion.div>

        {/* Single Accordion for both columns */}
        <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="space-y-3 sm:space-y-4">
              {leftColumnFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <AccordionItem
                    value={faq.id}
                    className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
                  >
                    <AccordionTrigger className="px-4 py-4 sm:px-6 sm:py-5 hover:no-underline group">
                      <div className="flex items-center justify-between w-full gap-3">
                        <span className="text-sm font-semibold text-left text-gray-900 transition-colors sm:text-base group-hover:text-primary">
                          {faq.question}
                        </span>
                        {/* <div className="flex-shrink-0">
                          {openItem === faq.id ? (
                            <Minus className="w-5 h-5 text-primary" />
                          ) : (
                            <Plus className="w-5 h-5 text-gray-400 transition-colors group-hover:text-primary" />
                          )}
                        </div> */}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-0 pb-4 sm:px-6 sm:pb-5">
                      <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-3 sm:space-y-4">
              {rightColumnFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <AccordionItem
                    value={faq.id}
                    className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
                  >
                    <AccordionTrigger className="px-4 py-4 sm:px-6 sm:py-5 hover:no-underline group">
                      <div className="flex items-center justify-between w-full gap-3">
                        <span className="text-sm font-semibold text-left text-gray-900 transition-colors sm:text-base group-hover:text-primary">
                          {faq.question}
                        </span>
                        {/* <div className="flex-shrink-0">
                          {openItem === faq.id ? (
                            <Minus className="w-5 h-5 text-primary" />
                          ) : (
                            <Plus className="w-5 h-5 text-gray-400 transition-colors group-hover:text-primary" />
                          )}
                        </div> */}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-0 pb-4 sm:px-6 sm:pb-5">
                      <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </div>
          </div>
        </Accordion>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 text-center sm:mt-12"
        >
          <p className="mb-4 text-sm text-gray-600 sm:text-base">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-all duration-300 transform bg-primary rounded-lg shadow-lg sm:px-8 sm:py-4 sm:text-base hover:bg-primary hover:shadow-xl hover:scale-105"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
