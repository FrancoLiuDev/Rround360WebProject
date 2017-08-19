import axios from 'axios'

class I18nPlugin {
    constructor(defLang, langPath = './') {
        this.langPath = langPath
        this.defLang = defLang
        this.sysLang = window.navigator.language || window.navigator.userLanguage || defLang
        this.lang = this.sysLang
    }

    initIn18nSync(VueI18n, lang = null) {
        if (lang) {
            this.lang = lang
        }
        let in18nDef
        return new Promise((resolve, reject) => {
            axios.get(this.langPath + this.lang + '.json', { json: true })
                .then((in18nDef) => {
                    this.i18n = new VueI18n({
                        locale: this.lang, // set locale
                        fallbackLocale: this.lang, //後備翻譯
                        messages: in18nDef.data, // set locale messages
                    })
                    resolve(this.i18n)
                })
                .catch((err) => {
                    this.lang = this.defLang
                    axios.get(this.langPath + this.lang + '.json', { json: true })
                        .then((in18nDef) => {
                            this.i18n = new VueI18n({
                                locale: lang, // set locale
                                fallbackLocale: lang, //後備翻譯
                                messages: in18nDef.data, // set locale messages
                            })
                            resolve(this.i18n)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
        })
    }

    setLangSync(lang) {
        return new Promise((resolve, reject) => {
            axios.get(this.langPath + lang + '.json', { json: true })
                .then((in18nDef) => {
                    this.i18n.setLocaleMessage(lang, in18nDef.data[lang])
                    this.i18n.locale = lang
                    this.lang = lang
                    resolve()
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}

export default I18nPlugin
