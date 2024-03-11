import SourceBgmd from "./db/bgmd.mjs";
import SourceBimiBimi from "./db/bimibimi.mjs";
import SourceAlidRuach from "./db/alid_ruach.mjs";
import SourceAgeFans from "./online/agefans.mjs";
import SourceCopyManga from "./online/copymanga.mjs";
import SourceDmzj from "./online/dmzj.mjs";
import SourceMikanAni from "./online/mikanani.mjs";
import SourceKoxMoe from "./online/koxmoe.mjs";
import SourceNicoTV from "./online/nicotv.mjs";
import SourceZzzFun from "./online/zzzfun.mjs";

const AIRANIME_RP_URL = "./fetch";

const ALL_SOURCES = [
    new SourceBgmd(
        "Official/bgmd/bgmd",
        "github.com/bangumi-data/bangumi-data",
        `${AIRANIME_RP_URL}/bgmd/only`
    ),
    new SourceBimiBimi(
        "Anime/bimibimi/BimiBimi",
        "www.bimiacg10.net",
        `${AIRANIME_RP_URL}/file/bimibimi.json`
    ),
    new SourceAlidRuach(
        "Anime/alid_ruach/阿里云盘@Ruach",
        "docs.qq.com/doc/DRHhIUkFqeWhGYmpT",
        `${AIRANIME_RP_URL}/file/alid_ruach.json`
    ),
    new SourceAgeFans(
        "Anime/agefans/AGE动画",
        "www.agedm.org",
        `${AIRANIME_RP_URL}/agefans/{kt}`
    ),
    new SourceNicoTV(
        "Anime/nicotv/妮可动漫",
        "www.nicotv.wtf",
        `${AIRANIME_RP_URL}/nicotv/{kt}`
    ),
    new SourceZzzFun(
        "Anime/zzzfun/ZzzFun",
        "www.zzzfun.one",
        `${AIRANIME_RP_URL}/zzzfun/{kt}`
    ),
    new SourceMikanAni(
        "Anime/mikanani/蜜柑计划",
        "mikanani.me",
        `${AIRANIME_RP_URL}/mikanani/{kt}`
    ),
    new SourceKoxMoe(
        "Manga/koxmoe/KoxMoe",
        "kox.moe",
        `${AIRANIME_RP_URL}/koxmoe/{kt}`
    ),
    new SourceDmzj(
        "Manga/dmzj/动漫之家",
        "dmzj.com",
        `${AIRANIME_RP_URL}/dmzj/{kt}`
    ),
    new SourceCopyManga(
        "Manga/copymanga/拷贝漫画",
        "www.copymanga.tv",
        `${AIRANIME_RP_URL}/copymanga/{kt}`
    ),
];

export default {
    filter: {
        _cache: {},
        _noNames: [],
        doReload() {
            this._cache = {};
        },
        setNoNames(val) {
            if (!val) return;
            this._noNames = val.filter(n => n !== "bgmd");
            this.doReload();
        },
        allSubKey(key) {
            if (!this._cache.allSubKey) this._cache.allSubKey = {};
            if (!this._cache.allSubKey[key]) {
                const r = [];
                ALL_SOURCES.forEach(source => {
                    if (source[key] && !r.includes(source[key]))
                        r.push(source[key]);
                });
                this._cache.allSubKey[key] = r;
            }
            return this._cache.allSubKey[key];
        },
        method(subkey) {
            return this._filter("method", subkey);
        },
        name(subkey) {
            return this._filter("name", subkey, true);
        },
        type(subkey) {
            return this._filter("type", subkey);
        },
        _filter(key, subkey, unique = false) {
            if (!this._cache[key]) {
                const r = {};
                ALL_SOURCES.forEach(source => {
                    if (this._noNames.includes(source.name))
                        return;
                    if (unique)
                        return r[source[key]] = source;
                    if (!r[source[key]]) r[source[key]] = [];
                    r[source[key]].push(source);
                });
                this._cache[key] = r;
            }
            if (!subkey) return Object.entries(this._cache[key]);
            if (!this._cache[key][subkey]) return [];
            return this._cache[key][subkey];
        }
    }
}
