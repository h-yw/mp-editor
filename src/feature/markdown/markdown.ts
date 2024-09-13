/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-10 13:04:12
 * @LastEditTime: 2024-09-12 13:35:06
 * @Github: https://github.com/h-yw
 * @Blog: https://hlovez.life
 * @Description:
 */
import Markdownit, { type Options } from "markdown-it";
import markdownitAttrs from "markdown-it-attrs";
import { containerPlugin } from "./container";
import { highlightPlugin } from "./highlight";
import { full as emoji } from "markdown-it-emoji";
import markdownItSub from "markdown-it-sub";
import markdownItSup from "markdown-it-sup";

interface MarkdownItOptions extends Options {}
export const markdown = (options: MarkdownItOptions) => {
  let markdownIt = new Markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    ...(options || {}),
  });

  markdownIt
    .use(markdownitAttrs, { leftDelimiter: "[", rightDelimiter: "]" })
    .use(containerPlugin, {})
    .use(emoji)
    .use(markdownItSub)
    .use(markdownItSup);
  highlightPlugin(markdownIt, {});
  return markdownIt;
};
