import Banner from '@/components/global/Banner';
import FindBranch from './FindBranch';

export default function BeforeLoginFindBranch() {
  return (
    <>
      <Banner
        image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
        title="Find Branch"
        text="Locate our branches and ATMs near you"
      />

      <FindBranch isHideHeader />
    </>
  );
}
