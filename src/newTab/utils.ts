import { resolve } from 'path';
import $ from 'jquery';
import { noop } from 'lodash-es';
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

export const jsonp = (url: string, success: any = noop, error: any = noop) => {
  $.ajax({
    url,
    dataType: 'jsonp',
    jsonpCallback: 'cb',
    success,
    error,
  });
};
