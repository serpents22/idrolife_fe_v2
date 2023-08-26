import en from '../locales/en.json'
import it from '../locales/it.json'
import { createI18n } from 'vue-i18n'


const i18n = createI18n({
    locale: 'it',
    messages: {
      en: en,
      it: it
    },
  })


export default i18n