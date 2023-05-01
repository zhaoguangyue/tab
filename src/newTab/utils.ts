import $ from 'jquery';
import { noop } from 'lodash-es';

/**
 * 向Chrome发送消息
 * @param message 消息
 */
export const isDev = process.env.NODE_ENV !== 'production';
export function sendChromeMessage(message: any) {
  if (isDev) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    // @ts-ignore
    chrome.runtime.sendMessage('hidpcnlgfkdiegpcihlfnbbmnokihpon', message, resolve);
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
