import browser from 'webextension-polyfill';
import dayjs from 'dayjs';
/**
 * 向Chrome发送消息
 * @param message 消息
 */
export const pluginId = 'hidpcnlgfkdiegpcihlfnbbmnokihpon';

export async function sendChromeMessage(message: any) {
  const response = await browser.runtime.sendMessage(pluginId, message);
  return response;
}

let cacheNow = '';
export const isToday = (date: string) => {
  if (!cacheNow) {
    const now = dayjs().format('YYYY-MM-DD');
    cacheNow = now;
  }
  return cacheNow === date;
};
