import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

const ImageCarousel = ({ images = [] }) => {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative w-full bg-white rounded-md verflow-hidden shadow-sm">
        <div className="relative w-full aspect-16/7">
          <img
            src={images[0].src}
            alt={images[0].alt || 'Banner'}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-white rounded-2xl overflow-hidden shadow-md">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet custom-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="aspect-16/7"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={image.src}
                alt={image.alt || `Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .custom-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.6);
          opacity: 1;
          transition: all 0.3s;
        }

        .custom-bullet-active {
          width: 32px;
          height: 8px;
          border-radius: 4px;
          background: #f97316;
        }

        .swiper-pagination {
          bottom: 12px !important;
        }
      `}</style>
    </div>
  );
};

export default ImageCarousel;
