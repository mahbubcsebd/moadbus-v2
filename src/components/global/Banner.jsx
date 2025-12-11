import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

const Banner = ({
  image,
  title = 'Welcome to Our Site',
  text = 'We’re glad to have you here.',
  className,
}) => {
  const bgImage = image || './images/banner.avif';

  return (
    <div
      className={cn(
        'relative h-[350px] flex items-center justify-center text-center overflow-hidden',
        className,
      )}
    >
      <div className="absolute left-3 top-3 z-50">
        <Link
          to="/"
          className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors text-white "
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </div>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Orangish Overlay */}
      <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-4 text-white sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold sm:text-4xl drop-shadow-md">{title}</h1>
        {text && <p className="mt-3 text-base sm:text-lg opacity-90">{text}</p>}
      </div>
    </div>
  );
};

export default Banner;
