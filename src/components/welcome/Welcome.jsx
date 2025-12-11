import brandConfig from '@/config/brand.config';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router';
import finxactBg from '../../../public/images/login-bg.png';

export default function BeforeLogin({ welcomeParams }) {
  const navigate = useNavigate();

  const bankName = 'Moadbus';

  const handleEnrollPersonal = () => {
    // Navigate to personal registration page
    navigate('/personal-registration');
  };

  const handleEnrollCorporate = () => {
    // Navigate to corporate registration page
    navigate('/');
  };

  const handleActivateUser = () => {
    navigate('/activate-device');
  };

  return (
    <div
      className="relative w-full min-h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${finxactBg})` }}
    >
      <div className="max-w-4xl p-4 mx-auto">
        {/* <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2">
          {/* New User */}
        {/* <div
          className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100"
          onClick={handleEnrollPersonal}
        >
          <div className="flex items-center">
            <i className="mr-4 text-2xl zmdi zmdi-info-outline"></i>
            <div>
              <div className="font-semibold text-gray-700">New to Moadbus?</div>
              <div className="text-sm text-gray-500">
                Please select to register a personal account
              </div>
            </div>
            <i className="ml-auto text-gray-400 zmdi zmdi-chevron-right"></i>
          </div>
        </div> */}

        {/* Already Enrolled */}
        {/* <div
          className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100"
          onClick={handleActivateUser}
        >
          <div className="flex items-center">
            <i className="mr-4 text-2xl zmdi zmdi-smartphone-setup"></i>
            <div>
              <div className="font-semibold text-gray-700">Already enrolled?</div>
              <div className="text-sm text-gray-500">
                Are you already an existing Moadbus Online Banking (e-branch) user?
              </div>
            </div>
            <i className="ml-auto text-gray-400 zmdi zmdi-chevron-right"></i>
          </div>
        </div> */}

        <div className="fixed p-6 bg-white rounded-lg shadow-lg bottom-10 right-3 left-3">
          <div className="p-6 mb-8 ">
            <img src={brandConfig.logo} alt={brandConfig.name} className="mx-auto mb-3 h-14" />

            <h1 className="mt-3 text-2xl font-semibold text-center">
              Welcome to <span className="bank_name">{bankName}</span>
            </h1>
          </div>
          <div className="text-3xl text-gray-400 mb3">Moadbus</div>
          <div className="my-3 text-gray-500 ">For all your financial needs</div>
          <div className="flex gap-1 my-3 text-gray-500 items-top">
            <div className="mt-1 mr-2">
              {' '}
              <Info />
            </div>
            <div className="text-sm">
              Are you already an existing Moadbus Online Banking (e-branch) user?
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="flex justify-between space-x-4 md:hidden">
            <button
              className="flex-1 py-2 text-white rounded bg-primary"
              onClick={handleActivateUser}
            >
              Yes
            </button>
            <button
              className="flex-1 py-2 text-white rounded bg-primary"
              onClick={handleEnrollPersonal}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
