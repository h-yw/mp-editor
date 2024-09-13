/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-08 00:53:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-12 19:12:12
 * @Description:
 */
import { useEffect, useState } from "react";
import { eventMap, getActiveTab, MessageType, appmsg } from "@config/event";
import githubSvg from "@assets/github-mark-white.svg";
import "../../style/index.css";
function Welcome() {
  const [canUse, setCanUse] = useState(false);
  const [tab, setTab] = useState<chrome.tabs.Tab>();
  function onClick() {
    if (canUse && tab && eventMap) {
      eventMap
        .sendMessage({
          type: MessageType.OpenSidePanel,
          tab,
        })
        .then(() => {
          window.close();
        });
    }
  }
  useEffect(() => {
    getActiveTab(
      (tab) => {
        const t = tab as chrome.tabs.Tab;
        setCanUse(true);
        setTab(t);
      },
      (tab) => {
        const t = tab as chrome.tabs.Tab;
        return t.url?.includes(appmsg) ?? false;
      }
    );
    return () => {
      window.close();
    };
  }, []);
  return (
    <div className="text-center text-white w-[300px] p-4  bg-gray-800 shadow-lg">
      <h1 className="text-lg font-bold  ">公众号编辑器</h1>
      <button
        className={
          "mt-2 px-4 py-2 text-sm bg-[#07c160]  font-bold text-white rounded-md shadow-lg hover:bg-[#06aa55]" +
          (canUse
            ? ""
            : "disabled:bg-gray-500 disabled:text-gray-300  disabled:cursor-not-allowed")
        }
        disabled={!canUse}
        onClick={() => {
          onClick();
        }}
      >
        打开编辑器
      </button>
      <div className="mt-4">
        <div className="inline-flex flex-col justify-center">
          <div className="text-left">
            <span>作者：</span>
            <a
              href="https://hlovez.life/about"
              target="_blank"
              className="text-blue-500"
            >
              h-yw
            </a>
          </div>
          <div className="text-left">
            <img className="w-6 h-6 inline-block mr-2" src={githubSvg} />
            <a
              href="https://github.com/h-yw/mp-editor"
              target="_blank"
              className="text-blue-500"
            >
              hlovez/mp-editor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
