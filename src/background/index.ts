import { todoApi, fastEntranceApi, type OperateType } from './notion';

const Engine = {
  Baidu: 'baidu',
  Google: 'google',
};

const SearchFunc = {
  [Engine.Baidu]: async (val: string) => {
    const response = await fetch(
      `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=36557,38408,38368,38399,37862,38173,38289,36803,37932,38314,38284,26350,37959,38422,37881&wd=${val}&req=2&csor=8&cb=cb`,
      {
        method: 'GET',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
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
        method: 'GET',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
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
    case 'search':
      (async () => {
        const res = await SearchFunc[engine](payload);
        console.log('file: index.ts:47 ~ res:', res);
        sendResponse(res);
      })();
      break;
    case 'notion':
      (async () => {
        const operate: OperateType = request.operate;
        // @ts-ignore
        const res = await todoApi[operate](payload);
        sendResponse(res);
      })();
    case 'fastEntrance':
      (async () => {
        const operate: OperateType = request.operate;
        // @ts-ignore
        const res = await fastEntranceApi[operate](payload);
        sendResponse(res);
      })();
  }
  return true;
});
