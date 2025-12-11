import { Link } from 'react-router';
import '../index.css';

// import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:py-[120px]">
        <div className="text-center">
          <div className="flex justify-center mb-8 sm:mb-10 lg:mb-12">
            <div className="w-full md:w-3xl">
              <img src="./images/not-found.png" alt="Moadbus" />
            </div>
          </div>

          <Link
            to="/"
            className="inline-block w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium text-white transition-all duration-300 bg-[#CF9645] rounded-lg hover:bg-[#b8853d] hover:shadow-lg active:scale-95"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
