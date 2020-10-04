<?php

## 这个文档保存用户组信息
## 它被include语句引用到LocalSettings.php中

#保护等级
$wgRestrictionLevels[] = 'wiki-official';
$wgNamespaceProtection[NS_HTML] = array('edit-html');

## 验证码
$wgGroupPermissions['*']['skipcaptcha'] = false;
$wgGroupPermissions['user']['skipcaptcha'] = false;
$wgGroupPermissions['autoconfirmed']['skipcaptcha'] = false;
$wgGroupPermissions['bot']['skipcaptcha'] = true; // registered bots
$wgGroupPermissions['sysop']['skipcaptcha'] = true;
$wgGroupPermissions['member']['skipcaptcha'] = true;

#未登入用户
$wgGroupPermissions['*']['edit'] = false;
$wgGroupPermissions['*']['upload'] = false;
$wgGroupPermissions['*']['move'] = false;

#登入用户
$wgGroupPermissions['user']['edit'] = true;
$wgGroupPermissions['user']['upload'] = false;
$wgGroupPermissions['user']['move'] = false;

#会员
$wgGroupPermissions['member']['upload'] = true;
$wgGroupPermissions['member']['mass-upload'] = true;
$wgGroupPermissions['member']['move'] = true; $wgGroupPermissions['master']['move'] = true;

#协管员
$wgGroupPermissions['master']['upload'] = true;
$wgGroupPermissions['master']['move'] = true;
$wgGroupPermissions['master']['delete'] = true;
$wgGroupPermissions['master']['undelete'] = true;
$wgGroupPermissions['master']['protect'] = true;
$wgGroupPermissions['master']['editprotected'] = true;
$wgAddGroups['master'] = array( 'member');
$wgRemoveGroups['master'] = array( 'member');

#站长
$wgGroupPermissions['siteadmin']['userrights'] = true;
$wgGroupPermissions['siteadmin']['maintenance'] = true;
$wgGroupPermissions['siteadmin']['wiki-official'] = true;
$wgGroupPermissions['siteadmin']['siteadmin'] = true;
$wgGroupPermissions['siteadmin']['edit-html'] = true;

#Staff
$wgGroupPermissions['staff']['lookupuser'] = true;
$wgGroupPermissions['staff']['wiki-staff'] = true;
$wgGroupPermissions['staff']['checkuser'] = true;
$wgGroupPermissions['staff']['checkuser-log'] = true;
$wgGroupPermissions['staff']['hideuser'] = true;
$wgGroupPermissions['staff']['suppressrevision'] = true;
$wgGroupPermissions['staff']['suppressionlog'] = true;
$wgGroupPermissions['staff']['deletelogentry'] = true;
$wgGroupPermissions['staff']['deleterevision'] = true;
$wgGroupPermissions['staff']['viewsuppressed'] = true;
$wgGroupPermissions['staff']['wiki-official'] = true;
$wgGroupPermissions['staff']['editinterface'] = true;
$wgGroupPermissions['staff']['editsitecss'] = true;
$wgGroupPermissions['staff']['editsitejson'] = true;
$wgGroupPermissions['staff']['editsitejs'] = true;
$wgGroupPermissions['staff']['editusercss'] = true;
$wgGroupPermissions['staff']['edituserjson'] = true;
$wgGroupPermissions['staff']['edituserjs'] = true;
$wgGroupPermissions['staff']['edit-html'] = true;


#安保机器人
$wgGroupPermissions['bot-global']['security-bot'] = true;
$wgRemoveGroups['bot-global'] =  array( 'siteadmin' );

#行政员
$wgGroupPermissions['bureaucrat']['userrights'] = false;
$wgAddGroups['bureaucrat'] = array(  'bot','sysop','widgeteditor','member','master','flow-bot');
$wgGroupsRemoveFromSelf['bureaucrat'] = array( 'bureaucrat' );
$wgRemoveGroups['bureaucrat'] = array(  'bot','sysop' ,'gadgeteditor','member','master','flow-bot' );

#管理员
$wgGroupPermissions['sysop']['upload'] = true;$wgGroupPermissions['sysop']['move'] = true;
$wgAddGroups['sysop'] = array(  'bot','gadgeteditor' , 'member' );
$wgGroupsRemoveFromSelf['sysop'] = array( 'sysop' );
$wgRemoveGroups['sysop'] = array('bot','gadgeteditor');
$wgGroupPermissions['sysop']['editusercss'] = false;
$wgGroupPermissions['sysop']['edituserjson'] = false;
$wgGroupPermissions['sysop']['edituserjs'] = false;

#界面管理员
$wgGroupPermissions['interface-admin']['edit-html'] = true;

#小部件编辑者
$wgGroupPermissions['gadgeteditor']['edit-html'] = true;
$wgGroupPermissions['gadgeteditor']['gadgets-edit'] = true;
$wgGroupPermissions['gadgeteditor']['gadgets-definition-edit'] = true;
$wgGropsRemoveFromSelf['gadgeteditor'] = array('gadgeteditor');