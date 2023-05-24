const Engine = {
  Baidu: 'baidu',
  Google: 'google',
};

export const SearchFunc = {
  [Engine.Baidu]: async (val: any) => {
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
  [Engine.Google]: async (val: any) => {
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
