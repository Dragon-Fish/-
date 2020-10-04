<?php

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
