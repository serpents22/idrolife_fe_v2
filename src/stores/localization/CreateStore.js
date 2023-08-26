import { createPinia } from 'pinia';
import { useI18n } from 'vue-i18n';

const i18n = createI18n({
    locale: 'it',
});

export const pinia = createPinia();

pinia.use(({ store }) => {
  store.$i18n = i18n;
});