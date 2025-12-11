import ActionGrid from './ActionGrid';
import ImageCarousel from './ImageCarousel';

const Landing = ({ title, images, actions }) => {
  return (
    <div className="landing-page">
      {/* Header */}
      <div className="bg-primary text-white py-3 px-4 text-center">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      {/* Content */}
      <div className="space-y-6 py-6">
        {/* Image Carousel */}
        {images && images.length > 0 && <ImageCarousel images={images} />}

        {/* Action Grid */}
        {actions && actions.length > 0 && <ActionGrid actions={actions} />}
      </div>
    </div>
  );
};

export default Landing;
