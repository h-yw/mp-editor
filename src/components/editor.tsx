/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-09 12:34:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-14 12:22:32
 * @Description:
 */
import { ChangeEvent, useEffect, useRef, useState } from "react";
import MPEditor from "@/feature/monaco/editor";

import { ELanguage, EMode, MessageType } from "../types/mp";
import Toolbar from "./toolbar";
import FileManager from "@feature/storage";
import { debounce, eventMap, getActiveTab, isChromeExtension } from "@/utils";

function Editor() {
  const [language, setLanguage] = useState(ELanguage.Markdown);
  const [mode, setMode] = useState<EMode>(EMode.Preview);
  const editorRef = useRef<MPEditor>();
  const [tab, setTab] = useState<chrome.tabs.Tab>();
  const onLang = (lang: ELanguage) => {
    setLanguage(lang);
    editorRef.current?.update({ language: lang });
  };
  const onMode = () => {
    setMode(() => {
      const newMode = mode === EMode.Preview ? EMode.Edit : EMode.Preview;
      if (tab?.id && isChromeExtension && eventMap) {
        eventMap.sendTabMessage(tab.id, {
          type: MessageType.OriginEditorMode,
          data: newMode,
        });
      }

      return newMode;
    });
  };
  const _onSave = async () => {
    FileManager.save({
      data: editorRef.current?.getValue(ELanguage.Markdown).data || "",
      language: ELanguage.Markdown,
    })
      .then(() => {
        FileManager.clearCache();
      })
      .catch((err) => {
        alert(`文件保存失败:\n${err}`);
      });
  };
  const _onOpenFile = (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    console.log("文件打开成功", ev);
    FileManager.open(file)
      .then((res) => {
        editorRef.current?.setValue(res);
        ev.target.value = "";
      })
      .catch((err) => {
        alert(`文件打开失败:\n${err}`);
      });
  };
  const handleContentChange = debounce(() => {
    if (tab?.id && isChromeExtension && eventMap) {
      eventMap.sendTabMessage(tab.id, {
        type: MessageType.SendMPEditorValue,
        data: editorRef.current?.getValueAsHtml(),
      });
      FileManager.setCache(editorRef.current?.getValueAsMarkdown());
    }
  }, 500);
  // 实时
  useEffect(() => {
    if (editorRef.current && tab) {
      editorRef.current.onContentChange = handleContentChange;
    }
  }, [editorRef, tab, language]);

  useEffect(() => {
    if (!isChromeExtension) return;
    const handler = ({ type }: { type: MessageType; data: string }) => {
      if (type === MessageType.GetOriginEditorVal) {
        // if (data) {
        //   editorRef.current?.setValue(data);
        // }
        // 不在从原编辑器获取内容，直接读缓存
        FileManager.getCache()
          .then((res) => {
            editorRef.current?.setValue(res?.data || "");
          })
          .catch((err) => {
            console.log("获取缓存失败", err);
          });
      }
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => {
      chrome.runtime.onMessage.removeListener(handler);
    };
  }, [editorRef]);

  // 初始化编辑器
  useEffect(() => {
    const el = document.getElementById("editor-container");
    if (el) {
      editorRef.current = new MPEditor({
        container: el,
        options: {
          language,
        },
        mdOptions: {},
      });
    }
  }, []);

  // 设置微信编辑器&获取窗口
  useEffect(() => {
    getActiveTab((tab) => {
      const t = tab as chrome.tabs.Tab;
      setTab(t);
      if (!t?.id || !isChromeExtension || !eventMap) return;
      eventMap
        .sendTabMessage(t.id, { type: MessageType.GetOriginEditorVal })
        .then(() => {
          eventMap!.sendTabMessage(t.id!, {
            type: MessageType.OriginEditorMode,
            data: EMode.Preview,
          });
        });
    });
  }, []);

  // 读取剪切板
  /*  useEffect(() => {
    const handlePaste = (ev: ClipboardEvent) => {
      const clipboardData = ev.clipboardData;
      if (!editorRef.current) {
        return;
      }
      if (clipboardData) {
        const items = clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          console.log("past", item);
          const matches = item.type.match(
            /^image\/(png|jpg|jpeg|gif|svg(\+xml)?)$/i
          );
          const isSvg = item.type.match(/^image\/svg(\+xml)?$/i);
          if (matches) {
            const blob = item.getAsFile();
            const render = new FileReader();
            render.onload = function () {
              const base64 = render.result as string;
              if (editorRef.current) {
                editorRef.current.insertImg(
                  base64,
                  blob?.name.length || 0,
                  !!isSvg
                );
              }
            };
            if (isSvg) {
              render.readAsText(blob!);
            } else {
              render.readAsDataURL(blob!);
            }
          } else {
            console.log("item====>", item);
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [editorRef.current]); */
  return (
    <div className="wrapper">
      <Toolbar
        language={language}
        mode={mode}
        onLang={onLang}
        onMode={onMode}
        onSave={_onSave}
        onOpenFile={_onOpenFile}
      />
      <div>
        <div
          className="editor min-w-[50vw] min-h-screen"
          id="editor-container"
        ></div>
      </div>
    </div>
  );
}
export default Editor;
