/** https://common.wjghj.cn/wiki/InPageEdit-v2/version-info **/
// InPageEditVersionInfo('x.x.xxx'); //在这里填写版本号
function InPageEditVersionInfo(version) {
  mw.loader.using(['jquery.cookie'],
  function() {
    var IPEcurVersion = version;
    if ($.cookie('InPageEditVersion') === undefined || $.cookie('InPageEditVersion') != IPEcurVersion) {
      ssi_modal.notify('', {
        title: 'InPageEdit加载成功',
        content: 'InPageEdit插件(版本 ' + IPEcurVersion + ')安装成功，感谢你的使用です~<br/>查看本次更新内容<button id="IPEshowVersionInfo">点击这里</button>',
        closeAfter: {
          time: 30,
          resetOnHover: true
        },
        onClose: function() {
          ssi_modal.notify('',{content:'在下一次插件更新前本弹窗将不再弹出，您随时可以查看<a href="https://common.wjghj.cn/wiki/InPageEdit-v2" target="_blank">InPageEdit插件说明</a>获取InPageEdit的最新功能以及即将支持的功能！如果您有任何意见或建议，欢迎<a href="https://blog.wjghj.cn/index.php/contact">联系作者</a>',coseAfter:{time: 10}});
          $.cookie('InPageEditVersion', IPEcurVersion, {
            expires: 60,
            path: '/'
          });
        }
      });
      // 授权协议更新提示
      ssi_modal.notify('info',{title:'InPageEdit授权协议更新',content:'感谢您使用本插件~在Ver.2.2.460更新中，我们同时更换了插件的授权协议为 <b>GNU通用公共许可3.0</b> ，这意味着您可以在许可范围内自由转载、改编、翻译本插件或者自定义插件的外观，具体的协议副本可以在 <a href="https://www.gnu.org/licenses/gpl-3.0-standalone.html" style="color:#38cffd;text-decoration:underline">https://www.gnu.org/licenses/gpl-3.0-standalone.html</a> 阅览。'});
      $('#IPEshowVersionInfo').click(IPEshowVersionInfo);
      function IPEshowVersionInfo() {
        ssi_modal.show({
          className: 'in-page-edit',
          title: 'InPageEdit更新日志<span style="font-size:small">(您的版本: ' + IPEcurVersion + ')</span>',
          content: '<div id="IPEversionInfoPlaceholder">正在获取版本详情……</div><section style="display:none" id="IPEversionInfo"></section>'
        });
        $.ajax({
          url: 'https://common.wjghj.cn/api.php',
          dataType: 'jsonp',
          type: 'post',
          data: {
            page: 'InPageEdit-v2/version-info',
            action: 'parse',
            prop: 'text',
            format: 'json'
          },
          success: function(data) {
            var info = data.parse.text['*'];
            $('#IPEversionInfoPlaceholder').fadeOut(800);
            $('#IPEversionInfo').html(info).delay(1000).show(800);
            $('#IPEversionInfo .mw-headline').each(function(){
              var $this = $(this),
                  newClass = $this.prop('id').replace(/\./g,'-');
              $this.addClass(newClass);
            });
            $('.mw-headline.'+IPEcurVersion.replace(/\./g,'-')).css({'background':'lightyellow','font-weight':'bold'}).prepend('★ ').append(' - current');
          }
        });
      }
    }
  });
}
