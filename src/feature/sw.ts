/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-08 03:13:43
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-12 17:30:34
 * @Github: https://github.com/h-yw
 * @Blog: https://hlovez.life
 * @Description: 扩展的background script
 */
const appmsg = "mp.weixin.qq.com/cgi-bin/appmsg";
const activeIcon = {
  "16": chrome.runtime.getURL("images/mp_16x16.png"),
  "32": chrome.runtime.getURL("images/mp_32x32.png"),
  "48": chrome.runtime.getURL("images/mp_48x48.png"),
  "128": chrome.runtime.getURL("images/mp_128x128.png"),
};
const inactiveIcon = {
  "16": chrome.runtime.getURL("images/mp_gray_16.png"),
  "32": chrome.runtime.getURL("images/mp_gray_32.png"),
  "48": chrome.runtime.getURL("images/mp_gray_48.png"),
  "128": chrome.runtime.getURL("images/mp_gray_128.png"),
};
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
  SendMPEditorValue = "sendMPEditorValue",
  OriginEditorMode = "originEditorMode",
  GetOriginEditorVal = "getOriginEditorVal",
  Inactive = "inactive",
}

// 监听脚本准备完毕
// chrome.runtime.sendMessage({ type: MessageType.BackgroundReady });

chrome.runtime.onMessage.addListener(
  ({ type, tab }: { type: MessageType; tab: chrome.tabs.Tab }) => {
    console.log("background", type, tab);
    if (type === MessageType.OpenSidePanel) {
      chrome.sidePanel.open(
        {
          windowId: tab.windowId,
        },
        () => {}
      );
    }
  }
);

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("onActivated", activeInfo);
  chrome.tabs.get(activeInfo.tabId).then((tab) => {
    if (tab.id && tab.url) {
      checkUrlAndSet(tab.id, tab.url);
    }
  });
});

// 处理扩展启动时的初始图标设置
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id && tab.url) {
        checkUrlAndSet(tab.id, tab.url);
      }
    });
  });
});

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, __) => {
  if (changeInfo.url) {
    checkUrlAndSet(tabId, changeInfo.url);
  }
});

// 检查 URL 是否匹配某个模式
function checkUrlAndSet(tabId: number, url: string) {
  if (url.includes(appmsg)) {
    chrome.sidePanel.setOptions({
      enabled: true,
      tabId: tabId,
    });
    chrome.action.setIcon({
      path: activeIcon,
    });
  } else {
    chrome.sidePanel.setOptions({
      enabled: false,
      tabId: tabId,
    });
    chrome.action.setIcon({
      path: inactiveIcon,
    });
    chrome.tabs.sendMessage(tabId, { type: MessageType.Inactive });
  }
}
