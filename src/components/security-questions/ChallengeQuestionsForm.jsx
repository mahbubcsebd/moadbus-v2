import Alert from '@/components/global/Alert';
import ConfirmationModal from '@/components/global/ConfirmationModal';
import { useSecurityStore } from '@/store/securityStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import { Button } from '../ui/button';

const securityQuestions = [
  { value: '1', label: 'Birth Place?' },
  { value: '2', label: 'What is the nickname you gave your favorite grandparent?' },
  { value: '3', label: 'Nationality?' },
  { value: '4', label: 'Location?' },
  { value: '5', label: 'What is your dream car?' },
  { value: '6', label: 'Date of Birth?' },
  { value: '7', label: 'What is the name of your best childhood friend?' },
  { value: '8', label: 'What was the first name of your favorite teacher or professor?' },
  { value: '9', label: 'Which city was your honeymoon?' },
  { value: '10', label: 'Where did your parents meet?' },
  { value: '11', label: 'Which event in your life has had the greatest impact on you?' },
  { value: '12', label: 'What is your favorite color?' },
  { value: '13', label: 'If you could be a character from any movie or novel, who would you be?' },
  { value: '14', label: 'What is your favorite musical instrument?' },
  { value: '15', label: "Who was the boss who's had the greatest impact on you?" },
  { value: '16', label: 'What was the make and model of your first car?' },
  { value: '17', label: 'What is the name of your favorite restaurant?' },
  { value: '18', label: 'What was the first concert you attended?' },
  { value: '19', label: 'Who is your favorite person in history?' },
  { value: '20', label: 'Which city did you visit on your first trip?' },
  { value: '21', label: 'In what city were you born?' },
  { value: '22', label: 'What is your favorite movie?' },
  { value: '23', label: 'What is the first name of the person you will never forget?' },
];

const initialQuestionsState = Array.from({ length: 5 }, (_, index) => ({
  question: '',
  answer: '',
  id: index + 1,
}));

const ChallengeQuestionsForm = () => {
  const { updateChallengeQuestions, isSubmitting, error, clearError } = useSecurityStore();

  const [questions, setQuestions] = useState(initialQuestionsState);
  const [errors, setErrors] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationWarning, setValidationWarning] = useState(null);

  const handleChange = (id, field, value) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
    setErrors((prev) => prev.filter((err) => err.id !== id));
    if (error) clearError();
    if (validationWarning) setValidationWarning(null);
  };

  const validate = () => {
    const newErrors = [];
    const usedQuestions = new Set();
    let answeredCount = 0;

    questions.forEach((q) => {
      const hasData = q.question || q.answer.trim();

      if (hasData) {
        if (q.question && q.answer.trim()) {
          answeredCount++;
          if (usedQuestions.has(q.question)) {
            newErrors.push({
              id: q.id,
              field: 'question',
              message: 'Duplicate question selected.',
            });
          } else {
            usedQuestions.add(q.question);
          }
        } else if (q.question && !q.answer.trim()) {
          newErrors.push({ id: q.id, field: 'answer', message: 'Answer is required.' });
        } else if (!q.question && q.answer.trim()) {
          newErrors.push({ id: q.id, field: 'question', message: 'Please select a question.' });
        }
      }
    });

    if (answeredCount < 3) {
      return { valid: false, message: 'Please answer at least 3 security questions.' };
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return { valid: false, message: 'Please fix the errors highlighted below.' };
    }

    setErrors([]);
    return { valid: true };
  };

  const handleInitiateSubmit = (e) => {
    e.preventDefault();
    setValidationWarning(null);

    const validation = validate();

    if (validation.valid) {
      setShowConfirm(true);
    } else {
      if (validation.message) {
        setValidationWarning(validation.message);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleConfirmSubmit = async () => {
    const validQuestions = questions.filter((q) => q.question && q.answer);

    // Call API
    const success = await updateChallengeQuestions(validQuestions);

    if (success) {
      setShowConfirm(false);
      // RESET FORM HERE
      setQuestions(initialQuestionsState);
      setErrors([]);
      setValidationWarning(null);
    } else {
      setShowConfirm(false);
    }
  };

  const getError = (id, field) => {
    const errorObj = errors.find((err) => err.id === id && err.field === field);
    return errorObj ? errorObj.message : undefined;
  };

  const getQuestionLabel = (val) => {
    return securityQuestions.find((sq) => sq.value === val)?.label || 'Unknown Question';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl p-6 mx-auto mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      {/* Alerts */}
      <AnimatePresence>
        {validationWarning && (
          <div className="mb-6">
            <Alert
              type="warning"
              message={validationWarning}
              onClose={() => setValidationWarning(null)}
            />
          </div>
        )}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={clearError} />
          </div>
        )}
      </AnimatePresence>

      <form onSubmit={handleInitiateSubmit} className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <GlobalSelect
              label={q.id === 1 ? 'Select Question' : undefined}
              placeholder={`Question ${q.id}`}
              value={q.question}
              onChange={(value) => handleChange(q.id, 'question', value)}
              options={securityQuestions}
              error={getError(q.id, 'question')}
              labelClassName={q.id > 1 ? 'sr-only md:not-sr-only text-transparent select-none' : ''}
            />

            <GlobalInput
              label={q.id === 1 ? 'Enter Answer' : undefined}
              name={`answer-${q.id}`}
              placeholder={`Answer ${q.id}`}
              value={q.answer}
              onChange={(e) => handleChange(q.id, 'answer', e.target.value)}
              error={getError(q.id, 'answer')}
              labelClassName={q.id > 1 ? 'sr-only md:not-sr-only text-transparent select-none' : ''}
            />
          </div>
        ))}

        <div className="flex justify-start max-w-sm gap-4 pt-4 mx-auto">
          <Button
            variant="outline"
            onClick={() => {
              setQuestions(initialQuestionsState);
              setValidationWarning(null);
              clearError();
            }}
            size="default"
            type="button"
            className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Reset
          </Button>
          <Button
            variant="primary"
            type="submit"
            size="default"
            className="w-full text-white bg-primary hover:bg-primary"
          >
            Save Questions
          </Button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirm Security Questions"
        confirmText="Confirm & Save"
        cancelText="Edit"
        isLoading={isSubmitting}
        message={
          <div className="text-left w-full space-y-4 max-h-[60vh] overflow-y-auto px-1">
            {questions
              .filter((q) => q.question && q.answer)
              .map((q, idx) => (
                <div key={idx} className="pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-bold text-gray-800">
                        {getQuestionLabel(q.question)}
                      </p>
                      <p className="text-sm font-medium text-gray-700">{q.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        }
      />
    </motion.div>
  );
};

export default ChallengeQuestionsForm;
