import type { UserConfig } from "@commitlint/types";
import "@commitlint/config-conventional";
const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  formatter: "@commitlint/format",
};
export default config;
