// Languages offered on the site. The six "popular" ones are shown as cards; everything else sits in a select.
// Pages are translated with the Google Cloud Translation API (see app/api/translate). Google does not support Edo,
// so it stays "coming soon" until a human translation is added.
export type Lang = {code: string; name: string; ready?: boolean; rtl?: boolean};

export const popular: Lang[] = [
  {code: 'en', name: 'English'},
  {code: 'fr', name: 'Français'},
  {code: 'yo', name: 'Yorùbá'},
  {code: 'ha', name: 'Hausa'},
  {code: 'ig', name: 'Igbo'},
  {code: 'bin', name: 'Edo', ready: false},
];

export const more: Lang[] = [
  {code: 'af', name: 'Afrikaans'}, {code: 'sq', name: 'Shqip'}, {code: 'am', name: 'አማርኛ'}, {code: 'ar', name: 'العربية', rtl: true}, {code: 'hy', name: 'Հայերեն'},
  {code: 'az', name: 'Azərbaycan'}, {code: 'eu', name: 'Euskara'}, {code: 'be', name: 'Беларуская'}, {code: 'bn', name: 'বাংলা'}, {code: 'bs', name: 'Bosanski'},
  {code: 'bg', name: 'Български'}, {code: 'ca', name: 'Català'}, {code: 'zh-CN', name: '中文 (简体)'}, {code: 'zh-TW', name: '中文 (繁體)'}, {code: 'hr', name: 'Hrvatski'},
  {code: 'cs', name: 'Čeština'}, {code: 'da', name: 'Dansk'}, {code: 'nl', name: 'Nederlands'}, {code: 'et', name: 'Eesti'}, {code: 'tl', name: 'Filipino'},
  {code: 'fi', name: 'Suomi'}, {code: 'gl', name: 'Galego'}, {code: 'ka', name: 'ქართული'}, {code: 'de', name: 'Deutsch'}, {code: 'el', name: 'Ελληνικά'},
  {code: 'gu', name: 'ગુજરાતી'}, {code: 'he', name: 'עברית', rtl: true}, {code: 'hi', name: 'हिन्दी'}, {code: 'hu', name: 'Magyar'}, {code: 'is', name: 'Íslenska'},
  {code: 'id', name: 'Bahasa Indonesia'}, {code: 'it', name: 'Italiano'}, {code: 'ja', name: '日本語'}, {code: 'kn', name: 'ಕನ್ನಡ'}, {code: 'kk', name: 'Қазақша'},
  {code: 'km', name: 'ភាសាខ្មែរ'}, {code: 'rw', name: 'Kinyarwanda'}, {code: 'ko', name: '한국어'}, {code: 'ku', name: 'Kurdî'}, {code: 'lg', name: 'Luganda'},
  {code: 'lv', name: 'Latviešu'}, {code: 'ln', name: 'Lingála'}, {code: 'lt', name: 'Lietuvių'}, {code: 'mk', name: 'Македонски'}, {code: 'mg', name: 'Malagasy'},
  {code: 'ms', name: 'Bahasa Melayu'}, {code: 'ml', name: 'മലയാളം'}, {code: 'mr', name: 'मराठी'}, {code: 'ne', name: 'नेपाली'}, {code: 'no', name: 'Norsk'},
  {code: 'ny', name: 'Chichewa'}, {code: 'fa', name: 'فارسی', rtl: true}, {code: 'pl', name: 'Polski'}, {code: 'pt', name: 'Português'}, {code: 'pa', name: 'ਪੰਜਾਬੀ'},
  {code: 'ro', name: 'Română'}, {code: 'ru', name: 'Русский'}, {code: 'sr', name: 'Српски'}, {code: 'st', name: 'Sesotho'}, {code: 'sn', name: 'chiShona'},
  {code: 'sd', name: 'سنڌي', rtl: true}, {code: 'sk', name: 'Slovenčina'}, {code: 'sl', name: 'Slovenščina'}, {code: 'so', name: 'Soomaali'}, {code: 'es', name: 'Español'},
  {code: 'sw', name: 'Kiswahili'}, {code: 'sv', name: 'Svenska'}, {code: 'ta', name: 'தமிழ்'}, {code: 'te', name: 'తెలుగు'}, {code: 'th', name: 'ไทย'},
  {code: 'ti', name: 'ትግርኛ'}, {code: 'tr', name: 'Türkçe'}, {code: 'ak', name: 'Twi'}, {code: 'uk', name: 'Українська'}, {code: 'ur', name: 'اردو', rtl: true},
  {code: 'uz', name: 'Oʻzbek'}, {code: 'vi', name: 'Tiếng Việt'}, {code: 'cy', name: 'Cymraeg'}, {code: 'xh', name: 'isiXhosa'}, {code: 'zu', name: 'isiZulu'},
];

export const allLanguages: Lang[] = [...popular, ...more];
export const findLang = (code: string): Lang => allLanguages.find(l => l.code === code) ?? popular[0];
/** Codes the translate route accepts (English is the source, Edo has no Google support). */
export const translatable = new Set(allLanguages.filter(l => l.code !== 'en' && l.ready !== false).map(l => l.code));
