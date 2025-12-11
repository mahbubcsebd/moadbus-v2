import { parseTransactions } from '@/utils/formatResponses';
import { create } from 'zustand';

export const useBillersStore = create((set) => ({
  templates:[],
  billers: [],

  setTemplates: (templates) => set({ templates: templates }),
  setBillers: (billers) => set({ billers }), 
 

}));
 
