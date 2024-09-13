/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-07 23:26:57
 * @LastEditTime: 2024-09-12 19:07:12
 * @Github: https://github.com/h-yw
 * @Blog: https://hlovez.life
 * @Description: 负责多页面打包
 */

import { globSync } from "glob";
import path from "path";
import fs from "fs";
export const rootPath = path.resolve(process.cwd());
export const templatePath = path.join(rootPath, "index.html");
export const entriesPath = path.join(rootPath, "html");
export const featurePath = path.join(rootPath, "src/feature");
export const featureMap = getDirMap("src/feature/*.ts", ".ts");
const file = getTemplate();
export function createPages() {
  const entries = getDirMap("src/entries/*.tsx", ".tsx");
  const pageHTMLs: { [key: string]: string } = {};
  console.log("entries===", entries);
  for (const key in entries) {
    createHtml(key, {
      script: `<script type="module" src="${normalize(
        "../" + entries[key]
      )}"></script>`,
    });
    const html = globSync(`html/${key}.html`);
    if (html[0]) {
      pageHTMLs[key] = path.resolve(rootPath, updateExt(html[0]));
    }
  }
  return pageHTMLs;
}
function normalize(p: string) {
  console.log("p===", path.posix.normalize(p.replace(/\\/g, "/")));
  return p.replace(/\\/g, "/");
}

function updateExt(p: string) {
  // 解析路径
  const parsedPath = path.parse(p);

  // 修改扩展名
  parsedPath.ext = ".html";
  parsedPath.base = parsedPath.name + parsedPath.ext;

  // 重新生成路径
  return path.format(parsedPath);
}
function getTemplate() {
  // 读取文件
  const file = fs.readFileSync(templatePath, "utf-8");

  return file;
}
function createHtml(name: string, data: Record<string, string>) {
  const htmlPath = path.join(entriesPath, `${name}.html`);
  let html = file.replace(/<!--inject-->/g, data.script);
  fs.writeFileSync(htmlPath, html);
  return htmlPath;
}
// function getEntrys() {
//   const entries: Record<string, string> = {};
//   const modules = globSync("src/entries/*.tsx");
//   modules.forEach((module) => {
//     const modulePath = path.relative(rootPath, module);
//     console.log("modulePath===", modulePath);
//     const moduleName = path.basename(modulePath, ".tsx");
//     entries[moduleName] = module;
//   });
//   console.log("entries===", entries);
//   return entries;
// }
function getDirMap(pattern: string, ext?: string) {
  const dirMap: Record<string, string> = {};
  const modules = globSync(pattern);
  modules.forEach((module) => {
    const modulePath = path.relative(rootPath, module);
    const moduleName = path.basename(modulePath, ext);
    dirMap[moduleName] = module;
  });
  return dirMap;
}
