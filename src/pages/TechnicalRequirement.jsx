import Banner from '@/components/global/Banner';
import TechnicalRequirement from '@/components/technical-requiremnet/TechnicalRequirement';
// import TechnicalRequirement from '@/components/TechnicalRequirement';

export default function TechnicalRequirementPage() {
  return (
    <>
      <Banner
        //   image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
        title="Technical Requirements"
        text="Build something extraordinary with us."
      />

      <TechnicalRequirement />
    </>
  );
}
