import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react'; // Import Warning Icon

const RegistrationPrecon = ({
  isOpen,
  onClose,
  formData,
  onConfirm,
  isSubmitting,
  warningText,
}) => {
  if (!formData) return null;

  const filteredEntries = Object.entries(formData).filter(([key, value]) => {
    // Exclude internal keys
    if (key.startsWith('question_') || key.startsWith('answer_')) return false;

    // Explicitly exclude internal ID or raw data keys if passed
    if (['statusCode', 'status', 'ec', 'msg', 'requestDateTime'].includes(key)) return false;

    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;

    return true;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg w-full p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative p-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Review Your Information
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute text-gray-400 transition-colors right-4 top-4 hover:text-gray-600"
          >
            {/* <X className="w-5 h-5" /> */}
          </button>
        </DialogHeader>

        <div className="p-4 space-y-3">
          {/* Warning Block */}
          {warningText && (
            <div className="flex items-start gap-3 p-3 text-sm text-orange-800 border border-orange-200 rounded-md bg-primary/5">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{warningText}</span>
            </div>
          )}

          <div className="space-y-2">
            {filteredEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between pb-1 text-sm border-b border-gray-50 last:border-0"
              >
                <span className="font-medium text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="text-right text-gray-900">{String(value)}</span>
              </div>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <p className="text-center text-gray-500">No information entered to review.</p>
          )}
        </div>

        <DialogFooter className="flex gap-3 p-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Change
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 text-white bg-primary hover:bg-primary"
            loading={isSubmitting}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationPrecon;
