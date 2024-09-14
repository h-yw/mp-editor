/*
 * @Author: h-yw 1327603193@qq.com
 * @Date: 2024-09-13 21:52:37
 * @LastEditTime: 2024-09-14 11:05:51
 * @Github: https://github.com/h-yw
 * @Blog: https://hlovez.life
 * @Description:
 */
import type { UserConfig } from "@commitlint/types";
import { RuleConfigSeverity } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  formatter: "@commitlint/format",
  rules: {
    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      [
        "feat", // 新功能
        "fix", // 修复bug
        "docs", // 文档修改
        "style", // 样式修改
        "refactor", // 重构代码
        "perf", // 性能优化
        "test", // 测试
        "chore", // 构建过程或辅助工具的变动
        "revert", // 回滚
        "ci", // CI配置修改
        "wip", // 开发中
      ],
    ],
    "subject-case": [RuleConfigSeverity.Disabled],
  },
};
export default config;
