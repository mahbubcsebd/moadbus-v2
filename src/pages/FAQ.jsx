import FAQSection from '@/components/faq/FAQSection';
import Banner from '@/components/global/Banner';

export default function FAQPage() {
  return (
    <>
      <Banner
        //   image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
        title="Frequently Ask Question"
        text="Build something extraordinary with us."
      />

      <FAQSection />
    </>
  );
}
