/**
 * 向Chrome发送消息
 * @param message 消息
 */
export const isDev = process.env.NODE_ENV !== "production";
export function sendChromeMessage(message: any) {
  if (isDev) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    // @ts-ignore
    chrome.runtime.sendMessage(message, resolve);
  });
}
