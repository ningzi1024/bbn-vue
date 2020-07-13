import Vue from "vue";
import VueI18n from "vue-i18n";
import elementEnLocale from 'element-ui/lib/locale/lang/en';
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN';
import ElementLocale from 'element-ui/lib/locale';
import { getLangJson } from '../../services/services'

Vue.use(VueI18n);
const lang = localStorage.getItem('lang') || 'zh-CN';

async function getLocalLang(type='zh-CN'){
    const url = type==='zh-CN'? '/static/i18n/zh-CN.json' : '/static/i18n/en-US.json';
    return await getLangJson(url).then(res=>res)
}
let nowLang = getLocalLang(lang);
const localeMessages = {
    en: {
        ...elementEnLocale,
        ...nowLang
    },
    zh:{
        ...elementZhLocale,
        ...nowLang
    }
};

const i18n = new VueI18n({
    locale: 'zh',
    messages: localeMessages
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

