import { notionApi, type OperateType } from "./notion";

const Engine = {
  Baidu: "baidu",
  Google: "google",
};

const SearchFunc = {
  [Engine.Baidu]: async (val: string) => {
    const response = await fetch(
      `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=36557,38408,38368,38399,37862,38173,38289,36803,37932,38314,38284,26350,37959,38422,37881&wd=${val}&req=2&csor=8&pwd=&cb=jQuery110201452358204012123_1679478301415&_=1679478301425`,
      {
        method: "GET",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
      }
    );
    const resText = await response.text();
    const resFormat = JSON.parse(resText.slice(3, -1));
    return resFormat?.g?.map((item: any) => item.q) || [];
  },
  [Engine.Google]: async (val: string) => {
    const response = await fetch(
      `https://www.google.com.hk/complete/search?q=${val}&client=chrome&hl=zh-CN`,
      {
        method: "GET",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
      }
    );
    const resText = await response.text();
    const resFormat = JSON.parse(resText);
    return resFormat?.[1] || [];
  },
};

// @ts-ignore
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, payload, engine } = request;
  switch (action) {
    case "search":
      (async () => {
        const res = await SearchFunc[engine](payload);
        console.log("file: index.ts:47 ~ res:", res);
        sendResponse(res);
      })();
      break;
    case "notion":
      (async () => {
        const operate: OperateType = request.operate;
        // @ts-ignore
        const res = await notionApi[operate](payload);
        sendResponse(res);
        console.log("file: background.js:154 ~ res:", res);
      })();
  }
  return true;
});

// const suggestEngines = [
//   {
//     engine: "google",
//     urlGenerator: (e) =>
//       `https: //www.google.com.hk/complete/search?q=${encodeURIComponent(
//         e
//       )}&cp=${
//         e.length
//       }&client=gws-wiz&xssi=t&hl=zh-CN&authuser=0&psi=3_JXYqyBBtWNseMP5aCJwAI.1649930975762&newwindow=1&dpr=${
//         window.devicePixelRatio
//       }`,
//   },
//   {
//     engine: "baidu",
//     urlGenerator: (e) =>
//       `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=35834,36175,31254,34813,36166,34584,36122,36193,36125,36236,26350,36093,36061&wd=${encodeURIComponent(
//         e
//       )}&req=2&csor=2&pwd=V&cb=jQuery110203344489856899435_1649933285302&_=1649933285304`,
//   },
//   {
//     engine: "toutiao",
//     urlGenerator: (e) =>
//       `https://www.toutiao.com/2/article/search_sug/?keyword=${encodeURIComponent(
//         e
//       )}&ps_type=sug&aid=4916&_signature=_02B4Z6wo00101hw9ziQAAIDD4nGyFwTurpocGcqAAOVmCeRI8QaIci5eEs5DpM40rzB0ITa-NyUF3K1aVgiLqJR-US2EAzoaX4F3HHk-nXlAX6teCV5neClbK0y0a2xLaYZMLX0cvBsPCw1z8c`,
//   },
//   {
//     engine: "npm",
//     urlGenerator: (e) =>
//       `https://www.npmjs.com/search/suggestions?q=${encodeURIComponent(e)}`,
//   },
//   {
//     engine: "bing",
//     urlGenerator: (e) =>
//       `https://www.bing.com/AS/Suggestions?pt=page.home&mkt=zh-sg&qry=${encodeURIComponent(
//         e
//       )}&asv=1&cp=${
//         e.length
//       }&msbqf=false&cvid=98AE84AE1065459594CBA79EB13A712B`,
//     headers: { "x-autosuggest-contentwidth": "596" },
//   },
//   {
//     engine: "gold",
//     urlGenerator: (e) => {
//       const t = `juejin.cn ${e}`;
//       return `https://www.bing.com/AS/Suggestions?pt=page.home&mkt=zh-sg&qry=${encodeURIComponent(
//         t
//       )}&asv=1&cp=${
//         t.length
//       }&msbqf=false&cvid=98AE84AE1065459594CBA79EB13A712B`;
//     },
//     headers: { "x-autosuggest-contentwidth": "596" },
//   },
//   {
//     engine: "github",
//     urlGenerator: (e) => {
//       const t = `github.com ${e}`;
//       return `https://www.bing.com/AS/Suggestions?pt=page.home&mkt=zh-sg&qry=${encodeURIComponent(
//         t
//       )}&asv=1&cp=${
//         t.length
//       }&msbqf=false&cvid=98AE84AE1065459594CBA79EB13A712B`;
//     },
//     headers: { "x-autosuggest-contentwidth": "596" },
//   },
//   {
//     engine: "stackoverflow",
//     urlGenerator: (e) => {
//       const t = `stackoverflow.com ${e}`;
//       return `https://www.bing.com/AS/Suggestions?pt=page.home&mkt=zh-sg&qry=${encodeURIComponent(
//         t
//       )}&asv=1&cp=${
//         t.length
//       }&msbqf=false&cvid=98AE84AE1065459594CBA79EB13A712B`;
//     },
//     headers: { "x-autosuggest-contentwidth": "596" },
//   },
// ];
