var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve, join } from 'path';
import { readFileSync, existsSync, copyFileSync } from 'fs';
var DOCS_PUBLIC = resolve(__dirname, 'public/docs');
function includedRoutes(_paths, _routes) {
    return __awaiter(this, void 0, void 0, function () {
        var routes, versionsData, versions, versionParams, _i, versionParams_1, version, versionPath, mainPath, base, main, _a, _b, c, _c, _d, i, _e, _f, e, guidesPath, guides, _g, guides_1, g;
        var _h, _j, _k, _l;
        return __generator(this, function (_m) {
            routes = ['/', '/changelog'];
            if (!existsSync(resolve(DOCS_PUBLIC, 'versions.json'))) {
                console.warn('[included-routes] versions.json not found, using minimal routes');
                return [2 /*return*/, routes];
            }
            versionsData = JSON.parse(readFileSync(resolve(DOCS_PUBLIC, 'versions.json'), 'utf-8'));
            versions = (_h = versionsData.versions) !== null && _h !== void 0 ? _h : [];
            versionParams = __spreadArray(['latest'], versions, true);
            for (_i = 0, versionParams_1 = versionParams; _i < versionParams_1.length; _i++) {
                version = versionParams_1[_i];
                versionPath = version === 'latest' ? 'latest' : "v".concat(version);
                mainPath = resolve(DOCS_PUBLIC, versionPath, 'main.json');
                if (!existsSync(mainPath))
                    continue;
                base = "/v/".concat(version);
                routes.push(base);
                routes.push("".concat(base, "/guides"));
                routes.push("".concat(base, "/docs/classes"));
                routes.push("".concat(base, "/docs/typedefs"));
                routes.push("".concat(base, "/api"));
                main = JSON.parse(readFileSync(mainPath, 'utf-8'));
                for (_a = 0, _b = (_j = main.classes) !== null && _j !== void 0 ? _j : []; _a < _b.length; _a++) {
                    c = _b[_a];
                    routes.push("".concat(base, "/docs/classes/").concat(c.name));
                }
                for (_c = 0, _d = (_k = main.interfaces) !== null && _k !== void 0 ? _k : []; _c < _d.length; _c++) {
                    i = _d[_c];
                    routes.push("".concat(base, "/docs/typedefs/").concat(i.name));
                }
                for (_e = 0, _f = (_l = main.enums) !== null && _l !== void 0 ? _l : []; _e < _f.length; _e++) {
                    e = _f[_e];
                    routes.push("".concat(base, "/docs/typedefs/").concat(e.name));
                }
                guidesPath = resolve(DOCS_PUBLIC, versionPath, 'guides.json');
                if (existsSync(guidesPath)) {
                    guides = JSON.parse(readFileSync(guidesPath, 'utf-8'));
                    for (_g = 0, guides_1 = guides; _g < guides_1.length; _g++) {
                        g = guides_1[_g];
                        routes.push("".concat(base, "/guides/").concat(g.slug));
                    }
                }
            }
            console.log("[included-routes] Generated ".concat(routes.length, " routes for SSG"));
            return [2 /*return*/, routes];
        });
    });
}
/** Copy index.html to 404.html so Vercel serves the SPA for unmatched routes */
function vercel404Plugin() {
    return {
        name: 'vercel-404',
        closeBundle: function () {
            var outDir = join(__dirname, 'dist');
            copyFileSync(join(outDir, 'index.html'), join(outDir, '404.html'));
        },
    };
}
export default defineConfig({
    base: '/',
    plugins: [vue(), vercel404Plugin()],
    ssgOptions: {
        includedRoutes: includedRoutes,
    },
    resolve: {
        alias: {
            '~': resolve(__dirname, 'src'),
        },
    },
    server: {
        port: 3333,
    },
});
