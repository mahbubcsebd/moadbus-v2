import { ArrowLeftRight, Building2, History, Users } from 'lucide-react';
import Landing from './landing/Landing';

export default function TransferLandingPage() {
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
      title: 'Between My Accounts At Moadbus',
      icon: ArrowLeftRight,
      href: 'transfer-between-own-acccounts',
    },
    {
      title: 'Transfer To Other Moadbus Account',
      icon: Users,
      href: '/dashboard/transfers/transfers-other-finxact',
    },
    {
      title: 'Transfer To Other Local Bank',
      icon: Building2,
      href: '/dashboard/transfers/transfer-between-local-bank',
    },
    {
      title: 'Transfer History',
      icon: History,
      href: '/dashboard/transfers/transfers-history',
    },
  ];

  return <Landing title="Transfer" images={images} actions={actions} />;
}
