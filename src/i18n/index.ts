import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';
import tj from './locales/tj.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  uz: { translation: uz },
  tj: { translation: tj },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uz',
    debug: false,

    supportedLngs: ['en', 'ru', 'uz', 'tj'],
    nonExplicitSupportedLngs: true,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
  });

if (!localStorage.getItem('i18nextLng')) {
  localStorage.setItem('i18nextLng', 'uz');
}

export default i18n;
