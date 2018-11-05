##用户组
#未登入用户
$wgGroupPermissions['*']['edit'] = false;
$wgGroupPermissions['user']['edit'] = false;//不允许不在白名的用户编辑
#会员
$wgGroupPermissions['qq-member']['edit'] = true;
$wgGroupPermissions['qq-master']['edit'] = true;
$wgGroupPermissions['qq-master']['delete'] = true;
$wgGroupPermissions['qq-master']['undelete'] = true;
$wgAddGroups['qq-master'] = array( 'qq-member');
$wgRemoveGroups['qq-master'] = array( 'qq-member');
#站长
$wgAddGroups['siteadmin'] = array( 'bureaucrat' ,'sysop','bot','widgeteditor','oversight','qq-member','qq-master','checkuser');
$wgRemoveGroups['siteadmin'] = array( 'bureaucrat' ,'sysop','bot','widgeteditor','oversight','qq-member','qq-master','checkuser');
#行政员
$wgGroupPermissions['bureaucrat']['userrights'] = false;
$wgAddGroups['bureaucrat'] = array(  'bot','sysop','widgeteditor','qq-member','qq-master','siteadmin');
$wgGroupsRemoveFromSelf['bureaucrat'] = array( 'bureaucrat' );
$wgRemoveGroups['bureaucrat'] = array(  'bot','sysop' ,'widgeteditor','qq-member','qq-master');
#管理员
$wgGroupPermissions['sysop']['edit'] = true;
$wgAddGroups['sysop'] = array(  'bot','widgeteditor' );
$wgGroupsRemoveFromSelf['sysop'] = array( 'sysop' );
$wgRemoveGroups['sysop'] = array('bot','widgeteditor');
$wgGroupPermissions['sysop']['editusercss'] = false;
$wgGroupPermissions['sysop']['edituserjson'] = false;
$wgGroupPermissions['sysop']['edituserjs'] = false;
#监督员
$wgGroupPermissions['oversight']['hideuser'] = true;
$wgGroupPermissions['oversight']['suppressrevision'] = true;
$wgGroupPermissions['oversight']['suppressionlog'] = true;
$wgGroupPermissions['oversight']['deletelogentry'] = true;
$wgGroupPermissions['oversight']['deleterevision'] = true;
$wgGroupPermissions['oversight']['viewsuppressed'] = true;
$wgGroupsRemoveFromSelf['oversight'] = array( 'oversight' );
