<?php

// 定义编号
define("NS_HTML", 500);
define("NS_HTML_TALK", 501);

// 定义名称
$wgExtraNamespaces[ NS_HTML ] = "Html";
$wgExtraNamespaces[ NS_HTML_TALK ] = "Html_talk";

// 名字空间别名
$wgNamespaceAliases['T'] =  NS_TEMPLATE;

// 子页面
$wgNamespacesWithSubpages[ NS_MAIN ] = true;
$wgNamespacesWithSubpages[ NS_HTML ] = true;
$wgNamespacesWithSubpages[ NS_HTML_TALK ] = true;
