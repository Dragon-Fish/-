<?php

$wgServer = 'https://common.wjghj.cn';
$wgSitename = 'Wjghj Project Static Database';

$wgDBname = 'common_wiki';
$wgSharedDB = 'wjghj_wiki';

$wgSharedTables = ['actor', 'user', 'user_former_groups', 'user_groups'];

$wgLanguageCode = 'en';

$wgUploadPath = '/images/common';
$wgUploadDirectory = "$IP/images/common";
$wgCacheDirectory = '/tmp/mediawiki_common_cache';

$wgGroupPermissions['*']['createaccount'] = false;

$wgEnableUploads = true;
