import {
  IDisposable,
  editor as MonacoEditor,
  Range,
} from "monaco-editor/esm/vs/editor/editor.api";
import { markdown } from "../markdown/markdown";
import { addTheme } from "../theme";
import { ELanguage, IOutput } from "../../types/mp";
import { createWorker } from "./worker";
import "./contrib";
type MonacoOptions = MonacoEditor.IStandaloneEditorConstructionOptions;

type EditorOptions = {
  container: HTMLElement;
  options?: MonacoOptions;
  mdOptions: { [key: string]: string };
};
enum EventType {
  onContentChange = "onContentChange",
}
type OutputFn = () => void;

class MPEditor {
  private _editor: MonacoEditor.IStandaloneCodeEditor;
  private _options;
  private _markdownIt;
  private _defaultOptions: MonacoOptions = {
    value: "", // 初始内容为空
    //   language: language, // 设置初始语言
    theme: "vs-dark",
    fontSize: 16,
    automaticLayout: true, // 自动调整大小
    minimap: {
      enabled: false,
    },
    autoClosingBrackets: "always",
    autoClosingComments: "always",
    autoClosingDelete: "always",
    autoClosingQuotes: "always",
    autoIndent: "brackets",
    autoClosingOvertype: "always",
    autoDetectHighContrast: true,
    autoSurround: "brackets",
    wordWrap: "on",
    wordWrapColumn: 30,
    quickSuggestions: true,
    pasteAs: {
      enabled: true,
      showPasteSelector: "afterPaste",
    },
    roundedSelection: true,
    formatOnType: true,
    formatOnPaste: true,
    placeholder: "在此处输入内容",
    contextmenu: false,
  };
  private _listenerDisposables: { [key: string]: IDisposable } = {};

  constructor(options: EditorOptions) {
    // this._container = options.container;
    this._options = options.options;
    this._markdownIt = markdown({});
    this._editor = this._init(options);
  }
  private _init(options: EditorOptions) {
    createWorker();
    options.options = {
      ...this._defaultOptions,
      ...options.options,
    };
    const editor = MonacoEditor.create(options.container, options.options);
    return editor;
  }
  get editor() {
    return this._editor;
  }
  get options() {
    return this._options;
  }
  update(options: MonacoEditor.IStandaloneEditorConstructionOptions) {
    console.log(
      "updateOptions====>",
      options,
      this._editor.getModel()?.getLanguageId()
    );

    this._options = options;
    // this._editor.updateOptions(options);
    MonacoEditor.setModelLanguage(this._editor.getModel()!, options.language!);

    console.log("updateOptions====>", this._editor.getModel()?.getLanguageId());
  }
  dispose() {
    this._editor?.dispose();
  }
  getValue(lang?: ELanguage) {
    if (lang === ELanguage.HTML) {
      return this.getValueAsHtml();
    }
    return this.getValueAsMarkdown();
  }
  getValueAsMarkdown(): IOutput {
    return {
      type: ELanguage.Markdown,
      data: this._editor?.getValue(),
    };
  }
  getValueAsHtml(): IOutput {
    let val = this._editor.getValue();
    val = `<section class="markdown-body">${this._markdownIt.render(
      val
    )}</section>`;
    val = addTheme(val);
    return {
      type: ELanguage.HTML,
      data: val,
    };
  }
  setValue(value: string) {
    this._editor?.setValue(value);
  }

  set onContentChange(callback: OutputFn) {
    this._listenerDisposables[EventType.onContentChange]?.dispose();
    this._listenerDisposables[EventType.onContentChange] =
      this._editor?.onDidChangeModelContent(() => {
        callback();
      });
    this._bindChangeListener();
  }
  // TODO: 预留
  private _bindChangeListener() {}

  insertImg(text: string, nameLength: number, isSvg: boolean) {
    const position = this._editor.getPosition();
    let selection = this._editor.getSelection();
    console.log("position", nameLength, isSvg);
    if (!position || !selection) {
      alert("请先将光标放在插入位置");
      return;
    }
    this._editor.executeEdits("insert_left", [
      {
        text: "![",
        range: new Range(
          selection.startLineNumber,
          selection.startColumn - nameLength,
          selection.startLineNumber,
          selection.startColumn - nameLength
        ),
      },
    ]);
    selection = this._editor.getSelection();
    // console.log("selection", selection);
    if (!selection) return alert("获取光标位置失败");
    this._editor.executeEdits("insert_right", [
      {
        text: "]",
        range: new Range(
          selection.endLineNumber,
          selection.endColumn,
          selection.endLineNumber,
          selection.endColumn
        ),
      },
    ]);
    selection = this._editor.getSelection();
    if (!selection) return alert("获取光标位置失败");
    this._editor.executeEdits("", [
      {
        text: `(${text})`,
        range: new Range(
          selection.endLineNumber + 1,
          selection.endColumn,
          selection.endLineNumber + 1,
          selection.endColumn
        ),
        forceMoveMarkers: true,
      },
    ]);
    // let { endLineNumber, endColumn } = this.editor.getSelection() || {};
    // this.editor.setPosition({
    //   lineNumber: endLineNumber || position.lineNumber,
    //   column: endColumn || position.column,
    // });
  }

  pasteText() {}
}
export default MPEditor;
