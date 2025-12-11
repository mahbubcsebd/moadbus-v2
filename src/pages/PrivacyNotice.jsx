import Banner from '@/components/global/Banner';
import PrivacyPolicy from '@/components/privacy/PrivacyPolicy';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Banner
        image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
        title="Privacy Policy"
        text="Build something extraordinary with us."
      />

      <PrivacyPolicy />
    </>
  );
}
