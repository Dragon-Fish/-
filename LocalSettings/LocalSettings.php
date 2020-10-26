<?php

##############
#  放在开头  #
#############

# 重定向 wjghj.cn → www.wjghj.cn
if (isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] === 'wjghj.cn') {
    header('HTTP/1.1 301 Moved Permanently');
    header('Location: https://www.wjghj.cn' . $_SERVER['REQUEST_URI']);
    die('Redirect...');
    exit;
}

# siteId
$siteId = '';

if (!isset($_SERVER['SERVER_NAME']) && getopt('', ['site:'])) {
    # 更新站点CLI: php maintenance/update.php --site=(www|common)
    switch (getopt('', ['site:'])['site']) {
        case 'www':
            $siteId = 'www';
            break;
        case 'common':
            $siteId = 'common';
            break;
    }
} elseif (isset($_SERVER['SERVER_NAME'])) {
    switch ($_SERVER['SERVER_NAME']) {
        case 'www.wjghj.cn':
            $siteId = 'www';
            break;
        case 'common.wjghj.cn':
            $siteId = 'common';
            break;
        default:
            $siteId = false;
            exit;
    }
}

##############
#  放在末尾  #
#############

## 自定义名字空间
require_once('@config/Namespace.php');
## 扩展列表
require_once('@config/Extensions.php');
## 用户组
require_once('@config/UserRights.php');
## 自定义sidebar
// require_once '@config/Sidebar.php';

## 维基农场构架

switch ($siteId) {
    case 'www':
        require_once('@sites/www.php');
        break;
    case 'common':
        require_once('@sites/common.php');
        break;
    default:
        header('HTTP/1.1 403 Forbidden');
        die('Not a valid site.');
        exit;
}
