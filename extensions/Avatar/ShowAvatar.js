$('#personal h2').prepend('<a href="/index.php/Special:uploadavatar"><img src="/extensions/Avatar/avatar.php?user=' + mw.config.get('wgUserName') + '" class="avatar"/></a>');
$('.mw-userlink bdi,.ns-2 #firstHeading').prepend(function () {
  var name = $(this).text();
  $(this).prepend('<a href="/index.php/Special:uploadavatar"><img src="/extensions/Avatar/avatar.php?user=' + name+'" class="avatar"/></a>')
});
