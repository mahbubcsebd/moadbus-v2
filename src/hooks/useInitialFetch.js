import { useMetaDataStore } from '@/store/useMetaDataStore';
import { useEffect, useRef } from 'react';
import { welcomeApi } from '../api/endpoints';

export const useInitialFetch = (payload = {}) => {
  const hasFetched = useRef(false);
  const setQuestions = useMetaDataStore((state) => state.setQuestions);
  const setBranches = useMetaDataStore((state) => state.setBranches);
  const setTransferTypes = useMetaDataStore((state) => state.setTransferTypes);
  const setTn = useMetaDataStore((state) => state.setTn);

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchData = async () => {
      try {
        const result = await welcomeApi(payload);
        const questionsString = result.rs?.questions || '';
        const branchesString = result.rs?.pickupBranches || '';
        const transferTypesString = result.rs?.ttypes || '';
        setTn(result.rs.tn);
        console.log('Transfer types:', transferTypesString);

        // Prepare Questions for global uses.
        if (questionsString) {
          const questionsArray = questionsString.split('|').map((item) => {
            const [value, label] = item.split('#');
            return { value: value?.trim(), label: label?.trim() };
          });

          setQuestions(questionsArray);
        }

        // Prepare Branches for global uses.
        if (branchesString) {
          const branchesArray = branchesString.split('|').map((item) => {
            const [value, label] = item.split('#');
            return { value: value?.trim(), label: label?.trim() };
          });

          setBranches(branchesArray);
        }

        // Prepare Transfer Types global uses.
        if (transferTypesString) {
          const transferTypesArray = transferTypesString.split('|').map((item) => {
            const [value, label] = item.split('#');
            return { value: value?.trim(), label: label?.trim() };
          });

          setTransferTypes(transferTypesArray);
        }
        // store welcome response
        useMetaDataStore.getState().setLangs(result.langs);
        useMetaDataStore.getState().setTn(result.rs.tn);
        useMetaDataStore.getState().setCbt?.(result.rs.cbt); 
        useMetaDataStore.getState().setTtypes(result.ttypes);
        useMetaDataStore.getState().setStypes(result.stypes);
        useMetaDataStore.getState().setAikey(result.setAikey);
      } catch (err) {
        console.error('Welcome API error:', err);
      }
    };

    fetchData();
    hasFetched.current = true;
  }, []);
};
