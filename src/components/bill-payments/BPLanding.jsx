import { ArrowLeftRight, Building2, History, Users ,HandCoins, CalendarSync} from 'lucide-react';
import Landing from '../transfers/landing/Landing';

export default function BPLandingPage() {
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
      title: 'Pay Bill',
      icon: HandCoins,
      href: '/dashboard/bill-payments-pay',
    },
    {
      title: 'Manage Billers',
      icon: Users,
      href: '/dashboard/bill-payments-billers',
    },
    {
      title: 'Scheduled Bill Payments',
      icon: CalendarSync,
      href: '/dashboard/bill-payments-scheduled',
    },
    {
      title: 'Payment History',
      icon: History,
      href: '/dashboard/bill-payments-history',
    },
  
  ];

  return <Landing title="Bill Payment" images={images} actions={actions} />;
}
