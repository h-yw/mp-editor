type Fn = (...args: unknown[]) => unknown;
function debounce(fn: Function, delay: number) {
  let timer: number;
  let start = Date.now();
  return function (this: any, ...args: any[]) {
    const now = Date.now();
    clearTimeout(timer);
    const remaining = delay - (now - start);
    if (remaining <= 0) {
      fn.apply(this, args);
      start = now;
    } else {
      // @ts-ignore
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, remaining);
    }
  };
}

function getActiveTab(cb: Fn, filter?: (tab: chrome.tabs.Tab) => boolean) {
  if (!isChromeExtension) {
    return;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length == 0) return;
    if (filter) {
      for (const tab of tabs) {
        if (tab && filter(tab)) {
          cb(tab as unknown);
          return;
        }
      }
      return;
    }
    for (const tab of tabs) {
      if (tab) {
        cb(tab as unknown);
        return;
      }
    }
  });
}

const isChromeExtension = (() => {
  // 检查 `chrome.runtime` 对象是否存在
  return (
    typeof chrome !== "undefined" &&
    typeof chrome.runtime !== "undefined" &&
    typeof chrome.runtime.id !== "undefined"
  );
})();

const eventMap = isChromeExtension
  ? {
      addListener: chrome.runtime.onMessage.addListener.bind(
        chrome.runtime.onMessage
      ),
      removeListener: chrome.runtime.onMessage.removeListener.bind(
        chrome.runtime.onMessage
      ),
      sendMessage: chrome.runtime.sendMessage.bind(chrome.runtime),
      sendTabMessage: chrome.tabs.sendMessage.bind(chrome.tabs),
      onTabUpdated: chrome.tabs.onUpdated.addListener.bind(
        chrome.tabs.onUpdated
      ),
    }
  : null;
export { debounce, getActiveTab, eventMap, isChromeExtension };
