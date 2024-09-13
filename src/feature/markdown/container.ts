/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-10 12:43:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-12 13:36:27
 * @Description: 主要逻辑是看了vitepress自定义容器的源码，做了公众号平台的适配
 */
import type MarkdownIt from "markdown-it";
import container from "markdown-it-container";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";

type ContainerArgs = [typeof container, string, { render: RenderRule }];

export interface ContainerOptions {
  infoLabel?: string;
  noteLabel?: string;
  tipLabel?: string;
  warningLabel?: string;
  dangerLabel?: string;
  detailsLabel?: string;
  importantLabel?: string;
  cautionLabel?: string;
}

export const containerPlugin = (
  md: MarkdownIt,
  containerOptions?: ContainerOptions
) => {
  md.use(...createContainer("tip", containerOptions?.tipLabel || "TIP", md))
    .use(...createContainer("info", containerOptions?.infoLabel || "INFO", md))
    .use(
      ...createContainer(
        "warning",
        containerOptions?.warningLabel || "WARNING",
        md
      )
    )
    .use(
      ...createContainer(
        "danger",
        containerOptions?.dangerLabel || "DANGER",
        md
      )
    )
    .use(
      ...createContainer(
        "important",
        containerOptions?.dangerLabel || "IMPORTANT",
        md
      )
    )
    .use(
      ...createContainer("note", containerOptions?.dangerLabel || "NOTE", md)
    );
  // 微信不支持detail标签
  // .use(
  //   ...createContainer(
  //     "details",
  //     containerOptions?.detailsLabel || "Details",
  //     md
  //   )
  // );
};
function createContainer(
  klass: string,
  defaultTitle: string,
  md: MarkdownIt
): ContainerArgs {
  return [
    container,
    klass,
    {
      render(tokens, idx, _options) {
        const token = tokens[idx];
        const info = token.info.trim().slice(klass.length).trim();
        const attrs = md.renderer.renderAttrs(token);
        if (token.nesting === 1) {
          const title = md.renderInline(info || defaultTitle);
          if (klass === "details")
            return `<details class="${klass} markdown-hint markdown-hint-${klass}"${attrs}><summary>${title}</summary>\n`;
          return `<section class="${klass}  markdown-hint markdown-hint-${klass}"${attrs}>
          <section  class="markdown-hint-title">
          ${iconMap[klass]}
            <p>${title}</p>
          </section> \n
       `;
        } else return klass === "details" ? `</details>\n` : `</section>\n`;
      },
    },
  ];
}

const iconMap: { [key: string]: string } = {
  tip: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='#009400' d='M7.941 18c-.297-1.273-1.637-2.314-2.187-3a8 8 0 1 1 12.49.002c-.55.685-1.888 1.726-2.185 2.998H7.94zM16 20v1a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1h8zm-3-9.995V6l-4.5 6.005H11v4l4.5-6H13z'/></svg>`,
  info: '<svg viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" fill="#4cb3d4"/></svg>',
  warning: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'><path d='M576.286 752.57v-95.425q0-7.031-4.771-11.802t-11.3-4.772h-96.43q-6.528 0-11.3 4.772t-4.77 11.802v95.424q0 7.031 4.77 11.803t11.3 4.77h96.43q6.528 0 11.3-4.77t4.77-11.803zm-1.005-187.836 9.04-230.524q0-6.027-5.022-9.543-6.529-5.524-12.053-5.524H456.754q-5.524 0-12.053 5.524-5.022 3.516-5.022 10.547l8.538 229.52q0 5.023 5.022 8.287t12.053 3.265h92.913q7.032 0 11.803-3.265t5.273-8.287zM568.25 95.65l385.714 707.142q17.578 31.641-1.004 63.282-8.538 14.564-23.354 23.102t-31.892 8.538H126.286q-17.076 0-31.892-8.538T71.04 866.074q-18.582-31.641-1.004-63.282L455.75 95.65q8.538-15.57 23.605-24.61T512 62t32.645 9.04 23.605 24.61z' fill='#e6a700'/></svg>`,
  danger:
    '<svg viewBox="0 0 24 24"><path d="M12 2c5.523 0 10 4.477 10 10v3.764a2 2 0 0 1-1.106 1.789L18 19v1a3 3 0 0 1-2.824 2.995L14.95 23a2.5 2.5 0 0 0 .044-.33L15 22.5V22a2 2 0 0 0-1.85-1.995L13 20h-2a2 2 0 0 0-1.995 1.85L9 22v.5c0 .171.017.339.05.5H9a3 3 0 0 1-3-3v-1l-2.894-1.447A2 2 0 0 1 2 15.763V12C2 6.477 6.477 2 12 2zm-4 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#e13238"/></svg>',
  details:
    '<svg viewBox="0 0 24 24"><path fill="rgb(0,0,0,0.5)" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>',
  detailDark:
    '<svg viewBox="0 0 24 24"><path fill="rgb(255,255,255,0.5)" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>',
  important:
    '<svg viewBox="0 0 1024 1024"><path d="M512 981.333a84.992 84.992 0 0 1-84.907-84.906h169.814A84.992 84.992 0 0 1 512 981.333zm384-128H128v-42.666l85.333-85.334v-256A298.325 298.325 0 0 1 448 177.92V128a64 64 0 0 1 128 0v49.92a298.325 298.325 0 0 1 234.667 291.413v256L896 810.667v42.666zm-426.667-256v85.334h85.334v-85.334h-85.334zm0-256V512h85.334V341.333h-85.334z" fill="#a371f7"/></svg>',
  note: '<svg viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" fill="#ccc"/></svg>',
};
