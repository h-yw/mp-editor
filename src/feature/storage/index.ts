/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-10 21:36:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-12 18:32:48
 * @Description:
 */
import { ELanguage, IOutput } from "../../types/mp";

interface ISaveOptions {
  data: string;
  name?: string;
  language: ELanguage;
}
enum EFileType {
  Markdown = "md",
  HTML = "html",
  Text = "txt",
}
class FileManager {
  private static CACHE_KEY = "mp_editor_cache";
  static async open(file?: File) {
    if (!file) {
      alert("请选择文件");
      throw new Error("请选择文件");
    }
    const blob = new Blob([file], { type: file.type });
    try {
      const content = await blob.text();
      return content;
    } catch (err) {
      throw err;
    }
  }
  static async save(options?: ISaveOptions) {
    if (!options) {
      throw new Error("options is required");
    }
    const { data, name = "mp_editor", language } = options || {};
    console.log("save===>", options);
    const blob = new Blob([data], { type: `text/${language}` });
    const url = URL.createObjectURL(blob);
    const extname = name + "." + FileManager.ext(language);
    return chrome.downloads.download({
      url: url,
      filename: extname,
      saveAs: true,
    });
  }
  private static ext(language: ELanguage) {
    console.log("ext=======>", language === ELanguage.Markdown);
    if (language == ELanguage.Markdown) {
      return EFileType.Markdown;
    }
    if (language == ELanguage.HTML) return EFileType.HTML;
    return EFileType.Text;
  }

  static async setCache(data?: { type: ELanguage; data: string }) {
    if (!data) {
      throw Error("data is required");
    }
    return chrome.storage.local.set({
      [FileManager.CACHE_KEY]: data,
    });
  }
  static async getCache(): Promise<IOutput> {
    return chrome.storage.local
      .get([FileManager.CACHE_KEY])
      .then((res) => res?.[FileManager.CACHE_KEY]);
  }
  static async clearCache() {
    return chrome.storage.local.remove(FileManager.CACHE_KEY);
  }
}

export default FileManager;
