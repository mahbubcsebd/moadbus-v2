import { makeNativeRequest } from '@/api/api';
import useBrandStore from '@/store/brandStore';
import { isAndroid, isIOS } from '@/utils/env';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';

export default function AgreementConfirmation() {
  const navigate = useNavigate();
  const brandConfig = useBrandStore((state) => state.brandConfig);

  const nextNavigation = () => {
    navigate('/welcome');
  };
  // Request Android biometric permissions if available
  const requestAndroidPermissions = async () => {
    localStorage.setItem('accepted', 'true');
    nextNavigation();
  };

  useEffect(() => {
    window.requestAndroidPermissions = requestAndroidPermissions;
  }, []);

  const handleAccept = async () => {
    try {
      if (!isIOS() && !isAndroid()) {
        requestAndroidPermissions();
        return;
      }
      if (isAndroid()) {
        await makeNativeRequest(
          'requestPermissions',
          [
            'android.permission.INTERNET',
            'android.permission.USE_FINGERPRINT',
            'android.permission.USE_BIOMETRIC',
          ],
          'requestAndroidPermissions',
        );
      } else {
        requestAndroidPermissions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = () => {
    // Web fallback
    console.log('>>> exitApp');
    navigator.app.exitApp();
  };

  // Skip screen if already accepted and device activated
  useEffect(() => {
    const accepted = localStorage.getItem('accepted') === 'true';
    if (accepted) nextNavigation();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top logo */}
      <div className="flex justify-center p-4 ">
        <img
          src={brandConfig.logo}
          alt={brandConfig.name}
          className="h-12 cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>

      {/* Page Title */}
      <div className="px-4 py-3 text-lg font-semibold text-center ">AGREEMENT Moadbus</div>

      {/* Content */}
      <div className="flex-1 px-4 pb-20 overflow-y-auto text-sm leading-relaxed">
        <p>The undersigned:</p>
        <ol className="pl-5 list-decimal">
          <li>
            Algemene Spaar- en Kredietcooperatie Moadbus, having its registered office in Curaçao
            and its principal place of business at Pater Euwensweg 7, hereinafter referred to as
            "Moadbus", hereby represented by authorized employee of Moadbus;
          </li>
          <li>
            Agree as follows:
            <ul className="ml-3 space-y-1 list-disc">
              <li>
                The Member is permitted to use the services provided by Moadbus through "Moadbus"
                and under the <b>Moadbus Terms and Conditions</b>.
              </li>
              <li>
                By signing this Agreement, the Member certifies that he has received, understood and
                accepted a copy of the Moadbus Terms and Conditions.
              </li>
              <li>
                The Member, by signing this Agreement, declares to have received an envelope
                containing the token or grid card.
              </li>
              <li>
                The Member declares by signing this Agreement that he/she will be the sole user of
                the username, token or grid card and password.
              </li>
              <li>
                Both the Member and Moadbus may terminate this Service Agreement in writing at any
                time subject to the Moadbus Terms and Conditions.
              </li>
            </ul>
          </li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 p-5 ">
        <>
          <Button
            onClick={handleDecline}
            variant="outline"
            size="default"
            type="button"
            className="w-full text-blue-600 border-blue-600 sm:w-auto"
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            className="w-full text-white bg-primary sm:w-auto hover:bg-primary"
          >
            Accept
          </Button>
        </>
      </div>
    </div>
  );
}
