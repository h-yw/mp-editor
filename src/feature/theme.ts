/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-10 13:10:19
 * @LastEditors: h-yw 1327603193@qq.com
 * @LastEditTime: 2024-09-12 13:34:31
 * @Github: https://github.com/h-yw
 * @Blog: https://hlovez.life
 * @Description: 众号不支持外联样式，替换为行内样式
 */

import juice from "juice";
import githubLightCss from "../theme/github-light.css?raw";

export const addTheme = (html: string, css?: string) => {
  const theme = css || githubLightCss;
  return juice.inlineContent(html, theme);
};
