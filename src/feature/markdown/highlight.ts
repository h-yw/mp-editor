/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-10 12:47:11
 * @LastEditors: h-yw 1327603193@qq.com
 * @LastEditTime: 2024-09-12 13:30:03
 * @Description: 代码高亮
 */
import { fromHighlighter } from "@shikijs/markdown-it/core";
import type MarkdownIt from "markdown-it";
import { createHighlighterCore, type ShikiTransformer } from "shiki/core";
import {
  transformerMetaHighlight,
  transformerRemoveLineBreak,
} from "@shikijs/transformers";
import "shiki/onig.wasm?url";

interface HighlightOptions {
  transformers?: ShikiTransformer[];
}
export const highlightPlugin = async (
  md: MarkdownIt,
  options: HighlightOptions
) => {
  const highlighter = await createHighlighterCore({
    themes: [import("shiki/themes/vitesse-dark.mjs")],
    langs: [
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/html.mjs"),
      import("shiki/langs/go.mjs"),
      import("shiki/langs/yaml.mjs"),
      import("shiki/langs/json.mjs"),
    ],
    loadWasm: import("shiki/wasm"),
  });
  md.use(
    fromHighlighter(
      // @ts-ignore 忽略highlighter类型检查
      highlighter,
      {
        theme: "vitesse-dark",
        defaultLanguage: "typescript",
        fallbackLanguage: "typescript",
        transformers: [
          transformerMetaHighlight(),
          transformerRemoveLineBreak(),
          spanToSection(),
          replaceBlankToBr(),
          { ...(options.transformers || {}) },
        ],
      }
    )
  );
};

// 公众号编辑器保存时会把外层span移除，导致样式丢失
export const spanToSection = (): ShikiTransformer => {
  return {
    code(node) {
      node.children = node.children.map((item) => {
        if (item.type === "element" && item.tagName == "span") {
          item.tagName = "section";
        }
        return item;
      });
    },
    // pre(node) {
    //   node.children = node.children.map((item) => {
    //     if (item.type === "element" && item.tagName == "span") {
    //       item.tagName = "section";
    //     }
    //     return item;
    //   });
    // },
  };
};

// 换行符替换为br
export const replaceBlankToBr = (): ShikiTransformer => {
  return {
    code(node) {
      node.children = node.children.map((item) => {
        console.log("replaceBlankToBr====>", item);
        if (
          item.type === "element" &&
          item.tagName === "section" &&
          item.children.length == 0
        ) {
          item.children.push({
            type: "element",
            properties: {},
            tagName: "br",
            children: [],
          });
        }
        return item;
      });
    },
  };
};
