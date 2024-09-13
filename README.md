
<h1 style="text-align:center">MP Editor</h1>
<div style="text-align:center">用Markdown编辑公众号文章</div>
<br/>
<img style="height:256;object-fit:contain" src="docs/mp_wd.png" />

<hr/>

## 源起

自己在编辑公众号文章的时候，感觉编辑文章的体验非常不友好。对于写技术文章来说，不追求花里胡哨的话，Markdown应该足够了。因此我希望能够在公众号文章编辑的时候，适使用Markdown进行编辑，于是就有了这个项目。

实际上，微信公众号的编辑是通过 `<body contenteditable="true"></body>` 实现的，因此只需向 `body` 中插入内容即可进行编辑。

实践中发现，官方会对使用的 **HTML 标签** 进行过滤，具体规则不太清楚。不过，经过测试，最终能够正常使用的是 `<section></section>` 标签，还有其他一些基本标签。在 Markdown 转 HTML时，只需将不支持的标签替换为 `section`即可。

另外，样式使用也是一个问题。因为不可能使用样式类，只能使用行内的样式。因此，在 Markdown 转 HTML 时，需要将一个样式主题抽取为行内样式。当然，这也限制了一部分能力。还是那句话，不追求花里胡哨的话足够了，哈哈哈哈哈哈😂

## 预览效果


## 构建

构建结果会生成在 `dist` 目录下。直接在chrome浏览器中加载dist目录即可使用。

```bash
yarn install

yarn build
```

:::tip 
项目是在yarn ^2 下的pnp模式构建的，低版本yarn会报错。
:::





yarn PnP模式报错
![alt text](docs/image.png)

解决
```yml:yarnrc.yml
enableGlobalCache: false 
```

找不到包类型报错
解决
yarn dlx @yarnpkg/sdks vscode

vite + react+tailwind 样式不生效
```ts:vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss"; //添加

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()], // 添加
    },
  },
});

```

报错：side-panel.html: Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
来源： 
```
  useEffect(() => {
    getActiveTab((tab) => {
      const t = tab as chrome.tabs.Tab;
      setTab(t);
      eventMap.sendTabMessage(t.id!, { type: "mode", data: mode }); //错误根源在这里
    });
  }, [mode]);
```

// "default-src 'self' 'wasm-unsafe-eval';script-src 'self'; object-src 'self';",



<!-- 例子 -->
# H1

## 上下标

上标：a^12^
下标：a~b~

## line through

~~MP Editor~~

## 表格

|   1   | 2     |     3 |
| :---: | :---- | ----: |
|  123  | 123   |   123 |
| 12233 | 12334 | 12345 |

## 容器

:::tip
这是个tip
:::

:::note
这是个note
:::

:::info
这是个info
:::

:::warning
这是个warning
:::

:::danger
这是个danger
:::

## 定义标签属性 attr

MP Editor<style="color:blue;font-weight:600">


## code

```js 
console.log("Hellor!")
console.log("this is MP Editor")
```
### code line highlight

```js {1,5}
console.log("Hellor!")
console.log("this is MP Editor")
console.log("Hellor!")
console.log("this is MP Editor")
console.log("Hellor!")
console.log("this is MP Editor")
```