<?php
## 上传文件的配置
//允许通过URL上传
$wgGroupPermissions['autoconfirmed']['upload_by_url'] = true;
$wgAllowCopyUploads = true;
$wgCopyUploadsFromSpecialUpload = true;
//文件上传上限
$wgMaxUploadSize = [
  '*' => 1024 * 1024 * 20, // 20MB
  'url' => 1024 * 1024 * 20, // 20MB
];
//允许的文件格式
$wgFileExtensions = ['png', 'gif', 'jpg', 'jpeg', 'mp3', 'ogg'];
#允许iframe
$wgEditPageFrameOptions = false;
