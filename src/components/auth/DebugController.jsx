import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebugStore } from '@/store/debugStore';
import { useState } from 'react';

export default function DebugController() {
  const [showDebugForm, setShowDebugForm] = useState(false);
  const [code, setCode] = useState('');

  const enableDebug = useDebugStore((s) => s.enableDebug);

  const handleSubmit = () => {
    if (code === '0') {
      enableDebug();
      alert('Debug Enabled!');
    } else {
      alert('Unknown code');
    }

    setShowDebugForm(false);
    setCode('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Developer Options</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Options List */}
          <div className="p-3 rounded-md bg-muted text-sm">
            <p className="font-medium">Available Commands:</p>
            <ul className="mt-1 text-xs leading-relaxed">
              <li>0 — Enable Debug Mode</li>
              <li>1 — (Reserved for future)</li>
              {/* Add more later */}
            </ul>
          </div>

          {/* Input Box */}
          <Input
            placeholder="Enter command number"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {/* Submit Button */}
          <Button className="w-full" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
