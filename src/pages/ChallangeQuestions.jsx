'use client';

import GlobalSuccess from '@/components/global/GlobalSuccess';
import HeaderTop from '@/components/global/HeaderTop';
import ChallengeQuestionsForm from '@/components/security-questions/ChallengeQuestionsForm';

export default function ChallengeQuestions() {
  return (
    <div>
      <HeaderTop
        title="Challenge Questions"
        text="Set up security questions for enhanced account protection"
        link="/dashboard/settings"
        linkText="Back to Settings"
      />

      <ChallengeQuestionsForm />

      {/* Success Modal */}
      <GlobalSuccess />
    </div>
  );
}
