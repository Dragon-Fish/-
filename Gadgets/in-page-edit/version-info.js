function InPageEditVersionInfo(version) {
  mw.loader.using(['jquery.cookie'],
  function() {
    var IPEcurVersion = version;
    if ($.cookie('InPageEditVersion') === undefined || $.cookie('InPageEditVersion') != IPEcurVersion) {
      $.cookie('InPageEditVersion', IPEcurVersion, {
        expires: 60,
        path: '/'
      });
      ssi_modal.notify('', {
        title: 'InPageEdit加载成功',
        content: 'InPageEdit插件(版本 ' + IPEcurVersion + ')安装成功，<a href="javascript:void(0)" id="IPEshowVersionInfo">点击这里查看更新日志</a>。(在插件下一次更新前本消息将不会再显示)'
      });
      $('#IPEshowVersionInfo').click(IPEshowVersionInfo);
      function IPEshowVersionInfo() {
        ssi_modal.show({
          title: 'InPageEdit更新日志<span style="font-size:small">(您的版本: ' + IPEcurVersion + ')</span>',
          content: '<div id="IPEversionInfoPlaceholder">正在获取版本详情……</div><section style="display:none" id="IPEversionInfo"></section>'
        });
        $.ajax({
          url: 'https://common.wjghj.cn/api.php',
          dataType: 'jsonp',
          type: 'post',
          data: {
            page: 'MediaWiki:Js-InPageEdit-v2.js/version-info',
            action: 'parse',
            prop: 'text',
            format: 'json'
          },
          success: function(data) {
            var info = data.parse.text['*'];
            $('#IPEversionInfoPlaceholder').fadeOut(800);
            $('#IPEversionInfo').html(info).delay(1000).show(800);
          }
        });
      }
    }
  });
}
