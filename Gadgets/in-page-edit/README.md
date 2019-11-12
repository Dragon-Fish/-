'''InPageEdit'''是由机智的小鱼君使用JavaScript编写的MediaWiki插件。具有较好的移动设备支持以及<s>毫无卵用的</s>五彩斑斓设计。

## 特色功能
### InPageEdit工具盒
[[File:InPageEdit toolbox.png|thumb|五彩斑斓のInPageEdit工具盒]]
* 在成功加载InPageEdit-v2后，屏幕的右下角应当出现如图所示的'''InPageEdit工具盒'''
* 插件的所有功能均可以在工具盒中找到

### 快速编辑
#### 编辑
<gallery>
InPageEdit_qedit.png|快速编辑
InPageEdit_qedit_preview.png|在InPageEdit中预览您的编辑
</gallery>
{{clear}}
* 点击工具箱中天蓝色的“<span class="material-icons">edit</span> 铅笔图标”，在不打开新标签页的情况下编辑页面
* 编辑器提供预览功能
* 也可以编辑页面的历史版本以便快速修复
* '''注意，您不应将本插件作为MediaWiki原生编辑页面的完全替代品，本插件与原生编辑页面相比少了很多实用的工具（模版使用分析、高级编辑工具条等等），而且稳定性一定低于原生编辑页面'''，本插件更适合进行修复页面内简单问题的小编辑
{{clear}}
#### 快速编辑段落
* 在段落编辑按钮后生成一个快速编辑按钮，让你快速编辑这个段落
#### 快速编辑其他页面
<gallery>
InPageEdit qedit navbar.png|可以通过Navbar快速修改Navbox模版而无需离开当前页面
</gallery>
{{clear}}
* 插件自动识别文章内的编辑链接，例如Navbox内的“查编论”快捷方式以及模版内的编辑链接，在其后生成一个快速编辑按钮，让你不需要打开新页面也能修改非当前页面的页面
{{clear}}

### 快速重定向
* 点击工具箱中黄橙色的“<span class="material-icons">flight_land</span> 飞机降落图标”，可以快速将某个页面重定向到本页面
* 点击工具箱中玫瑰色的“<span class="material-icons">flight_takeoff</span> 飞机起飞图标”，可以快速将本页面重定向到某个页面

### 快速重命名
* 暂未实装

### 快速删除页面
* 暂未实装

## 如何安装
### 个人使用
在您的个人js页(<code>User:你的用户名/common.js</code>)添加以下代码：
<pre>mw.loader.load('https://common.wjghj.cn/js/InPageEdit-v2');</pre>

'''注意'''：在保存之后，您可能需要清除浏览器缓存才能看到所作出的变更的影响。
* Firefox或Safari：按住Shift的同时单击刷新，或按Ctrl-F5或Ctrl-R（Mac为⌘-R）
* Google Chrome：按Ctrl-Shift-R（Mac为⌘-Shift-R）
* Internet Explorer：按住Ctrl的同时单击刷新，或按Ctrl-F5
* Opera：前往菜单 → 设置（Mac为Opera → Preferences），然后隐私和安全 → 清除浏览数据 → 缓存的图片和文件。

<div class="hide-for-guide">

### 尝试一下
想尝试一下本插件吗？

InPageEdit预设在本页面运行，尽管点击InPageEdit的相关按钮，进行尝试吧！不用担心破坏任何东西，你的编辑操作一定会失败，这是因为本wiki不允许匿名用户编辑。

点击这些链接右侧的“快速编辑”即可尝试快速编辑

* https://common.wjghj.cn/wiki/InPageEdit-v2?action=edit&section=9 ← 编辑本段落
* 不同形式的URL
** https://common.wjghj.cn/index.php?title=MediaWiki:Js-InPageEdit-v2.js&action=edit&oldid=287 ← 编辑某页面的历史版本
** https://common.wjghj.cn/wiki/InPageEdit-v2?action=edit ← 某些wiki会使用的短网址
** https://common.wjghj.cn/wiki/MediaWiki:Js-InPageEdit-v2.js?action=edit&oldid=287 ← 历史版本的短网址
* 这个链接不是本地wiki的
** https://minecraft-zh.gamepedia.com/Minecraft_Wiki?action=edit ← 不会加载快速编辑按钮
</div>

## 卸载插件
### 自动卸载
点击ipe工具盒中的红色齿轮，选择卸载，按照提示操作即可

### 手动删除个人js
删除您的个人js页(<code>User:你的用户名/common.js</code>)中的以下代码：
<pre>mw.loader.load('https://common.wjghj.cn/js/InPageEdit-v2');</pre>

'''注意'''：在保存之后，您可能需要清除浏览器缓存才能看到所作出的变更的影响。
* Firefox或Safari：按住Shift的同时单击刷新，或按Ctrl-F5或Ctrl-R（Mac为⌘-R）
* Google Chrome：按Ctrl-Shift-R（Mac为⌘-Shift-R）
* Internet Explorer：按住Ctrl的同时单击刷新，或按Ctrl-F5
* Opera：前往菜单 → 设置（Mac为Opera → Preferences），然后隐私和安全 → 清除浏览数据 → 缓存的图片和文件。

### 手动清理残余项
本插件安装时会保存cookie，它们会在一段时间后自动过期并自我删除，请打开您的浏览器控制台(F12) → 存储(Shift+F9)，找到cookie名<code>InPageEditPreference</code>以及<code>InPageEditVersion</code>，右键→删除本项目

## 技术细节
### 插件使用
* 使用jQuery
* 使用mediawiki.api
* 使用jQuery.cookie
* 模态框使用ssi-modal插件
* 使用超级无敌螺旋炫酷吊炸天AJAX异步加载法
### 样式设计
* 配色参考Fandom Design System
### 支持平台
* MediaWiki > 1.19.0
* <span style="color:red">由于ssi-modal的兼容性问题，暂不支持Fandom平台</span>
### 更新日志
: 详见 [[InPageEdit-v2/version-info]]
### 源代码
* JavaScript: [[MediaWiki:Js-InPageEdit-v2.js]]
* CSS: [[MediaWiki:Css-InPageEdit-v2.css]]

## 你知道吗
* 本插件最初是受到萌娘百科用户[https://zh.moegirl.org/User:%E5%A6%B9%E7%A9%BA%E9%85%B1 妹空酱]所编写的小编辑插件[https://zh.moegirl.org/User:%E5%A6%B9%E7%A9%BA%E9%85%B1/Wikiplus WikiPlus]的启发
** 由于WikiPlus对于移动设备糟糕的兼容性（在较小的手机上编辑框飞出屏幕）以及<s>难看的绿色配色</s>，加之其不支持Fandom/Wikia平台，机智的小鱼君决定自行编写一款小编辑插件
* 本插件的最初目的是填补WikiPlus不兼容Fandom平台的遗憾
** 遗憾而戏剧性的一幕是，本插件也不兼容Fandom😂
* 本插件的编辑框设计以及工具盒配色参考的是Fandom Design System

<div style="height:2.5em"></div>
----
<center>InPageEdit-v2 is a MediaWiki plugin based on JavaScript. And write by [https://wjghj.cn/wiki/机智的小鱼君 机智的小鱼君].</center>
<div style="height:12px"></div>
<center>© Original by Wjghj Project, [https://www.gnu.org/licenses/gpl-3.0-standalone.html GNU General Public License 3.0] (2019- )<br/>See more: [https://common.wjghj.cn/wiki/InPageEdit-v2 Plugin page] [https://common.wjghj.cn/wiki/InPageEdit-v2/version-info Version info] [https://blog.wjghj.cn/index.php/contact Contact author]</center>
