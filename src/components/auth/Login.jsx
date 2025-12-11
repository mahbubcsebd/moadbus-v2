import { globals } from '@/globals/appGlobals';
import { isDebugMode } from '@/utils/devDebug';
import { passwordField, requiredField } from '@/utils/formHelpers';
import {
  detectAccountColor,
  detectAccountType,
  getAvaiableFunctions,
} from '@/utils/formatAccounts';
import { useTranslation } from '@/utils/t';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { makeNativeRequest } from '@/api/api';
import {
  authenticateUser,
  generateOTP,
  getAuthAccounts,
  loginFingerPrint,
  manageFingerPrint,
  verifyOTP,
} from '@/api/endpoints';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OTPForm from '@/components/ui/otp-form';
import { usePopup } from '@/context/PopupContext';
import { useAccountsStore } from '@/store/accountsStore';
import { useMetaDataStore } from '@/store/useMetaDataStore';

import useBrandStore from '@/store/brandStore';
import { isAndroid, isIOS } from '@/utils/env';
import LanguageSelector from '../global/LanguageSelector';
import Logo from '../global/Logo';
import Footer from '../layout/Footer';
import MobileQuickActions from '../login/MobileQuickActions';
import FormInput from '../ui/form-input';

// Validation Schema
const loginSchema = z.object({
  userId: requiredField('User ID'),
  password: passwordField,
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [altMobOptions, setAltMobOptions] = useState([]);
  const [selectedAltMob, setSelectedAltMob] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [supportTouch, setSupportTouch] = useState(false);
  const [saveTouchID, setSaveTouchID] = useState(false);
  const [userID, setUserID] = useState('');

  const { showMsgPopup, showConfirmPopup } = usePopup();
  const setUserId = useAccountsStore.getState().setUserId;
  const fpUser = useMetaDataStore((state) => state.tn.fpu) || '';
  const userId = useAccountsStore((s) => s.userId);
  const t = useTranslation();
  const brandConfig = useBrandStore((state) => state.brandConfig);

  const navigate = useNavigate();

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  useEffect(() => {
    if (fpUser) {
      setValue('userId', fpUser);
    }
  }, [fpUser, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { userId: data.userId, pwd: data.password };
      const res = await authenticateUser(payload);

      const rs = res.rs || {};

      const success =
        res.success === true ||
        (rs.status && rs.status.toString().trim().toLowerCase() === 'success') ||
        (rs.ec && rs.ec.toString().split(',')[0].trim() === '0');

      if (success) {
        const altMobsValue = rs?.altMobs;
        if (altMobsValue) {
          const options =
            typeof altMobsValue === 'string' ? altMobsValue.split(';') : [altMobsValue.toString()];

          setUserId(data.userId);
          setAltMobOptions(options);
          setSelectedAltMob(options[0]);
          setShowPopup(true);
        }
      } else {
        showMsgPopup('error', rs.msg);
      }
    } catch (err) {
      showMsgPopup('error', 'Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // Handle OTP Generation
  const handleConfirmAltMob = async () => {
    setLoading(true);
    try {
      const payload = { mobileNumber: [selectedAltMob] };
      await generateOTP(payload);
      setShowOTPForm(true);
    } catch (err) {
      showMsgPopup('error', 'Failed to generate OTP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const maskPhoneNumber = (number) => {
    const numStr = number.toString();
    if (numStr.length <= 4) {
      return numStr;
    }
    const lastFour = numStr.slice(-4);
    const masked = '*'.repeat(numStr.length - 4);
    return masked + lastFour;
  };

  // Handle OTP Verification
  const handleOTPSubmit = async (otp) => {
    setLoading(true);
    try {
      const res = await verifyOTP({ otp });

      if (res.rs.status !== 'success') {
        showMsgPopup('error', res.rs.msg || 'Invalid OTP');
        return;
      }

      const accountRes = await getAuthAccounts();
      const rs = accountRes.rs || accountRes;

      const accounts = Object.keys(rs)
        .filter((k) => k.startsWith('A'))
        .map((k) => {
          const item = rs[k];
          const type = detectAccountType(item);
          const av_functions = getAvaiableFunctions(item);
          return {
            id: item.i,
            accountNumber: item.a,
            description: item.d,
            currency: item.c,
            accountName: item.n,
            balance: Number(item.b || 0),
            availableBalance: Number(item.ab || 0),
            accountType: item.atype,
            type,
            color: detectAccountColor(item),
            available_functions: av_functions,
          };
        });

      // Store few values that will be need globally
      useAccountsStore.getState().setAccounts(accounts);
      // useAccountsStore.getState().setNotifications({ ...globalNotifications });
      const name = rs.n || 'User';
      useAccountsStore.getState().setUserName?.(name);
      useAccountsStore.getState().setTn?.(rs.tn);

      // notifications
      const notificationObject = {
        alert: rs.nfg || {},
        promotion: rs.nfp || {},
        reminder: rs.nfu || {},
      };
      useAccountsStore.getState().setNotifications?.(notificationObject);

      navigate('/dashboard');
      let msg =
        'Please read the below Terms and Conditions for Enabling Face ID/Touch ID Functionality with Mobile Banking. You have to agree that you are the only person using this phone for Face ID/Touch ID  stored on this device and can be used to access your accounts in Mobile Banking. Moadbus  neither controls the Face ID/Touch ID  functionality for has access to your Face ID/Touch ID  information.Sometimes Face ID/Touch ID  may not function as expected and it depends on your hardware. In that case you will need to sign in using your credentials.Choose Accept to agree to these terms and conditions. Choose Decline to cancel setup of Face ID/Touch ID  for Mobile Banking.';

      saveTouchID &&
        showConfirmPopup({
          title: 'Terms and Conditions',
          description: msg,
          confirmLabel: 'Accept',
          cancelLabel: 'Decline',
          onConfirm: accept,
        });
    } catch (err) {
      console.error(err);
      showMsgPopup('error', 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Check FP Support
  const checkFpSupportedResult = () => {
    if (isDebugMode()) alert('call checkFpSupportedResult');
    let v = true;
    setSupportTouch(v);

    if (v == true) {
      makeNativeRequest('hasKey', [], '');
    }
  };

  useEffect(() => {
    window.checkFpSupportedResult = checkFpSupportedResult;
  }, []);

  const fpAuthenticate = async (response) => {
    let publicKey = response.value;

    const params = {
      enabled: 'Y',
      publicKey: publicKey,
    };
    const result = await manageFingerPrint(params);
    const token = result.rs.token;

    makeNativeRequest('setFpToken', [token, userId], '');
  };

  useEffect(() => {
    window.fpAuthenticate = fpAuthenticate;
  }, []);

  const accept = async () => {
    try {
      await makeNativeRequest('genKey', [], 'fpAuthenticate');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const checkFpSupported = () => {
    if (!isAndroid() && !isIOS()) {
      return;
    }

    makeNativeRequest('fpSupported', [], 'checkFpSupportedResult');
  };

  useEffect(() => {
    checkFpSupported();
  }, []);

  // login by fingerprint
  const handlefpAuthenticateResponse = async (response) => {
    console.log('sealData success', response);
    console.log('userid/fpuser', userId, fpUser);
    // if(userId != fpUser) {
    //   showMsgPopup('Error','Please enter the correct username');
    //   return
    // }
    setLoading(true);
    try {
      if (typeof response != 'object') response = JSON.parse(response);
      var signature = response.signature;
      var uuid = response.uuid;
      if (typeof response.signarue != 'undefined') signature = response.signarue;

      const params = {
        signature: signature,
        fg: 0,
        code: 1,
        secretKey: globals.secretKey,
        uuid: uuid,
        userId: userId,
      };
      const res = await loginFingerPrint(params);
      const rs = res.rs || {};

      const success =
        res.success === true ||
        (rs.status && rs.status.toString().trim().toLowerCase() === 'success') ||
        (rs.ec && rs.ec.toString().split(',')[0].trim() === '0');

      if (success) {
        const altMobsValue = rs?.altMobs;
        if (altMobsValue) {
          const options =
            typeof altMobsValue === 'string' ? altMobsValue.split(';') : [altMobsValue.toString()];

          setAltMobOptions(options);
          setSelectedAltMob(options[0]);
          setShowPopup(true);
        }
      } else {
        showMsgPopup('error', rs.msg);
      }
    } catch (err) {
      showMsgPopup('error', 'Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlefpAuthenticate = () => {
    let bank_name = 'Moadbus';

    window.cordova.exec(
      function (winParam) {
        handlefpAuthenticateResponse(winParam);
        //1 - > No Finger Print  Found on the device
        //2 - > Finger Print Success
      },
      function (error) {
        console.log('sealData error:' + error);

        if (error == '101') {
          showMsgPopup(
            'Info',
            'If you have made changes to your biometrics, please register again.',
            '<input type="button" value="Ok" class="button_style" onclick="close_messagebox(); " style="margin-top:5px">',
          );
          return;
        } else if (error == '3' || error == '4') {
          showMsgPopup(
            'Info',
            'If you have made changes to your biometrics, please register again.',
            '<input type="button" value="Ok" class="button_style" onclick="close_messagebox(); " style="margin-top:5px">',
          );
          console.log('FP canceled');
        } else {
          console.log('from get_fpAuthenticate_continue: ' + error);
        }
      },
      'EncodeDecode',
      'sealData',
      [bank_name, 'Authentication', 'Please sign into the Mobile Banking application', 'Cancel'],
    );
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('./images/login-bg.png')",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <div className="p-5 border shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl md:p-10 border-white/20">
          <div className="absolute right-2 top-2">
            <LanguageSelector />
          </div>
          <div className="mt-8 mb-4 text-center md:mb-8">
            <div className="flex justify-center max-w-[150px] mx-auto py-5">
              <Logo src={brandConfig.logo} alt={brandConfig.name} />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              {t('login_welcome_back.login_welcome_back')}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              label={t('login.user_id')}
              placeholder="Enter your user ID"
              error={errors.userId?.message}
              {...register('userId', {
                onChange: (e) => setUserId(e.target.value), // call RHF internal & update local state
              })}
              required
            />

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t('login.password')} <span className="text-primary">*</span>
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end md:hidden">
              <Link
                className="text-sm text-gray-500 transition duration-150 hover:text-primary"
                to="/activate-device"
              >
                {t('before_login.registerNewDevice')}
              </Link>
            </div>

            <div className="grid gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full font-medium text-white bg-primary hover:bg-primary/90"
                icon={LogIn}
                loading={loading}
              >
                {t('login.sign_in')}
              </Button>
              {fpUser && supportTouch ? (
                <Button
                  variant="primary"
                  size="default"
                  className="w-full md:hidden"
                  onClick={handlefpAuthenticate}
                >
                  Sign In with face ID
                </Button>
              ) : (
                <div className="flex items-center justify-center mt-1">
                  <Input
                    type="checkbox"
                    id="saveTuchID"
                    onChange={() => setSaveTouchID(!saveTouchID)}
                  />
                  <p className="text-sm text-gray-500 ">{t('before_login.setupTouchID')}</p>
                </div>
              )}
            </div>
          </form>

          {/* Footer Links */}
          {/* <div className="flex items-center justify-center gap-2 mt-4 text-sm">
            <Link
              className="transition-colors text-primary hover:text-primary/80"
              to="/forgot-userID"
            >
              Forgot User ID
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              className="transition-colors text-primary hover:text-primary/80"
              to="/forgot-password"
            >
              Forgot Password
            </Link>
          </div> */}

          {/* <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-sm font-medium text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div> */}

          {/* <div className="grid grid-cols-1">
            <Link to="javascript:void(0)" className="w-full">
              <Button
                variant="outline"
                size="default"
                icon={User}
                className="w-full text-sm hover:bg-accent/20"
              >
                Register to Personal Banking
              </Button>
            </Link>
          </div> */}
        </div>
        <Footer />
      </motion.div>

      {/* OTP Popup Modal */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="gap-0 sm:max-w-md">
          {!showOTPForm ? (
            <>
              <DialogHeader className="mb-3">
                <DialogTitle className="text-lg font-semibold text-left sm:text-xl">
                  OTP Confirmation
                </DialogTitle>
              </DialogHeader>
              <div className="mb-3">
                <p className="text-sm text-gray-600">{t('otp.text3')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">{t('otp.sendTo')}</label>
                <Select value={selectedAltMob} onValueChange={setSelectedAltMob}>
                  <SelectTrigger className="w-full h-10 mb-4 border-gray-300 focus:border-primary focus:ring-primary sm:h-11">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    {altMobOptions.map((num) => (
                      <SelectItem
                        key={num}
                        value={num}
                        className="cursor-pointer hover:bg-accent/20 focus:bg-accent/20"
                      >
                        {maskPhoneNumber(num)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4 sm:gap-3">
                <Button
                  variant="outline"
                  className="flex-1 py-2 text-sm text-primary border-primary hover:bg-accent/20 sm:text-base sm:py-3"
                  onClick={() => setShowPopup(false)}
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={handleConfirmAltMob}
                  disabled={loading}
                  className="flex-1 py-2 text-sm bg-primary hover:bg-primary/90 sm:text-base sm:py-3"
                >
                  {t('otp.generateToken')}
                </Button>
              </div>
            </>
          ) : (
            <OTPForm
              onCancel={() => setShowOTPForm(false)}
              onGenerate={handleOTPSubmit}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>
      <MobileQuickActions />
    </div>
  );
}
