type Fn = (...args: unknown[]) => unknown;
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

const appmsg = "mp.weixin.qq.com/cgi-bin/appmsg";

enum MessageType {
  OpenSidePanel = "openSidePanel",
  OpenWelcomePage = "openWelcomePage",
  OpenContentPage = "openContentPage",
  OpenSettingPage = "openSettingPage",
  OpenAboutPage = "openAboutPage",
  OpenHelpPage = "openHelpPage",
  OpenDonatePage = "openDonatePage",
  OpenFeedbackPage = "openFeedbackPage",
  OpenBlogPage = "openBlogPage",
  BackgroundReady = "contentScriptReady",
  GetHTML = "getHTML",
  SendMPEditorValue = "sendMPEditorValue",
  OriginEditorMode = "originEditorMode",
  GetOriginEditorVal = "getOriginEditorVal",
}

export { eventMap, getActiveTab, isChromeExtension, appmsg, MessageType };
