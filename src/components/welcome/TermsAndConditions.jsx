import { makeNativeRequest } from '@/api/api';
import useBrandStore from '@/store/brandStore';
import { isAndroid, isIOS } from '@/utils/env';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Logo from '../global/Logo';
import { Button } from '../ui/button';

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const brandConfig = useBrandStore((state) => state.brandConfig);

  const handleAccept = () => {
    navigate('/agreement');
  };

  const handleDecline = () => {
    console.log('>>> exitApp');
    navigator.app.exitApp();
  };

  const handleRequestPermissions = async () => {
    if (!isIOS() && !isAndroid()) return;
    try {
      await makeNativeRequest('requestPermissions', [
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_FINE_LOCATION',
      ]);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    handleRequestPermissions();
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex justify-center p-4">
        <Logo src={brandConfig.logo} alt={brandConfig.name} />
      </div>

      {/* Title */}
      <div className="px-4 py-3 text-lg font-semibold text-center ">
        FinxactOnline & Mobile Banking Terms & Conditions.
        <br />
        <span className="text-sm font-normal">Version 202312</span>
      </div>

      {/* Description */}
      <div className="px-4 mb-3 text-sm">
        The FinxactTerms and Conditions contain the definitions and terms applicable to the use of
        Moadbus consisting of Online and Mobile Banking services...
      </div>

      {/* Scrollable Full Terms */}
      <div className="flex-1 p-4 overflow-y-auto text-sm leading-relaxed text-black bg-white">
        <div className="p-3 mx-auto prose prose-lg bg-white rounded-lg shadow-md">
          {/* Article 1 */}
          <h2 className="mb-2 text-lg font-bold">Article 1: Definitions and Interpretation</h2>
          <p>
            In these Moadbus Terms and Conditions, the terms listed below have the following
            meaning:
          </p>
          <ul className="ml-3 space-y-1 list-disc">
            <li>
              <strong>Moadbus:</strong> Algemene Spaar- en Kredietcooperatie Moadbus, established in
              Curaçao at Pater Euwensweg 7, Commercial Register number 3366, Curaçao.
            </li>
            <li>
              <strong>Member:</strong> natural persons, as described in article 5, paragraph 1, of
              the bylaws.
            </li>
            <li>
              <strong>Moadbus Service:</strong> service provided by Moadbus via internet (
              <a href="https://www.finxact.com" className="text-blue-600 underline">
                https://www.finxact.com
              </a>
              ) or mobile app to view account information and send payment orders. Available 24/7.
            </li>
            <li>
              The following services are provided:
              <ul className="ml-3 space-y-1 list-disc">
                <li>Overview of share, savings, current, time deposits, and loan accounts.</li>
                <li>View credits and debits per checking account.</li>
                <li>Initiate online payments internally and locally.</li>
                <li>Automatic transfers.</li>
                <li>View status of payment orders.</li>
                <li>Account history of checking accounts.</li>
                <li>Securely send messages to Moadbus.</li>
                <li>View/download statements via e-BRANCH.</li>
                <li>Locate Moadbus branches and ATMs.</li>
              </ul>
            </li>
            <li>
              <strong>Payment instrument:</strong> software with user ID, token/grid card, and
              password to issue payments.
            </li>
            <li>
              <strong>Beneficiary:</strong> a third party to whom funds can be sent (Moadbus member
              or other bank account).
            </li>
            <li>
              <strong>Payment order:</strong> instruction to execute a payment transaction.
            </li>
            <li>
              <strong>Payment account:</strong> active current or savings account included in
              Moadbus.
            </li>
            <li>
              <strong>Payment transaction:</strong> online transfers/payments via e-BRANCH.
            </li>
            <li>
              <strong>Moadbus Service Agreement:</strong> agreement including appendices, T&Cs,
              bylaws, rules, and other agreements.
            </li>
            <li>
              <strong>Electronic signature:</strong> legally binding digital signature.
            </li>
            <li>
              <strong>User ID:</strong> unique ID issued by Moadbus.
            </li>
            <li>
              <strong>Grid card:</strong> card used with User ID and password to authorize payments.
            </li>
            <li>
              <strong>Rules and Regulations:</strong> set of rules supplementing the bylaws.
            </li>
            <li>
              <strong>Order Date:</strong> date Moadbus receives a payment order.
            </li>
            <li>
              <strong>Special terms and conditions:</strong> terms for specific products or
              services.
            </li>
            <li>
              <strong>Bylaws:</strong> legal provisions governing Moadbus.
            </li>
            <li>
              <strong>Additional authentication:</strong> token, soft token, grid card, or
              biometrics used with User ID/password.
            </li>
            <li>
              <strong>Cut-off time:</strong>
              <ul className="ml-3 list-disc">
                <li>Payments to other banks executed immediately if CBCS network available.</li>
                <li>Payments to Moadbus accounts executed immediately.</li>
              </ul>
            </li>
            <li>
              <strong>Password:</strong> secret code used with User ID and token/grid card. Must be
              changed immediately upon receipt.
            </li>
            <li>
              <strong>Website:</strong>{' '}
              <a href="https://www.finxact.com" className="text-blue-600 underline">
                https://www.finxact.com
              </a>
              .
            </li>
            <li>
              <strong>Business days:</strong> days when Moadbus executes payment orders (excludes
              weekends and certain holidays).
            </li>
          </ul>

          {/* Article 2 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">
            Article 2: Applicability of Terms and Conditions
          </h2>
          <p>
            2.1 The T&Cs, bylaws, rules, and other agreements apply to the member's use of Moadbus.
            In case of conflict, bylaws/rules prevail.
          </p>
          <p>2.2 Moadbus may amend or supplement the T&Cs at any time.</p>
          <p>
            2.3 Members are deemed to accept amendments unless they terminate the service 15 days
            before the effective date.
          </p>

          {/* Article 3 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">
            Article 3: Signing up for Moadbus Services
          </h2>
          <ul className="ml-3 space-y-1 list-disc">
            <li>Member must be a Moadbus member.</li>
            <li>Register online for e-Branch.</li>
            <li>Applicant will be contacted to sign the service agreement.</li>
            <li>Moadbus provides additional authentication.</li>
            <li>Moadbus may issue system instructions and notify the member timely.</li>
          </ul>

          {/* Article 4 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">Article 4: Access to Moadbus</h2>
          <ul className="ml-3 space-y-1 list-disc">
            <li>
              Access via user ID, additional authentication, and password provided by Moadbus.
            </li>
            <li>User ID, token, and password are personal and non-transferable.</li>
            <li>Member must handle token/grid card/password responsibly.</li>
            <li>Maintain absolute secrecy of password.</li>
            <li>First-time use requires acceptance of e-BRANCH T&Cs and changing the password.</li>
          </ul>

          {/* Article 5 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">Article 5: Moadbus Services</h2>
          <p>
            Moadbus will provide access, payment instruments, and statements. Members must notify
            Moadbus of malfunctions.
          </p>

          {/* Article 6 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">Article 6: Use of Payment Instrument</h2>
          <ul className="ml-3 space-y-1 list-disc">
            <li>Use the payment instrument provided.</li>
            <li>Moadbus sets validity period; may change anytime.</li>
            <li>Report loss, theft, or unauthorized use immediately.</li>
            <li>Moadbus blocks instruments for security or suspected fraud.</li>
          </ul>

          {/* Article 7 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">Article 7: Limits</h2>
          <p>Moadbus sets transaction and daily limits. See Article 11 for more details.</p>

          {/* Article 8 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">
            Article 8: Blocking Payment Instrument at Member Request
          </h2>
          <ul className="ml-3 space-y-1 list-disc">
            <li>Notify Moadbus immediately if security is compromised.</li>
            <li>Situations include lost/stolen token/grid card or unauthorized transactions.</li>
            <li>
              After notification, Moadbus blocks the instrument; member remains liable for prior
              transactions.
            </li>
          </ul>

          {/* Article 9 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">Article 9: Advertising and Promotion</h2>
          <p>
            Moadbus may place ads, promotions, banners, and general information bulletins on Online
            and Mobile Banking.
          </p>

          {/* Article 10 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">Article 10: Blocking by Moadbus</h2>
          <ul className="ml-3 space-y-1 list-disc">
            <li>Authorized to block for security/fraud reasons. Member will be notified.</li>
            <li>Will unblock or replace instrument once reasons for blocking no longer exist.</li>
          </ul>

          {/* Article 11 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">Article 11: Payment Orders</h2>
          <ul className="ml-3 space-y-1 list-disc">
            <li>Execution occurs when member presses 'Submit'.</li>
            <li>Orders for specific dates processed on that day; otherwise next business day.</li>
            <li>Accuracy of payment orders is member's responsibility.</li>
            <li>Cannot revoke submitted orders.</li>
            <li>Transaction limits apply: $10,000 USD per day to other local banks.</li>
          </ul>

          {/* Article 12 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">Article 12: Payment Account</h2>
          <ul className="ml-3 space-y-1 list-disc">
            <li>No overdrafts allowed; ensure sufficient balance.</li>
            <li>Regularly inspect account statements and report irregularities immediately.</li>
          </ul>

          {/* Article 13 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">Article 13: Fees and Payments</h2>
          <ul className="ml-3 space-y-1 list-disc">
            <li>Fees may be charged for payments and services.</li>
            <li>First authentication device is free; replacements incur charges.</li>
            <li>License fees/other costs passed to member.</li>
            <li>Fees may change from time to time.</li>
          </ul>

          {/* Article 14 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">
            Article 14: Reporting Obligation of the Member
          </h2>
          <ul className="ml-3 space-y-1 list-disc">
            <li>Report lost/stolen/misused token or password immediately.</li>
            <li>Failure to report is gross negligence.</li>
            <li>Member bears risk for debits until notification.</li>
          </ul>

          {/* Article 15 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">Article 15: Liability of Moadbus</h2>
          <ul className="ml-3 space-y-1 list-disc">
            <li>Member bears damage until notification of loss or unauthorized use.</li>
            <li>Moadbus strives for uninterrupted operation.</li>
            <li>
              Not liable for equipment/software failures, misunderstandings, or improper
              transmissions.
            </li>
            <li>
              Member indemnifies Moadbus for damage caused by non-compliance or third-party claims.
            </li>
          </ul>

          {/* Article 16 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">Article 16: Termination of Use</h2>
          <ul className="ml-3 space-y-1 list-disc">
            <li>Notify Moadbus in writing to terminate; return token/grid card.</li>
            <li>E-Branch ends automatically after membership ends and accounts are closed.</li>
            <li>Moadbus can suspend/terminate services at its discretion without compensation.</li>
          </ul>

          {/* Article 17 */}
          <h2 className="mt-4 mb-2 text-lg font-bold">Article 17: Applicable Law</h2>
          <p>Moadbus Terms and Service Agreement are governed by the laws of Curaçao.</p>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-center gap-4 p-4">
        {!isIOS() && (
          <Button
            onClick={handleDecline}
            variant="outline"
            size="default"
            type="button"
            className="w-full text-blue-600 border-blue-600 sm:w-auto"
          >
            Decline
          </Button>
        )}

        <Button
          onClick={handleAccept}
          className="w-full text-white bg-primary sm:w-auto hover:bg-primary"
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
