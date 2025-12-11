import DebugModal from '@/components/ui/debug-modal';
import { useAppVersion } from '@/hooks/useAppVersion';
import { useState } from 'react';

export default function Footer() {
  const [showDebugForm, setShowDebugForm] = useState(false);
  const version = useAppVersion();

  return (
    <>
      <div
        className="text-center text-gray-500 text-xs pt-3 cursor-pointer"
        onClick={() => setShowDebugForm(true)}
      >
        Version: <span className="font-medium">{version}</span>
      </div>

      <DebugModal open={showDebugForm} onOpenChange={setShowDebugForm} />
    </>
  );
}
