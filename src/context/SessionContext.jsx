import { createContext, useContext, useEffect, useRef } from "react";
import { refreshGlobalSession, updateServerTimeout, logout } from '@/api/endpoints';
import { usePopup } from '@/context/PopupContext';
import { useMetaDataStore } from '@/store/useMetaDataStore';
import { useAccountsStore } from '@/store/accountsStore';

import { useNavigate } from 'react-router';


const SessionContext = createContext();

export function SessionProvider({ children }) {
  const tn = useMetaDataStore.getState().tn;
  const promptOffsetMinutes = 1// tn.to; 
  const timeoutMinutes = 20//tn.tofset ; 
  
  const sessionTimeout = useRef(null);
  const promptTimeout = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const { showConfirmPopup } = usePopup();
  const navigate = useNavigate();

  // RESET TIMERS
  const resetTimers = () => {
    clearTimeout(sessionTimeout.current);
    clearTimeout(promptTimeout.current);

    const timeoutMs = timeoutMinutes * 60000;
    const promptMs = promptOffsetMinutes * 60000;
    sessionTimeout.current = setTimeout(showExpirePrompt, timeoutMs - promptMs);
  };

  // SHOW PROMPT
  const showExpirePrompt = () => {
    console.log("Session expiring soon...");

    promptTimeout.current = setTimeout(() => {
      goLogout()
    }, promptOffsetMinutes * 60000);

    showConfirmPopup({
      title: 'Session Timeout',
      description: 'Your session will expire soon. Press OK to continue.',
      confirmLabel: 'OK',
      cancelLabel: 'Logout',
      onCancel: (e) => {goLogout()},
      onConfirm: () => { resetTimers(); updateServerTimeout(); },
    });

  };
  const goLogout = () => {
    logout({});
    useAccountsStore.getState().logout();
    navigate('/');
  }

  // HANDLE USER ACTIVITY
  const onActivity = () => {
    const now = Date.now();

    if (now - lastActivityRef.current > 60000) {
      refreshGlobalSession();
      updateServerTimeout();
    }

    lastActivityRef.current = now;
    resetTimers();
  };

  // REGISTER EVENT LISTENERS
  useEffect(() => {
    resetTimers();

    const events = ["mousedown", "keydown", "scroll", "touchstart", "touchmove"];
    events.forEach((event) => document.addEventListener(event, onActivity));

    return () => {
      events.forEach((event) => document.removeEventListener(event, onActivity));
    };
  }, []);

  return (
    <SessionContext.Provider value={{ resetTimers }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
