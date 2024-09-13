/// <reference types="vite/client" />

declare module "monaco-editor/esm/vs/base/browser/markdownRenderer" {
  export function renderMarkdown(options: { value: string }): {
    innerHTML: string;
  };
}

declare module "markdown-it-sub";

declare module "markdown-it-sup";

declare module "monaco-editor/esm/vs/editor/editor.main";
