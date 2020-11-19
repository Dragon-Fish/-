$('#personal h2').prepend(function () {
  var avatar = '<img src="/extensions/Avatar/avatar.php?user=' + mw.config.get('wgUserName') + '" class="avatar"/>'
  if ($(window).width() > 851) {
    $(this).prepend('<a href="/index.php/Special:uploadavatar">' + avatar + '</a>')
  } else {
    $(this).prepend(avatar)
  }
})
$('.mw-userlink bdi').prepend(function () {
  var name = $(this).text()
  $(this).prepend('<img src="/extensions/Avatar/avatar.php?user=' + name + '" class="avatar"/>')
})
$('.ns-2 #firstHeading').prepend('<a href="/index.php/Special:uploadavatar"><img src="/extensions/Avatar/avatar.php?user=' + wgPageName + '" class="avatar"/></a>')
