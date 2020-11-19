$(function () {
  // Start
  new mw.Api()
    .get({
      action: 'query',
      meta: 'allmessages',
      ammessages: 'License-description|Copy-notify|Copy-notify/page/' + wgPageName,
      amlang: mw.config.get('wgUserLanguage') || mw.config.get('wgContentLanguage'),
    })
    .done(function (data) {
      // Variables
      var licenseDescriptionMsg = data.query.allmessages[0]['*'],
        customMsg = data.query.allmessages[1]['*'],
        customPageMsg = data.query.allmessages[2]['*'],
        defaultMsg =
          '你刚刚复制了<span style="font-weight:bold;">' +
          wgSiteName +
          '</span>上的内容！' +
          licenseDescriptionMsg +
          '<br/>转载时请注明出处：<span style="font-style:italic;font-weight:bold;">' +
          decodeURIComponent(location.href) +
          '</span>',
        finalMsg

      // Get custom messages
      if (customPageMsg !== undefined && customPageMsg !== '-' && customPageMsg !== '') {
        finalMsg = customPageMsg
          .replace(/\$sitename/gi, wgSiteName)
          .replace(/\$url/gi, decodeURIComponent(location.href))
          .replace(/\$license/gi, licenseDescriptionMsg)
      } else if (customMsg !== undefined && customMsg !== '-' && customMsg !== '') {
        finalMsg = customMsg
          .replace(/\$sitename/gi, wgSiteName)
          .replace(/\$url/gi, decodeURIComponent(location.href))
          .replace(/\$license/gi, licenseDescriptionMsg)
      } else {
        finalMsg = defaultMsg
      }
      var debugMsg = 'defaultMsg is:<br/>' + defaultMsg + '<hr/>customMsg is:<br/>' + customMsg + '<hr/>customPageMsg is:<br/>' + customPageMsg + '<hr/>finalMsg is:<br/>' + finalMsg

      // Output
      $(window).on('copy', function () {
        toastr['warning'](finalMsg, '')
      })
    })
  // End
})
