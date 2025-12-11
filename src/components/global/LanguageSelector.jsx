import { usePopup } from '@/context/PopupContext';
import { useLangStore } from '@/store/langStore';
import { loadLanguage } from '@/utils/loadLanguage';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', shortCode: 'US' },
  { code: 'es', name: 'Español', flag: '🇪🇸', shortCode: 'ES' },
];

const LanguageSelector = () => {
  const { lang, setLanguage } = useLangStore();
  const { showMsgPopup } = usePopup();

  const handleChange = async (value) => {
    setLanguage(value);
    await loadLanguage(value);

    const selectedLang = languages.find((lang) => lang.code === value)?.name || value;
    showMsgPopup('success', `Language has been changed to ${selectedLang}`);
  };
  return (
    <Select value={lang} onValueChange={handleChange}>
      <SelectTrigger className="w-[130px] border-gray-200 text-primary hover:bg-primary/5 focus:ring-gray-200">
        <Globe className="w-4 h-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
