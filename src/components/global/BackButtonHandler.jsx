import { isDebugMode } from '@/utils/devDebug';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function BackButtonHandler({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isDebugMode()) {
      alert('Back button clicked...');
    }
    const onBackButton = (e) => {
      e.preventDefault();

      if (window.location.pathname !== '/') {
        navigate(-1);
        if (isDebugMode()) {
          alert('Back button conditino mathced...');
        }
      } else {
        if (navigator?.app?.exitApp) {
          navigator.app.exitApp();
        }
      }
    };

    document.addEventListener('backbutton', onBackButton, false);

    return () => {
      document.removeEventListener('backbutton', onBackButton);
    };
  }, [navigate]);

  return children;
}
