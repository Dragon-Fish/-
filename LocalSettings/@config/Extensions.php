<?php

# 这里是扩展列表
# 增加新扩展：wfLoadExtensions( '扩展名字' );
# 扩展名字与文件夹名字一致

wfLoadExtension('Avatar'); $wgDefaultAvatar = "/images/avatars/avatar_default.png";
wfLoadExtension('CategoryTree');
wfLoadExtension('CharInsert');
wfLoadExtension('Cite');
wfLoadExtension('CiteThisPage');
wfLoadExtension('CodeEditor');
wfLoadExtension('ConfirmEdit');
wfLoadExtension('Echo');
// wfLoadExtension('FlowThread'); $wgFlowThreadConfig['Avatar'] = '/avatar/${username}';
wfLoadExtension('Gadgets');
wfLoadExtension('ImageMap');
wfLoadExtension('InputBox');
wfLoadExtension('Interwiki');
wfLoadExtension('LocalisationUpdate');
wfLoadExtension('MultimediaViewer');
wfLoadExtension('MsUpload');
require_once($IP.'/extensions/NamespaceHTML/NamespaceHTML.php'); $wgRawHtmlNamespaces = array( NS_HTML );
wfLoadExtension('Nuke');
wfLoadExtension('OATHAuth');
wfLoadExtension('PageImages');
wfLoadExtension('ParserFunctions');
wfLoadExtension('PdfHandler');
wfLoadExtension('Poem');
wfLoadExtension('PortableInfobox');
wfLoadExtension('Renameuser');
wfLoadExtension('ReplaceText');
wfLoadExtension('Scribunto');
wfLoadExtension('SecureLinkFixer');
wfLoadExtension('SpamBlacklist');
// wfLoadExtension('SyntaxHighlight_GeSHi');
wfLoadExtension('TemplateData');
wfLoadExtension('TextExtracts');
wfLoadExtension('TitleBlacklist');
// wfLoadExtension('VisualEditor'); wfLoadExtension('Parsoid', "$IP/vendor/wikimedia/parsoid/extension.json");
wfLoadExtension('WikiEditor');

## 结构式讨论
# wfLoadExtension('Flow');
# 启用的名字空间
# $wgNamespaceContentModels[ NS_TALK ] = 'flow-board';
# $wgNamespaceContentModels[ NS_USER_TALK ] = 'flow-board';
# $wgNamespaceContentModels[ NS_PROJECT_TALK ] = 'flow-board';

## Central Auth
// wfLoadExtension('CentralAuth');
$wgCentralAuthDatabase = "centralauth";
$wgCentralAuthAutoMigrate = true;
// $wgCentralAuthAutoMigrateNoneGlobalAccounts = true;
$wgCentralAuthLoginWiki = "wjghj_wiki";
