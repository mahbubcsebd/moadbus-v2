import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebugStore } from '@/store/debugStore';
import { useState } from 'react';

export default function DebugModal({ open, onOpenChange }) {
  const [code, setCode] = useState('');
  const enableDebug = useDebugStore((s) => s.enableDebug);

  const handleSubmit = () => {
    if (code === '0') {
      enableDebug();

      alert('Debug Mode Enabled!');
    } else if(code === '1'){
      window.cordova.exec(
        function (response) { 
          alert(response);
        },
        function (error) {
          alert('error');
          alert(error);
        },
        "EncodeDecode", "exportLogs", []
      );
    }else if(code === '2'){
       cordova.exec(
        function (response) {
          alert('success');
          alert(response);
        },
        function (error) {
          alert('error');
          alert(error);
        },
        "EncodeDecode", "clearLogs", []
      );
    }else {
      alert('Invalid Option');
    }
    

    setCode('');
    onOpenChange(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Developer Options</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="p-3 rounded-md bg-muted text-sm">
            <p className="font-medium">Available Commands:</p>
            <ul className="mt-1 text-xs leading-relaxed">
              <li>0 — Enable Debug Mode</li>
              <li>1 — Export logs</li>
              <li>2 — Clear logs</li>
            </ul>
          </div>

          <Input
            placeholder="Enter command number"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />

          <Button className="w-full" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
