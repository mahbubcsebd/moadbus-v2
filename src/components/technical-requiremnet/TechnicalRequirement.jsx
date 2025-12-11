import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

const TechnicalRequirement = () => {
  return (
    <div className="px-4 py-12 sm:py-16 md:py-20 bg-linear-to-br from-primary/5 via-white to-primary/5">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center sm:mb-12"
        >
          <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl sm:mb-4">
            Privacy Policy
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-gray-600 sm:text-base md:text-lg">
            Here is our privacy and policy
          </p>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="container"
      >
        <div className="prose prose-gray max-w-none">
          <section className="mb-7">
            <p className="mb-4 leading-relaxed text-gray-700">
              Your privacy is very important to Moadbus. As a member, you share all kinds of
              personal data with Moadbus. For example, when using your Acuito card, when in contact
              with our customer service or when you make use of the E-Branch or Mobile application.
              Of course, there are many more instances where you share personal information with
              Moadbus.
            </p>
            <p className="mb-4 leading-relaxed text-gray-700">
              Moadbus does recognize that it is critical for you to be confident that your privacy
              is protected. Therefore we commit ourselves to maintain confidential the information
              entrusted to us except in cases where either you specifically have given permission to
              Moadbus to share your personal information to third parties and/or when the law allows
              or obligates Moadbus to do so.
            </p>
            <p className="leading-relaxed text-gray-700">
              This Moadbus Privacy Policy provides information on how Moadbus approaches processing
              of your personal data.
            </p>
          </section>

          {/* Definitions */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Key Definitions</h2>

            <div className="p-4 mb-4 border-l-4 border-primary bg-primary/5">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Personal Data</h3>
              <p className="leading-relaxed text-gray-700">
                Personal data means any information relating to an identified or identifiable
                natural person; an identifiable natural person is one who can be identified,
                directly or indirectly. Information relating to a legal entity is not personal data,
                but information relating to a legal entity's director, ultimate beneficial owner,
                contact person or representative does count as personal data.
              </p>
            </div>

            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Processing</h3>
              <p className="leading-relaxed text-gray-700">
                Processing means any operation or set of operations which is performed on personal
                data or on sets of personal data, such as collection, recording, organizing,
                storing, adapting or altering, retrieving, consulting, using, disclosing by
                transmission, dissemination or otherwise making available, as well as combining,
                comparing, restricting, erasing or destruction of data, as indicated by law.
              </p>
            </div>
          </section>

          {/* Information Collection */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Information We Collect</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              Personal information that Moadbus collects and processes may include:
            </p>
            <ul className="mb-4 space-y-2 text-gray-700 list-disc list-inside">
              <li>
                Your name, address, telephone number, occupation or nature of your business and date
                of birth
              </li>
              <li>
                Identification, such as a valid driver's license, ID-card or passport. Moadbus may
                also ask for documents such as a recent utility bill to verify your name and address
              </li>
              <li>Information about beneficial owners, intermediaries and other parties</li>
              <li>Your annual income, assets and liabilities and credit history</li>
              <li>
                Information about your transactions, including payment history, account activity and
                how you intend to use the account or service and the source of any incoming funds or
                assets
              </li>
              <li>
                Information about third parties such as your spouse if you are applying for certain
                services
              </li>
            </ul>
            <p className="leading-relaxed text-gray-700">
              In addition, Moadbus offers mobile applications or services that use information about
              your location. If you choose to use such applications or services, Moadbus may, if the
              settings on your mobile device allow this, collect information about your location
              (for example, GPS signals) to provide you with the services you request.
            </p>
          </section>

          {/* Purpose */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Purpose of Data Collection</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              Moadbus may collect your personal information for the following purposes:
            </p>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>To confirm your identity and other personal information</li>
              <li>To set up, manage and offer services that you requested</li>
              <li>To satisfy legal and regulatory requirements</li>
              <li>To ensure the normal operation of Moadbus</li>
              <li>To help Moadbus collect a debt or enforce an obligation owed to us by you</li>
              <li>
                To respond to a local or foreign court order, search warrant or other demand or
                request by legal authorities, or to comply with the rules of production of a local
                or foreign court
              </li>
              <li>To investigate and adjudicate claims or complaints</li>
              <li>
                To prevent or detect fraud or criminal activity or to manage and settle any actual
                or potential loss in connection with fraud or criminal activity
              </li>
            </ul>
          </section>

          {/* Marketing */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Marketing</h2>
            <p className="leading-relaxed text-gray-700">
              Moadbus may tailor its website and/or marketing material to you on the basis of your
              personal information.
            </p>
          </section>

          {/* Third Parties */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Third Parties</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              For the purposes described in this Policy Moadbus may share your personal data within
              all Moadbus cooperatives on the islands of Curaçao, Bonaire and St. Maarten.
            </p>
            <p className="mb-4 leading-relaxed text-gray-700">
              Moadbus may also share your personal data with third parties. This may include, but is
              not limited to:
            </p>
            <ul className="mb-4 space-y-2 text-gray-700 list-disc list-inside">
              <li>Third parties relevant to the services that Moadbus provides</li>
              <li>
                Third parties that Moadbus engages with in order to comply with legal and regulatory
                obligations
              </li>
              <li>
                Third party suppliers in connection with the processing of your personal data for
                the purposes described in this Policy, such as IT providers, communication service
                providers or other suppliers to whom Moadbus outsources certain support services
              </li>
              <li>
                Third parties insofar the processing of your personal data is necessary to ensure
                normal operations of Moadbus
              </li>
            </ul>
            <p className="leading-relaxed text-gray-700">
              Third parties to whom we transfer your personal data are themselves responsible for
              compliance with privacy legislation. Moadbus is neither responsible nor liable for the
              processing of your personal data by these third parties.
            </p>
          </section>

          {/* Retention */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Retention of Your Personal Data
            </h2>
            <p className="leading-relaxed text-gray-700">
              Moadbus may keep and use information about you in its records for such period of time
              needed to achieve the goals described in this Policy or to comply with applicable
              legislation and regulations.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Data Security</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              Moadbus will collect and process data using suitable technical or organizational
              measures, in a manner that ensures appropriate security of personal information,
              including protection against unauthorized or unlawful processing (e.g. such as against
              malicious hackers) and against accidental loss, destruction and/or damage.
            </p>
            <p className="mb-4 leading-relaxed text-gray-700">
              You are at all times responsible for ensuring the security of your account access
              information. By providing third parties access to your account information, you assume
              all liability for any transactions initiated on your account and/or your associated
              personal data.
            </p>
            <p className="leading-relaxed text-gray-700">
              In the unlikely event of a data breach causing high risk to personal information of
              customers, Moadbus will where required notify the affected customers without undue
              delay.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Your Rights as a Member of Moadbus
            </h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              When your personal data is collected and processed, you have all the rights as
              indicated by law. As an example some of these rights are as follows:
            </p>
            <ul className="mb-4 space-y-2 text-gray-700 list-disc list-inside">
              <li>
                You have the right to be informed at your request about the collection and use of
                your personal data
              </li>
              <li>
                You have the right to access and obtain copies of your personal information kept in
                our files
              </li>
              <li>
                You may at any time challenge the accuracy and completeness of your personal
                information and request that it be amended as appropriate
              </li>
              <li>
                You have the right to request removal of your personal data if this data is
                incorrect, serves no reasonable purpose or is no longer relevant
              </li>
              <li>
                You have the right to withdraw your given consent for the collection of specific
                personal data. You can do by sending an email to our Member Service Center at{' '}
                <a
                  href="mailto:info@finxact.com"
                  className="font-medium text-primary hover:text-primary"
                >
                  info@finxact.com
                </a>
              </li>
              <li>
                You have the right to request the reason(s) why your personal data is processed in a
                certain manner by Moadbus
              </li>
              <li>You may ask us to refrain from sending you tailored marketing communications</li>
            </ul>
            <p className="leading-relaxed text-gray-700">
              Please note that the above rights are not under all circumstances absolute. There may
              be instances in which Moadbus may be entitled to refuse requests in order to meet its
              legal and/or regulatory obligations.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Cookies</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              This site uses different types of cookies including cookies for the operation of this
              site. Cookies are small text files that can be used by websites to make a user's
              experience more efficient.
            </p>
            <p className="mb-4 leading-relaxed text-gray-700">
              For certain types of cookies we need your permission. Some cookies are placed by third
              party services that appear on our pages. You can at any time change or withdraw your
              consent from the Cookie Declaration on our website.
            </p>
            <p className="leading-relaxed text-gray-700">
              Please refer to the Moadbus Cookie Policy published on the website of Moadbus.
            </p>
          </section>

          {/* Further Information */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Further Information</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              Moadbus may amend this Policy from time to time to take into consideration changes in
              legislation, technology or other issues that may arise. We will post the revised
              Policy on our website, make it available at our branches or we may also send it to you
              by mail.
            </p>
            <p className="leading-relaxed text-gray-700">
              Should the changes to the Policy be significant, we will provide you with a prominent
              notice in writing.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Contact Us</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              If you have a question or complaint about our Privacy Policy or about the processing
              of your personal information or if you wish to receive an overview thereof, please
              feel free to contact us:
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 p-4 border border-primary/10 rounded-lg bg-primary/5">
                <Mail className="w-5 h-5 mt-1 text-primary shrink-0" />
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-900">Email</p>
                  <a
                    href="mailto:info@finxact.com"
                    className="font-medium text-primary hover:text-primary"
                  >
                    info@finxact.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border border-blue-100 rounded-lg bg-blue-50">
                <Phone className="w-5 h-5 mt-1 text-blue-500 shrink-0" />
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-900">Phone</p>
                  <a
                    href="tel:+8668346922"
                    className="font-medium text-blue-500 hover:text-blue-600"
                  >
                    +(866) 834-6922
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>

      {/* Footer */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-500">Last Updated: November 2025</p>
        <p className="mt-2 text-xs text-gray-400">COPYRIGHT © 2025 FINXACT</p>
      </motion.div> */}
    </div>
  );
};

export default TechnicalRequirement;
