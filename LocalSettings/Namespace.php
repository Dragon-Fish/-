<?php

//新建参数
define( "NS_WEAPON", 3000 ); // 这必须是偶数。
define( "NS_WEAPON_TALK", 3001 ); // 这必须是下一个奇整数。
define( "NS_GAME", 3002 ); // 这必须是偶数。
define( "NS_GAME_TALK", 3003 ); // 这必须是下一个奇整数。
define( "NS_DAOJU", 3004 ); // 这必须是偶数。
define( "NS_DAOJU_TALK", 3005 ); // 这必须是下一个奇整数。
define( "NS_BLOG", 3006 ); // 这必须是偶数。
define( "NS_BLOG_TALK", 3007 ); // 这必须是下一个奇整数。


// 添加命名
$wgExtraNamespaces =
    array( NS_WEAPON => "武器",
        NS_WEAPON_TALK => "武器_talk",
        NS_GAME => "Game",
        NS_GAME_TALK => "Game_talk",
        NS_DAOJU => "道具",
        NS_DAOJU_TALK => "道具_talk",
        NS_BLOG => "博客",
        NS_BLOG_TALK => "博客评论",
    );

//别名
$wgNamespaceAliases = array(
    'Wq' => NS_WEAPON,
    'Dj' => NS_DAOJU,
    'T' => NS_TEMPLATE
);

//允许子页面
$wgNamespacesWithSubpages[ NS_MAIN ] = true;
$wgNamespacesWithSubpages[ NS_WEAPON ] = true;
$wgNamespacesWithSubpages[ NS_WEAPON_TALK ] = true;
$wgNamespacesWithSubpages[ NS_GAME ] = true;
$wgNamespacesWithSubpages[ NS_GAME_TALK ] = true;
$wgNamespacesWithSubpages[ NS_BLOG ] = true;
$wgNamespacesWithSubpages[ NS_BLOG_TALK ] = true;
