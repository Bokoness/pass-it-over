import axios from "axios"
import {en as vEn, he as vHb, ar as vAr} from "vuetify/lib/locale"

export default class GeneralService {
  static async getTranslation(i18n) {
    const en = await axios("/en.json")
    const he = await axios("/he.json")
    const ar = await axios("/ar.json")
    i18n.setLocaleMessage("en", {$vuetify: vEn, ...en.data})
    i18n.setLocaleMessage("he", {$vuetify: vHb, ...he.data})
    i18n.setLocaleMessage("ar", {$vuetify: vAr, ...ar.data})
    window.a = i18n
  }
}
