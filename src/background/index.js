import dayjs from 'dayjs';
import browser from 'webextension-polyfill';
import { SearchFunc } from './search';

async function sendMessageToActiveTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  chrome.tabs.sendMessage(tab?.id, { messageType: 'remind', ...message });
}

const createAlarms = (reminds) => {
  reminds.forEach((item) => {
    if (item.type !== 'once') {
      const YMD = dayjs().format('YYYY-MM-DD');
      const HMS = dayjs(item.time).format('HH:mm:ss');
      const when = dayjs(`${YMD} ${HMS}`).valueOf();
      chrome.alarms.create(item.key, {
        when,
        periodInMinutes: item.interval * 60,
      });
    } else {
      chrome.alarms.create(item.key, {
        when: item.time,
      });
    }
  });
};

// 初始化提醒
const initAlarms = () => {
  chrome.alarms.clearAll();
  chrome.storage.sync.get(['remind']).then((res) => {
    createAlarms(res?.remind || []);
  });
};
initAlarms();
chrome.alarms.onAlarm.addListener(sendMessageToActiveTab);

// @ts-ignore
browser.runtime.onMessage.addListener(async (request) => {
  const { action, payload, engine } = request;
  if (action === 'search') {
    const res = await SearchFunc[engine](payload);
    return res;
  }
  if (action === 'refreshRemind') {
    initAlarms();
  }
  return null;
});
