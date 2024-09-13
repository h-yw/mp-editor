/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-08 02:58:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-12 18:19:26
 * @Description:
 */
import Editor from "@components/editor";
import "../../style/index.css";
function SidePanel() {
  return (
    <div className="h-full min-w-[50%] bg-gray-800 text-white">
      <Editor />
    </div>
  );
}

export default SidePanel;
