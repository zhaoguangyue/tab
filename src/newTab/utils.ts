import $ from 'jquery';
import { noop } from 'lodash-es';

/**
 * 向Chrome发送消息
 * @param message 消息
 */
export const isDev = process.env.NODE_ENV !== 'production';
export const pluginId = 'hidpcnlgfkdiegpcihlfnbbmnokihpon';

export function sendChromeMessage(message: any, resolveCb?: any, rejectCb?: any) {
  if (isDev) {
    return Promise.resolve();
  }
  return new Promise((resolve: any) => {
    // @ts-ignore
    chrome.runtime.sendMessage(pluginId, message, (val) => {
      resolve(val).then(resolveCb).catch(rejectCb);
    });
  });
}

export const jsonp = (url: string, success: any = noop, error: any = noop) => {
  $.ajax({
    url,
    dataType: 'jsonp',
    jsonpCallback: 'cb',
    success,
    error,
  });
};
