/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-08 03:07:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-12 17:41:57
 * @Description: 注入浏览器的方法，资源与插件内不共用，再次定义了MessageType枚举和appmsg
 */

export const appmsg = "mp.weixin.qq.com/cgi-bin/appmsg";

export enum MessageType {
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
export enum EMode {
  Preview = "preview",
  Edit = "edit",
}

const iframe = document.querySelector("iframe") as HTMLIFrameElement;

const rich = getRichMedia();
chrome.runtime.onMessage.addListener(({ type, data }) => {
  if (type === MessageType.SendMPEditorValue) {
    console.log("save======", data);
    rich.innerHTML = data.data;
    setTimeout(() => {
      const rect = rich.scrollHeight;
      rich.style.height = rect + "px";
      iframe.style.height = rect + "px";
    }, 0);
  } else if (type === MessageType.OriginEditorMode) {
    if (data == EMode.Edit) {
      rich.contentEditable = "true";
      rich.style.background = "#fff";
    } else {
      rich.contentEditable = "false";
      rich.style.background = "#d8d8d8bd";
    }
  } else if (type === MessageType.GetOriginEditorVal) {
    chrome.runtime.sendMessage({
      type: MessageType.GetOriginEditorVal,
      data: rich.innerHTML,
    });
  } else if (type === MessageType.Inactive) {
    rich.contentEditable = "true";
    rich.style.cursor = "text";
    rich.style.background = "#fff";
  }
});

function getRichMedia() {
  const rich = iframe?.contentDocument?.body as HTMLBodyElement;
  return rich;
}
