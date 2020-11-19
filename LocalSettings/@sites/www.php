<?php

$wgServer = 'https://www.wjghj.cn';
$wgSitename = '小鱼君和他的朋友们';

$wgDBname = 'wjghj_wiki';

$wgLanguageCode = 'zh';

$wgUploadPath = '/images/www';
$wgUploadDirectory = $IP . '/images/www';
$wgCacheDirectory = '/tmp/mediawiki_www_cache';

# 共享文件
$wgEnableUploads = false;
// $wgSharedUpload = true;
// $wgSharedUploadDBname = 'common_wiki';
// $wgSharedUploadPath = '/images/common';
// $wgSharedUploadDirectory = '/images/common';
$wgForeignFileRepos[] = [
  'class' => 'ForeignDBRepo',
  'name' => 'otherwiki',
  'url' => 'https://common.wjghj.cn/images/common',
  'directory' => '../images/common',
  'hashLevels' => 2,
  'fetchDescription' => true,
  'dbType' => $wgDBtype,
  'dbServer' => $wgDBserver,
  'dbUser' => $wgDBuser,
  'dbPassword' => $wgDBpassword,
  'dbFlags' => DBO_DEFAULT,
  'dbName' => 'common_wiki',
  'tablePrefix' => '',
  'hasSharedCache' => false,
  'descBaseUrl' => 'https://common.wjghj.cn/wiki/File:',
  'fetchDescription' => true,
];
// $wgForeignFileRepos[] = [
//   'class' => 'ForeignAPIRepo',
//   'name' => 'commonwiki',
//   'apibase' => 'https://common.wjghj.cn/api.php',
//   'hashLevels' => 2,
//   'fetchDescription' => true
// ];

## 扩展
wfLoadExtension('FlowThread');
$wgFlowThreadConfig['Avatar'] = '/avatar/${username}';
enableSemantics('www.wjghj.cn');

## 名字空间
// 定义编号
define('NS_WEAPON', 3000);
define('NS_WEAPON_TALK', 3001);
define('NS_GAME', 3002);
define('NS_GAME_TALK', 3003);
define('NS_DAOJU', 3004);
define('NS_DAOJU_TALK', 3005);
define('NS_BLOG', 3006);
define('NS_BLOG_TALK', 3007);
// 定义名称
$wgExtraNamespaces[NS_WEAPON] = '武器';
$wgExtraNamespaces[NS_WEAPON_TALK] = '武器_talk';
$wgExtraNamespaces[NS_GAME] = 'Game';
$wgExtraNamespaces[NS_GAME_TALK] = 'Game_talk';
$wgExtraNamespaces[NS_DAOJU] = '道具';
$wgExtraNamespaces[NS_DAOJU_TALK] = '道具_talk';
$wgExtraNamespaces[NS_BLOG] = '博客';
$wgExtraNamespaces[NS_BLOG_TALK] = '博客评论';
$wgExtraNamespaces[NS_HTML] = 'Html';
$wgExtraNamespaces[NS_HTML_TALK] = 'Html_talk';
// 定义简称
$wgNamespaceAliases['Wq'] = NS_WEAPON;
$wgNamespaceAliases['Dj'] = NS_DAOJU;
// 开启子页面
$wgNamespacesWithSubpages[NS_WEAPON] = true;
$wgNamespacesWithSubpages[NS_WEAPON_TALK] = true;
$wgNamespacesWithSubpages[NS_GAME] = true;
$wgNamespacesWithSubpages[NS_GAME_TALK] = true;
$wgNamespacesWithSubpages[NS_BLOG] = true;
$wgNamespacesWithSubpages[NS_BLOG_TALK] = true;
