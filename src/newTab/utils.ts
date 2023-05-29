import browser from 'webextension-polyfill';

/**
 * 向Chrome发送消息
 * @param message 消息
 */
export const pluginId = 'hidpcnlgfkdiegpcihlfnbbmnokihpon';

export async function sendChromeMessage(message: any) {
  const response = await browser.runtime.sendMessage(pluginId, message);
  return response;
}

export const isToday = () => {
  const cacheToday = localStorage.getItem('today');
  const now = new Date();
  const today = `${now.getMonth()}-${now.getDate()}`;
  if (cacheToday !== today) {
    localStorage.setItem('today', today);
  }
  return cacheToday !== today;
};
