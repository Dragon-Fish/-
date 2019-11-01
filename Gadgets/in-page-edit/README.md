'''InPageEdit'''是由机智的小鱼君使用JavaScript编写的MediaWiki插件。

## 特色功能
### InPageEdit工具盒
[{{filepath:InPageEdit toolbox.png}} <img src="{{filepath:InPageEdit toolbox.png|550px}}" style="width:350px"/>]
{{clear}}
* 在成功加载InPageEdit-v2后，屏幕的右下角应当出现如图所示的'''InPageEdit工具盒'''
* 插件的所有功能均可以在工具盒中找到

### 快速编辑
#### 编辑
[{{filepath:InPageEdit_qedit.png}} <img src="{{filepath:InPageEdit_qedit.png|800px}}" style="width:35%;margin-right:80px"/>]
[{{filepath:InPageEdit_qedit_preview.png}} <img src="{{filepath:InPageEdit_qedit_preview.png|800px}}" style="width:35%;"/>]
{{clear}}
* 点击工具箱中天蓝色的“<span class="material-icons">edit</span> 铅笔图标”，在不打开新标签页的情况下编辑页面
* 编辑器提供预览功能
* 也可以编辑页面的历史版本以便快速修复
* '''注意，您不应将本插件作为MediaWiki原生编辑页面的完全替代品，本插件与原生编辑页面相比少了很多实用的工具（模版使用分析、高级编辑工具条等等），而且稳定性一定低于原生编辑页面'''，本插件更适合进行修复页面内简单问题的小编辑
{{clear}}
#### 快速编辑段落
* 在段落编辑按钮后生成一个快速编辑按钮，让你快速编辑这个段落
#### 快速编辑其他页面
[{{filepath:InPageEdit qedit navbar.png}} <img src="{{filepath:InPageEdit qedit navbar.png|800px}}" style="width:35%;"/>]
{{clear}}
* 插件自动识别文章内的编辑链接，例如Navbox内的“查编论”快捷方式以及模版内的编辑链接，在其后生成一个快速编辑按钮，让你不需要打开新页面也能修改非当前页面的页面
{{clear}}

### 快速重定向
* 点击工具箱中黄橙色的“<span class="material-icons">flight_land</span> 飞机降落图标”，可以快速将某个页面重定向到本页面
* 点击工具箱中玫瑰色的“<span class="material-icons">flight_takeoff</span> 飞机起飞图标”，可以快速将本页面重定向到某个页面

### 快速重命名
* 暂未实装

## 如何安装
### 个人使用
在您的个人js页(<code>User:你的用户名/common.js</code>)添加以下代码：
<pre>mw.loader.load('https://common.wjghj.cn/js/InPageEdit-v2');</pre>
——完成，刷新页面缓存，插件应当已经被成功加载
### 尝试一下
想尝试一下本插件吗？

在这里尝试： https://common.wjghj.cn/wiki/InPageEdit-v2
## 技术细节
### 插件使用
* 使用jQuery
* 使用mediawiki.api
* 使用jQuery.cookie
* 模态框使用ssi-modal插件
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
