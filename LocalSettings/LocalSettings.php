<?php

## 自定义名字空间
require_once('@config/Namespace.php');
## 扩展列表
require_once('@config/Extensions.php');
## 用户组
require_once('@config/UserRights.php');
## 自定义sidebar
// require_once '@config/Sidebar.php';

## 维基农场构架

# 维护使用
# 更新主站点: SITE=www php maintenance/update.php
if (!isset($_SERVER['SERVER_NAME']) && getenv('SITE') === 'www') {
    $_SERVER['SERVER_NAME'] = 'www.wjghj.cn';
} elseif (!isset($_SERVER['SERVER_NAME']) && getenv('SITE') === 'common') {
    $_SERVER['SERVER_NAME'] = 'common.wjghj.cn';
}

switch ($_SERVER['SERVER_NAME']) {
  case 'www.wjghj.cn':
    require_once('@settings/www.php');
    break;
  case 'common.wjghj.cn':
    require_once('@settings/common.php');
    break;
  default:
    header('HTTP/1.1 403 Forbidden');
    die('Not a valid site.');
    exit;
}

// require_once('@settings/www.php');
// require_once('@settings/common.php');
