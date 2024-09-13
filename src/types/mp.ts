/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-10 22:02:38
 * @LastEditTime: 2024-09-13 15:24:47
 * @Github: https://github.com/h-yw
 * @Blog: https://hlovez.life
 * @Description:
 */
export enum ELanguage {
  Markdown = "markdown",
  HTML = "html",
}

export enum EMode {
  Preview = "preview",
  Edit = "edit",
}

export interface IOutput {
  type: ELanguage;
  data: string;
}

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
  GetHTML = "getHTML",
  SendMPEditorValue = "sendMPEditorValue",
  OriginEditorMode = "originEditorMode",
  GetOriginEditorVal = "getOriginEditorVal",
}
