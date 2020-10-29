# Gadget-Highlight

使用 highlight.js 为页面上的代码块提供语法高亮，类似 SyntaxHighlight 扩展功能。

## 用法

> 在 JavaScript、CSS 以及 Lua 页面，会自动运行。

- 使用`highlight`class 属性的`<pre>`标签包裹你想高亮的代码
- 添加`lang-<language>`的 class 属性来定义代码块的语言，例如`lang-js`
- 添加`linenum`的 class 属性，显示行号
  - `data-line-from` {Number} 设定起始行号，必须为正整数
  - `data-line-ping` {Number|String|Array} 设定高亮显示的行，接受的值：正整数、用`,`分隔的数字、数组
    - 例子：`data-line-ping="3"`、`data-line-ping="1, 2, 3"`、`data-line-ping="[1,2,3]"`

例子：

```html
<pre class="highlight lang-js">
console.log('hello, world')
</pre>

<pre class="highlight lang-js linenums">
// 显示行号
console.log('hello, world')
</pre>

<pre class="highlight lang-js" data-line-from="3">
// 行号会从 3 开始
console.log('hello, world')
</pre>

<pre class="highlight lang-js" data-line-ping="[2,4]">
// 第 2 以及第 4 行会高亮显示
console.log('hello, world')
// 不高亮
console.log('I\'m pinged!')
</pre>
```
