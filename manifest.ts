import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from './package.json';

const isDev = process.env.NODE_ENV !== 'production';
const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/);

// 开发环境下的content_scripts注入热更新
const devContentScriptsInject = {
  js: ['src/content/dev_hot.js'],
  matches: ['*://*/*'],
};

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: 'tab',
  description: '一个tab',
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  background: {
    service_worker: 'src/background/index.js',
    type: 'module',
  },
  chrome_url_overrides: {
    newtab: 'tab.html',
  },
  permissions: [
    'background',
    'alarms',
    'bookmarks',
    'favicon',
    'storage',
    'activeTab',
    'tabs',
    'contextMenus',
    'geolocation',
    'management',
    'unlimitedStorage',
    'topSites',
    'identity',
    'history',
    'notifications',
    'declarativeContent',
    'webNavigation',
    'webRequest', //拦截组织和修改http请求
    'webRequestBlocking',
    'cookies',
    'scripting',
    'search',
    'tabCapture',
  ],
  host_permissions: ['*://*/*'],
  web_accessible_resources: [
    {
      resources: ['_favicon/*', 'assets/*'], // 插件可以访问的资源，图标及插件构建后的静态资源
      matches: ['*://*/*'],
      extension_ids: ['*'],
    },
  ],
  action: {
    default_popup: 'popup.html',
    default_icon: {
      16: 'public/vite.svg',
      32: 'public/vite.svg',
      48: 'public/vite.svg',
      128: 'public/vite.svg',
    },
    default_title: 'React CRX MV3',
  },
  icons: {
    16: 'public/vite.svg',
    32: 'public/vite.svg',
    48: 'public/vite.svg',
    128: 'public/vite.svg',
  },
  externally_connectable: {
    matches: ['http://127.0.0.1:5173/', 'http://localhost:5173/'],
  },
  content_security_policy: {
    extension_pages:
      env.mode === 'development'
        ? `script-src 'self' http://localhost:5173; object-src 'self' http://localhost:5173`
        : "script-src 'self'; object-src 'self';",
  },
  content_scripts: [
    env.mode === 'development' ? devContentScriptsInject : null,
    {
      js: ['src/content/googleToBaidu/index.js'],
      matches: [
        'https://www.google.com/*',
        'https://www.google.com.hk/*',
        'https://www.baidu.com/*',
      ],
    },
    {
      js: ['src/content/main/main.jsx'],
      matches: ['*://*/*'],
    },
  ].filter((i) => i),
}));
