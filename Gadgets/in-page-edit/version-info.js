/** https://common.wjghj.cn/wiki/InPageEdit-v2/version-info **/
if (InPageEdit === undefined) var InPageEdit = {};
// 在这里填写版本号
InPageEdit.version = '2.6.2(build_1432)';
// 在这里填写通知
InPageEdit.specialNotice = {status:false,id:'test',title:'Notify test',content:'This is a test message.',type:''};

/** 显示版本信息模块 **/
InPageEdit.versionInfo = function () {
  var curVersion = InPageEdit.version;
  ssi_modal.show({
    className: 'in-page-edit version-info',
    title: 'InPageEdit更新日志 - <span id="yourVersion">加载中……</span>',
    content: '<div id="IPEversionInfoPlaceholder" class="ipe-progress"><div class="progress-bar"></div></div><section style="display:none" id="IPEversionInfo"></section>',
    fitScreen: true,
    fixedHeight: true,
    buttons: [{
      label: '关闭',
      className: 'btn btn-danger',
      method: function(a,modal){
        modal.close();
      }
    },{
      label: '查看插件页面',
      className: 'btn btn-secondary',
      method: function(){
        location.href = 'https://common.wjghj.cn/wiki/InPageEdit-v2';
      }
    },{
      label: '查看更新日志',
      className: 'btn btn-secondary',
      method: function(){
        location.href = 'https://common.wjghj.cn/wiki/InPageEdit-v2/version-info';
      }
    }]
  });
  $.ajax({
    url: 'https://common.wjghj.cn/api.php',
    dataType: 'jsonp',
    type: 'get',
    data: {
      page: 'InPageEdit-v2/version-info',
      action: 'parse',
      prop: 'text',
      format: 'json'
    },
    success: function (data) {
      var info = data.parse.text['*'];
      $('#IPEversionInfoPlaceholder').addClass('done').delay(800).fadeOut(200);
      $('#IPEversionInfo').html(info);
      $('#yourVersion').html('您的版本: [' + localStorage.InPageEditVersion + ']');
      $('#IPEversionInfo .mw-headline').each(function () {
        var $this = $(this),
          text = $this.text();
        if (text === curVersion) {
          $this.html('<em class="curVersion" style="background: lightyellow; font-weight: bold">★CURRENT - ' + $this.text() + '</em>');
        }
      });
      setTimeout('$("#IPEversionInfo").fadeIn(800)',1000);
    }
  });
}

/** 初始化 **/
$(function () {
  var version = InPageEdit.version;
  if (localStorage.InPageEditVersion === null || localStorage.InPageEditVersion !== version) {
    ssi_modal.notify('', {
      title: 'InPageEdit加载成功',
      content: 'InPageEdit插件(版本 ' + version + ')安装成功，感谢你的使用です~',
      className: 'in-page-edit',
      buttons: [{
        className: 'btn btn-primary',
        label: '查看更新日志',
        method: function (a, modal) {
          localStorage.InPageEditVersion = version;
          InPageEdit.versionInfo();
          modal.close();
        }
      }
      ],
      closeAfter: {
        time: 30,
        resetOnHover: true
      },
      onClose: function () {
        ssi_modal.notify('', {
          className: 'in-page-edit',
          content: '在下一次插件更新前本弹窗将不再弹出，您随时可以查看<a href="https://common.wjghj.cn/wiki/InPageEdit-v2" target="_blank">InPageEdit插件说明</a>获取InPageEdit的最新功能以及即将支持的功能！如果您有任何意见或建议，欢迎<a href="https://blog.wjghj.cn/index.php/contact">联系作者</a>',
          closeAfter: {
            time: 10
          }
        });
        localStorage.InPageEditVersion = version;
      }
    });
  }
  if (InPageEdit.specialNotice.status === true && localStorage.InPageEditNoticeId !== InPageEdit.specialNotice.id) {
    ssi_modal.notify(InPageEdit.specialNotice.type,{
      className: 'in-page-edit ipe-special-notice',
      title: InPageEdit.specialNotice.title,
      content: InPageEdit.specialNotice.content,
      closeAfter: {time:999},
      buttons:[{
        label: '不再提示',
        className: 'btn btn-primary',
        method: function(a,modal) {
          localStorage.InPageEditNoticeId = InPageEdit.specialNotice.id;
          modal.close();
        }
      }]
    });
  }
});
