import Vue from "vue";
import VueI18n from "vue-i18n";
import elementEnLocale from 'element-ui/lib/locale/lang/en';
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN';
import ZH from './zh-CN'
import EN from './en-US'

Vue.use(VueI18n);
const lang = localStorage.getItem('lang') || 'zh-CN';
const locale = lang==='zh-CN'?'zh':'en';
const localeMessages = {
    en: {
        ...elementEnLocale,
        ...EN
    },
    zh:{
        ...elementZhLocale,
        ...ZH
    }
};
console.log('localeMessages',localeMessages);
const i18n = new VueI18n({
    locale: locale,
    messages: localeMessages
})

// ElementLocale.i18n((key, value) => i18n.t(key, value))
export default i18n;

