import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../../../assets/locales/en.json';
import arTranslation from '../../../assets/locales/hi.json';

i18n.use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ar: {
        translation: arTranslation,
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
