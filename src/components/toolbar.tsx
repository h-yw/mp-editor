/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-10 22:47:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-12 17:42:44
 * @Description:
 */
import { ChangeEvent } from "react";
import { ELanguage, EMode } from "../types/mp";
interface IProps {
  language: ELanguage;
  mode: EMode;
  onLang: (lang: ELanguage) => void;
  onMode: () => void;
  onSave: () => void;
  onOpenFile: (ev: ChangeEvent<HTMLInputElement>) => void;
}
function Toolbar(props: IProps) {
  const { language, mode, onLang, onMode, onSave, onOpenFile } = props || {};
  return (
    <div className="toolbar flex p-2 space-x-2">
      {/* 打开文件 */}
      <label
        title="打开文件"
        htmlFor="file"
        className="flex bg-[#07c160]  hover:bg-[#06aa55] items-center justify-center cursor-pointer text-white font-bold py-2 px-4 rounded-lg"
      >
        <span className="text-sm font-semibold">打开</span>
        <input
          id="file"
          accept=".md"
          type="file"
          className="hidden"
          onChange={onOpenFile}
        />
      </label>
      <button
        onClick={onSave}
        className="bg-[#07c160]  hover:bg-[#06aa55] text-sm font-semibold text-white py-2 px-4 rounded-lg"
      >
        保存
      </button>
      {/* 仅预览 */}
      <button
        onClick={onMode}
        title="针对原编辑器"
        className="bg-[#07c160]  hover:bg-[#06aa55] text-sm font-semibold text-white py-2 px-4 rounded-lg"
      >
        {mode === EMode.Preview ? "预览模式" : "编辑模式"}
      </button>
      <select
        onChange={(ev) => {
          onLang(ev.target.value as ELanguage);
        }}
        disabled
        value={language}
        className="bg-gray-50 border disabled:bg-gray-500 disabled:text-gray-100  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
      >
        <option value={ELanguage.Markdown}>Markdown</option>
        <option value={ELanguage.HTML}>HTML</option>
      </select>
    </div>
  );
}
export default Toolbar;
