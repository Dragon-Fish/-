<?php
# 这里是扩展列表
# 增加新扩展：wfLoadExtensions( '扩展名字' );
# 扩展名字与文件夹名字一致
wfLoadExtension( 'Avatar' );
wfLoadExtension( 'CategoryTree' );
wfLoadExtension( 'Cite' );
wfLoadExtension( 'CiteThisPage' );
wfLoadExtension( 'CharInsert' );
wfLoadExtension( 'CheckUser' );
wfLoadExtension( 'ConfirmEdit' );
wfLoadExtension( 'DeleteBatch' );
wfLoadExtension( 'Gadgets' );
wfLoadExtension( 'ImageMap' );
wfLoadExtension( 'InputBox' );
wfLoadExtension( 'Interwiki' );
wfLoadExtension( 'LocalisationUpdate' );
wfLoadExtension( 'MultiBoilerplate' );
wfLoadExtension( 'MultimediaViewer' );
wfLoadExtension( 'MultiUpload' );
wfLoadExtension( 'Nuke' );
wfLoadExtension( 'OATHAuth' );
wfLoadExtension( 'ParserFunctions' );
wfLoadExtension( 'PinyinSort' );$wgCategoryCollation = 'pinyin';//分类中页面按拼音排序
wfLoadExtension( 'Poem' );
wfLoadExtension( 'PortableInfobox' );
wfLoadExtension( 'Renameuser' );
wfLoadExtension( 'ReplaceText' );
wfLoadExtension( 'Scribunto' );$wgScribuntoDefaultEngine = 'luastandalone';//Lua支援组件
wfLoadExtension( 'Sm2Shim' );//flashmp3支援组件
wfLoadExtension( 'SpamBlacklist' );
wfLoadExtension( 'SyntaxHighlight_GeSHi' );
wfLoadExtension( 'TitleBlacklist' );
wfLoadExtension( 'Variables' );
require_once "$IP/extensions/Widgets/Widgets.php";
