import { createI18n } from 'vue-i18n';
import ru from './locales/ru.json';
import en from './locales/en.json';

export type Locale = 'ru' | 'en';

const getStoredLocale = (): Locale => {
  const stored = localStorage.getItem('locale');
  if (stored === 'en' || stored === 'ru') {
    return stored;
  }
  // Default to Russian
  return 'ru';
};

export const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale(),
  fallbackLocale: 'en',
  messages: {
    ru,
    en,
  },
});

export const setLocale = (locale: Locale) => {
  i18n.global.locale.value = locale;
  localStorage.setItem('locale', locale);
};

export const getLocale = (): Locale => {
  return i18n.global.locale.value as Locale;
};
