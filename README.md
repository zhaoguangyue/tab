# 一个插件由以下 4 部分组成

manifest.json （插件配置文件）
popup (点击插件图标弹出的页面)
content script (插入到目标页面中执行的 js)
background script (在 chrome 后台中运行的程序)

# 产物的文件及目录结构应为

```
    ├─ favicon.ico         <--这个没有也行，用不到
    ├─ index.html          <--popup入口页面
    ├─ insert.js           <--插入到目标页面执行的js（非必须，视业务需求而定）
    ├─ manifest.json       <--插件的配置文件
    └─ /static
       ├─ /css
       |  ├─ content.css   <--content页面样式（会与目标页面互相污染）
       |  └─ main.css      <--popup页面样式（不会与目标页面互相污染）
       ├─ /js
       |  ├─ background.js <--background script
       |  ├─ content.js    <--content script
       |  └─ main.js       <--popup script
       └─ /media           <--项目的图片资源存放目录
```

# mainfest 文件说明

```
{
  "name": "Chrome插件V3",
  "version": "1.0",
  "description": "React开发chrome插件V3 Demo。",
  // Chrome Extension 版本号，3表示MV3
  "manifest_version": 3,
  // 新标签页
  "chrome_url_overrides": {
    "newtab": "newTab.html"
  },
  // background script配置（根目录为最终build生成的插件包目录）
  "background": {
    "service_worker": "static/js/background.js"
  },
  // content script配置
  "content_scripts": [
    {
      // 应用于哪些页面地址（可以使用正则，<all_urls>表示匹配所有地址）
      "matches": ["<all_urls>"],
      // 注入到目标页面的css，注意不要污染目标页面的样式
      "css": ["static/css/content.css"],
      // 注入到目标页面js，这个js是在沙盒里运行，与目标页面是隔离的，没有污染问题。
      "js": ["static/js/content.js"],
      // 代码注入的时机，可选document_start、document_end、document_idle（默认）
      "run_at": "document_end"
    }
  ],
  // 申请chrome extension API权限
  "permissions": ["storage","declarativeContent"],
  // 插件涉及的外部请求地址，暂未发现影响跨域请求，猜测是用于上架商店时方便审核人员查阅
  "host_permissions":[],
  // 如果向目标页面插入图片或者js，需要在这里授权插件本地资源（以下仅为示例）。
  "web_accessible_resources": [
    {
      "resources": [ "/images/app.png" ],
      "matches": ["<all_urls>"]
    },
    {
      "resources": [ "insert.js" ],
      "matches": ["<all_urls>"]
    }
  ],
  // popup页面配置
  "action": {
    // popup页面的路径（根目录为最终build生成的插件包目录）
    "default_popup": "index.html",
    // 浏览器插件按钮的图标
    "default_icon": {
      "16": "/images/app.png",
      "32": "/images/app.png",
      "48": "/images/app.png",
      "128": "/images/app.png"
    },
    // 浏览器插件按钮hover显示的文字
    "default_title": "React CRX MV3"
  },
  // 插件图标，图省事的话，所有尺寸都用一个图也行
  "icons": {
    "16": "/images/app.png",
    "32": "/images/app.png",
    "48": "/images/app.png",
    "128": "/images/app.png"
  }

```
