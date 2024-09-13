/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-10 22:02:38
 * @LastEditTime: 2024-09-12 18:36:01
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
