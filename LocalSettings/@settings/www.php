<?php

$wgServer = "https://www.wjghj.cn";
$wgSitename = "小鱼君和他的朋友们";

$wgDBname = "wjghj_wiki";

$wgLanguageCode = "zh";

$wgUploadPath = "/images/www";
$wgUploadDirectory = "$IP/images/www";
$wgCacheDirectory = "/tmp/mediawiki_www_cache";

$wgEnableUploads = false;
// $wgSharedUpload = true;
// $wgSharedUploadDBname = "common_wiki";
// $wgSharedUploadPath = "/images/common";
// $wgSharedUploadDirectory = "/images/common";
$wgForeignFileRepos[] = [
  "class" => "ForeignDBRepo",
  "name" => "otherwiki",
  "url" => "https://common.wjghj.cn/images/common",
  "directory" => "/data/wwwroot/mediawiki/images/common",
  "hashLevels" => 2,
  "fetchDescription" => true,
  "dbType" => $wgDBtype,
  "dbServer" => $wgDBserver,
  "dbUser" => $wgDBuser,
  "dbPassword" => $wgDBpassword,
  "dbFlags" => DBO_DEFAULT,
  "dbName" => "common_wiki",
  "tablePrefix" => "",
  "hasSharedCache" => false,
  "descBaseUrl" => "https://common.wjghj.cn/wiki/File:",
  "fetchDescription" => true
];
// $wgForeignFileRepos[] = [
//   "class" => "ForeignAPIRepo",
//   "name" => "commonwiki",
//   "apibase" => "https://common.wjghj.cn/api.php",
//   "hashLevels" => 2,
//   "fetchDescription" => true
// ];
