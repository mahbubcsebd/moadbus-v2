import { Smartphone, Users } from 'lucide-react';
import Landing from '../transfers/landing/Landing';

export default function TopupLandingPage() {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
      alt: 'Transfer money easily',
    },
    {
      src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      alt: 'Secure transactions',
    },
    {
      src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
      alt: 'Fast transfers',
    },
  ];

  const actions = [
    {
      title: 'Recharge Mobile',
      icon: Smartphone,
      href: '/dashboard/mobile-recharge',
    },
    {
      title: 'Manage Numbers',
      icon: Users,
      href: '/dashboard/mobile-manage',
    },
  ];

  return <Landing title="Mobile Top-Up" images={images} actions={actions} />;
}
