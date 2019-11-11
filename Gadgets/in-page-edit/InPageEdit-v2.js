/**
 *『Wjghj Project Static』
 * This _JavaScript_ code is from https://common.wjghj.cn
 * GNU GENERAL PUBLIC LICENSE 3.0
 *
 * MediaWiki JS Plugin: In Page Edit
 * Version: See version-info file
 * Author: 机智的小鱼君
 * Url:
 ** https://github.com/Dragon-Fish/wjghj-wiki/edit/master/Gadgets/in-page-edit
 ** https://common.wjghj.cn/wiki/MediaWiki:Js-InPageEdit-v2.js
 * Logs:
 ** https://github.com/Dragon-Fish/wjghj-wiki/blob/master/Gadgets/in-page-edit/version-info.md
 ** https://common.wjghj.cn/wiki/InPageEdit-v2/version-info
 **/
/** 导入模态框插件 **/
mw.loader.load('https://cdn.bootcss.com/ssi-modal/1.0.27/js/ssi-modal.min.js');
mw.loader.load('https://cdn.bootcss.com/ssi-modal/1.0.27/styles/ssi-modal.min.css', 'text/css');

/** 获取版本信息 **/
mw.loader.load('https://common.wjghj.cn/js/InPageEdit-v2.js/version-info');

/** 样式表 **/
// Local CSS
mw.loader.load('https://common.wjghj.cn/css/InPageEdit-v2', 'text/css');
// Material icons
mw.loader.load('https://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.min.css', 'text/css');

/** InPageEdit主框架 **/
var InPageEdit = {};
InPageEdit.edit = function (option) {

  // 变量
  if (option === undefined)
    option = {};
  var editPage = decodeURIComponent(option.page),
  editSection = option.section,
  titleSection = '',
  editReversion = option.reversion,
  titleReversion = '',
  editText,
  editSummary = JSON.parse($.cookie('InPageEditPreference')).editSummary,
  editMinor = JSON.parse($.cookie('InPageEditPreference')).editMinor,
  editNotice = '',
  jsonGet = {
    action: 'parse',
    page: editPage,
    prop: 'wikitext',
    format: 'json'
  },
  jsonPost = {},
  timestamp = new Date().getTime();

  if (editPage === undefined)
    return;
  if (editReversion !== undefined && editReversion !== '' && editReversion !== mw.config.get('wgCurRevisionId')) {
    ssi_modal.notify('warning', {
      content: '您正在编辑页面的历史版本。',
      title: '提示'
    });
    delete jsonGet.page;
    jsonGet.oldid = editReversion;
    titleReversion = '<span style="font-size:small;">(历史版本：' + editReversion + ')</span>'
  } else {
    if (editSection !== undefined && editSection !== '' && editSection !== null) {
      jsonGet.section = editSection;
      titleSection = '(第' + editSection + '部分)';
    }
  }

  // Debug
  console.time('[InPageEdit] Get page content');
  console.info('%c[InPageEdit] Edit function running with params: ','color:purple');
  console.table({
    'editPage': editPage,
    'editSection': editSection,
    'titleSection': titleSection,
    'editReversion': editReversion,
    'titleReversion': titleReversion,
    'editSummary': editSummary,
    'editMinor': editMinor
  });
  // 绑定事件，在尝试离开页面时提示
  $(window).bind('beforeunload', function () {
    return '您输入的内容尚未保存，确定离开此页面吗？';
  });

  // 显示主窗口
  ssi_modal.show({
    title: '正在编辑：<u class="editPage">' + editPage + '</u>' + titleSection + titleReversion,
    content: '<textarea class="editArea" disabled="">正在加载……</textarea><label>摘要：<input class="editSummary" placeholder="Edit via InPageEdit~"/></label><br/><label><input class="editMinor" type="checkbox" style=""/>小编辑</label>',
    keepContent: false,
    className: 'in-page-edit ipe-editor timestamp-' + timestamp,
    beforeClose: function (modal) {
      ssi_modal.confirm({
        className: 'in-page-edit confirmbox',
        position: 'top center',
        content: '确定要关闭窗口吗？<br/>此处的编辑将会丢失！',
        okBtn: {
          className: 'btn btn-danger',
          label: '确定'
        },
        cancelBtn: {
          className: 'btn btn-secondary',
          label: '取消'
        }
      },
        function (result) {
        if (result === true) {
          $(window).unbind('beforeunload');
          modal.options.keepContent = false;
          modal.options.beforeClose = '';
          modal.close();
          ssi_modal.notify('error', {
            position: 'right top',
            title: '取消',
            content: "编辑被取消"
          })
        }
      });
      return false;
    },
    buttons: [{
        label: '预览',
        className: 'btn btn-secondary',
        method: function () {
          var text = $('.editArea').val();
          requestPreview(text)
        }
      }, {
        label: '发布',
        className: 'btn btn-primary',
        method: function () {
          ssi_modal.confirm({
            className: 'in-page-edit confirmbox',
            content: '是否发布',
            okBtn: {
              className: 'btn btn-primary',
              label: '确定'
            },
            cancelBtn: {
              className: 'btn btn-secondary',
              label: '取消'
            },
          },
            function (result) {
            if (result) {
              var text = $('.ipe-editor.timestamp-' + timestamp + ' .editArea').val(),
              minor = $('.ipe-editor.timestamp-' + timestamp + ' .editMinor').prop('checked'),
              section = option.section,
              summary = $('.ipe-editor.timestamp-' + timestamp + ' .editSummary').val();
              postArticle({
                text: text,
                page: editPage,
                minor: minor,
                section: section,
                summary: summary
              });
            }
          })
        }
      }
    ]
  });
  // 获取页面代码
  new mw.Api().get(jsonGet).then(function (data) {
  	console.timeEnd('[InPageEdit] Get page content');
    if (data.error === undefined) {
      editText = data.parse.wikitext['*']
    } else {
      console.timeEnd('[InPageEdit] Get page content');
      editText = '<!-- 警告：无法获取页面内容 -->';
      console.error('[InPageEdit]警告：无法获取页面内容');
    }
    $('.editArea').val(editText).attr('disabled', false);
  }).fail(function (data) {
  	console.timeEnd('[InPageEdit] Get page content');
    editText = '<!-- 警告：无法获取页面内容 -->';
    console.error('[InPageEdit]警告：无法获取页面内容');
    $('.editArea').val(editText).attr('disabled', false);
  });
  // 获取编辑提示
  new mw.Api().get({
    action: 'query',
    meta: 'allmessages',
    ammessages: 'Editnotice-' + mw.config.get('wgNamespaceNumber'),
    amlang: mw.config.get('wgUserLanguage') || mw.config.get('wgContentLanguage')
  }).then(function (data) {
    editNotice = data.query.allmessages[0]['*'];
    new mw.Api().post({
      action: 'parse',
      preview: true,
      text: editNotice
    }).then(function (data) {
      editNotice = '<div class="edit-notice" style="display:none">' + data.parse.text['*'] + '</div>'
        $('.ipe-editor.timestamp-' + timestamp + ' .editArea').before(editNotice);
      $('.ipe-editor.timestamp-' + timestamp + ' .edit-notice').show(400);
    });
  });
  // 设定状态
  if (editMinor)
    $('.ipe-editor.timestamp-' + timestamp + ' .editMinor').attr('checked', 'checked');
  $('.ipe-editor.timestamp-' + timestamp + ' .editSummary').val(editSummary.replace(/\$section/ig, $($.parseHTML(titleSection)).text()).replace(/\$oldid/ig, $($.parseHTML(titleReversion)).text()));

  // 预览模块
  function requestPreview(text) {
    var timestamp2 = new Date().getTime();
    console.time('[InPageEdit] Request preview');
    ssi_modal.show({
      className: 'in-page-edit previewbox',
      content: '<section id="InPageEditPreview" data-timestamp="' + timestamp2 + '">正在读取预览……</section>',
      title: '预览'
    });
    new mw.Api().post({
      action: "parse",
      text: text,
      prop: "text",
      preview: true,
      format: "json"
    }).then(function (data) {
      console.timeEnd('[InPageEdit] Request preview');
      var content = data.parse.text['*'];
      $('#InPageEditPreview[data-timestamp="' + timestamp2 + '"]').html(content);
    }).fail(function(){
      console.timeEnd('[InPageEdit] Request preview');
      console.warn('[InPageEdit] 预览失败');
      $('#InPageEditPreview[data-timestamp="' + timestamp2 + '"]').html('获取预览时发生错误！');
    });
  }

  // 发布编辑模块
  function postArticle(pValue) {
    jsonPost = {
      action: "edit",
      text: pValue.text,
      title: pValue.page,
      token: mw.user.tokens.get('editToken'),
      minor: pValue.minor,
      summary: pValue.summary,
      errorformat: 'plaintext'
    }
    if (pValue.section !== undefined && pValue.section !== '' && pValue.section !== null) {
      jsonPost.section = pValue.section;
    }
    // Debug
    console.info('[InPageEdit] Submitting with params: ');
    console.table(pValue);
    new mw.Api().post(jsonPost).then(function (data) {
      $(window).unbind('beforeunload');
      ssi_modal.notify('success', {
        position: 'right top',
        title: '成功',
        content: '成功，正在刷新页面。'
      });
      if (pValue.page === mw.config.get('wgPageName')) {
        window.location = mw.config.get('wgArticlePath').replace('$1',pValue.page);
      } else {
        window.location.reload();
      }
    }).fail(function (errorCode, feedback, errorThrown) {
      ssi_modal.notify('error', {
        position: 'right top',
        title: '警告',
        content: '发布编辑时发生错误：<br/><span style="font-size:amall">' + errorThrown.errors[0]['*'] + '(' + errorThrown.errors[0]['code'] + ')</span>'
      });
      console.error('[InPageEdit] Submit failed: \nStatus: '+feedback+'\nCode: ' + errorThrown.errors[0]['code'] + '\nDescription: ' + errorThrown.errors[0]['*']);
    });
  }

}

/** 快速重定向模块 **/
InPageEdit.redirect = function (type) {
  var json = {
    action: 'edit',
    minor: JSON.parse($.cookie('InPageEditPreference')).editMinor,
    token: mw.user.tokens.get('editToken'),
    errorformat: 'plaintext'
  },
  summary = '快速重定向 → [[:$1]] //使用API进行的操作，请核查本次编辑',
  text = '#REDIRECT [[:$1]]',
  question,
  target;
  switch (type) {
  case 'to':
    json.title = mw.config.get('wgPageName');
    question = '您要将 <b>' + mw.config.get('wgPageName') + '</b> 重定向到哪个页面？';
    break;
  case 'from':
    question = '您要将哪个页面重定向到 <b>' + mw.config.get('wgPageName') + '</b>？';
    json.text = text.replace('$1', mw.config.get('wgPageName'));
    json.summary = summary.replace('$1', mw.config.get('wgPageName'));
    break;
  }
  ssi_modal.show({
    className: 'in-page-edit quick-redirect confirmbox',
    sizeClass: 'dialog',
    title: '快速重定向',
    content: question + '<br><input id="redirect-page" style="width:80%;margin: 0 10%;" onclick="$(this).css(\'box-shadow\',\'\')"/>',
    buttons: [{
        label: '确定',
        className: 'btn btn-primary',
        method: function () {
          var input = $('#redirect-page').val();
          if (input === '' || input === mw.config.get('wgPageName')) {
            $('#redirect-page').css('box-shadow', '0 0 4px red');
          } else {
            switch (type) {
            case 'to':
              json.summary = summary.replace('$1', input);
              json.text = text.replace('$1', input);
              break;
            case 'from':
              json.title = input;
              break;
            }

            new mw.Api().post(json).done(function () {
              ssi_modal.notify('success', {
                content: '已创建重定向！<br/>正在刷新页面……',
                title: '成功'
              });
              window.location.reload();
            });
          }
        }
      }
    ]
  });
}

/** 删除页面模块 **/
InPageEdit.deletepage = function () {
  if(!hasRight('delete')) {
    ssi_modal.dialog({
      title: '权限不足',
      content: '抱歉，您没有删除页面(<code>delete</code>)的权限。',
      className: 'in-page-edit quick-deletepage confirmbox',
      okBtn: {
        className:'btn btn-primary'
      }
    });
    return;
  }
  var page = mw.config.get('wgPageName'),
      reasonType,
      reason = '不再需要的页面';

  ssi_modal.show({
    className: 'in-page-edit quick-delete confirmbox',
    sizeClass: 'dialog',
    title: '删除页面',
    content: '<b style="color:#b00">本功能暂未实装</b><section id="InPageEditDeletepage">您要将 <b>' + page + '</b> 删除的理由？<br/><select id="reasonType" style="width: 23%;padding: 2px;margin: 2px;"><option value="其他">其他</option></select><input id="reason" style="width: 73%;padding: 2px;margin: 2px;" value="'+reason+'"><br/><label id="confirm"><input type="checkbox"/>确定删除</label></section>'
  });
}

/** 重命名模块 **/
InPageEdit.renamepage = function () {
  if(!hasRight('move')) {
    ssi_modal.dialog({
      title: '权限不足',
      content: '抱歉，您没有移动页面(<code>move</code>)的权限。',
      className: 'in-page-edit quick-renamepage confirmbox',
      okBtn: {
        className:'btn btn-primary'
      }
    });
    return;
  }
  var from = mw.config.get('wgPageName'),
      to,
      reason = '重命名页面 → [[:$1]] //使用API进行的操作，请核查本次编辑',
      movetalk,
      movesubpages,
      noredirect,
      ignorewarnings;

  ssi_modal.show({
    className: 'in-page-edit quick-rename confirmbox',
    sizeClass: 'dialog',
    title: '重命名页面',
    content: '<b style="color:#b00">本功能暂未实装</b><section id="InPageEditRename"><label id="moveTo">您要将 <b>' + from + '</b> 重命名为？<br/><input style="width:90%"></label><br/><label id="movetalk"><input type="checkbox" checked="checked"/>同时移动讨论页（若存在）</label><br/><label id="movesubpages"><input type="checkbox" checked="checked"/>同时移动子页面（若存在）</label><br/><label id="noredirect"><input type="checkbox"/>不在本页面创建到新页面的重定向</label><br/><label id="ignorewarnings"><input type="checkbox"/>忽视所有警告</label><br/><label id="reason">编辑摘要(<code>$1</code>将替换为新页面名)<br/><input style="width:90%" value="'+reason+'"/></label></section>'
  });
}

/** 个人设置模块 **/
InPageEdit.preference = function () {
  mw.loader.using('jquery.cookie', function () {
    var status;
    if (typeof(MyInPageEditPreference) === 'object') {
      if (typeof(MyInPageEditPreference.editMinor) === 'boolean' && typeof(MyInPageEditPreference.editSummary) === 'string') {
        status = '<center style="font-weight:bold;color:green">设定参数检测：暂定正常</center>';
      } else {
        status = '<center style="font-weight:bold;color:red">设定参数检测：包含错误</center>';
      }
      ssi_modal.dialog({
        content: '您使用自己的个人js保存了设定参数，请浏览<a href="'+mw.config.get('wgArticlePath').replace('$1','Special:Mypage/common.js')+'">您的个人js页</a>修改。<br>我们不推荐保存静态的设定，虽然这样做免去了更换设备时需要重新进行设置的麻烦，但因为暂时没有参数纠错功能，您必须自行确认json设定是否正确。<br>'+status,
        className: 'in-page-edit confirmbox',
        okBtn: {className:'btn btn-primary'}
      });
      return;
    }
    var settings = JSON.parse($.cookie('InPageEditPreference')),
    minor = settings.editMinor,
    summary = settings.editSummary;

    ssi_modal.show({
      title: 'InPageEdit偏好设定',
      content: '<section id="InPageEditSettingBox"><b>小编辑</b><br><label><input id="ipeSetMinor" type="checkbox"/> 默认标记所有编辑为小编辑</label><br><b>摘要</b><br><label>默认编辑摘要(<code>$section</code>将被替换为“第x部分”；<code>$oldid</code>将替换为“历史版本：版本号”)<input id="ipeSetSummary" value="' + summary + '" style="width:100%"/></label><br><b>卸载InPageEdit-v2</b><br><button class="btn btn-danger" id="ipeUninstall">卸载InPageEdit</button><hr><span style="font-size:10px;line-height:5px">您可以在这里保存InPageEdit-v2的个人偏好。<br><b>注意</b>：这些设置保存在您的浏览器本地，这意味着你必须在不同的设备上分别保存设置。<a href="javascript:;" id="ipeSaveLocalShow">永久保存</a>(不推荐)</span></section>',
      sizeClass: 'dialog',
      className: 'in-page-edit',
      buttons: [
        {
          label: '重置',
          className: 'btn btn-danger',
          method: function () {
            $('#InPageEditSettingBox #ipeSetMinor').prop('checked', false);
            $('#InPageEditSettingBox #ipeSetSummary').val('[InPageEdit] 没有编辑摘要 $section$oldid');
          }
        },{
          label: '保存',
          className: 'btn btn-primary',
          method: function (a, modal) {
            $.cookie('InPageEditPreference', JSON.stringify({
                editMinor: $('#InPageEditSettingBox #ipeSetMinor').prop('checked'),
                editSummary: $('#InPageEditSettingBox #ipeSetSummary').val()
              }), {
              expires: 60,
              path: '/'
            });
            console.info('[InPageEdit] Preference saved\neditMinor: ' + $('#InPageEditSettingBox #ipeSetMinor').prop('checked') + '\neditSummary:' + $('#InPageEditSettingBox #ipeSetSummary').val());
            modal.close();
          }
        }
      ]
    });
    if (minor === true)
      $('#InPageEditSettingBox #ipeSetMinor').attr('checked', 'checked');
    $('#ipeSaveLocalShow').click(function(){
      ssi_modal.dialog({
        className: 'in-page-edit confirmbox',
        content: '<section id="ipeSaveLocal"><b>不推荐这种做法</b><br>在您个人js页调用本插件的代码的上方添加以下代码：<br><input style="width:100%" readonly="readonly" onclick="$(this).select()"/><br/>注意：虽然这样做免去了更换设备时需要重新进行设置的麻烦，但我们没有参数纠错功能，您必须自行确认json设定是否正确。</section>',
        okBtn: {className:'btn btn-primary'}
      });
      $('#ipeSaveLocal input').val('var MyInPageEditPreference = '+JSON.stringify({editMinor: $('#InPageEditSettingBox #ipeSetMinor').prop('checked'),editSummary: $('#InPageEditSettingBox #ipeSetSummary').val()})+';');
    });
    $('#ipeUninstall').click(function(){
      ssi_modal.show({
        className: 'in-page-edit',
        sizeClass: 'dialog',
        title: '卸载InPageEdit-v2',
        content: '插件目前处于不断开发的阶段，可能没有达到您的预期，肥肠抱歉！由衷希望您可以等待插件继续被开发、完善，并希望您可以为我提供宝贵的建议！<br>插件在安装时会同时保存一些cookie，如果您使用的是手机那么将非常难以删除，因此我提供了这个可以清理残余项的卸载功能。<br><span style="font-size:small"><b>注意</b>：本功能尚处于测试阶段，使用正则表达式简单粗暴地从您的个人js页识别并删除插件相关的代码，有可能会卸载失败，建议按照插件说明页手动删除插件。</span>',
        buttons: [{
          label: '废话少说，残忍卸载',
          className: 'btn btn-danger',
          enableAfter: 5,
          method: function (){
            mw.loader.load('https://common.wjghj.cn/js/InPageEdit-v2.js/uninstall');
          }
          },{
          label: '算了，我暂时不卸载了',
          className: 'btn btn-primary',
          method: function (event,modal){
            modal.close();
          } 	
        }]
      });
    });
      $('#ipeSaveLocal input').val('var MyInPageEditPreference = '+JSON.stringify({editMinor: $('#InPageEditSettingBox #ipeSetMinor').prop('checked'),editSummary: $('#InPageEditSettingBox #ipeSetSummary').val()})+';');
  });
}

/** 快速页面差异模块 **/
InPageEdit.viewDiff = function () {
  // 加载样式表
  mw.loader.load(mw.config.get('wgScriptPath')+'/load.php?modules=mediawiki.legacy.shared|mediawiki.diff.styles&only=styles','text/css')
  $('.mw-changeslist-groupdiff, .mw-changeslist-diff, .mw-changeslist-diff-cur, .mw-history-histlinks a').click(function(e){
    e.preventDefault();
    var $this = $(this),
        href = $this.attr('href'),
        diff = mw.util.getParamValue('diff',href),
        curid = mw.util.getParamValue('curid',href),
        oldid = mw.util.getParamValue('oldid',href),
        pagename = mw.util.getParamValue('title',href);
    ssi_modal.show({
      sizeClass: 'large',
      className: 'in-page-edit',
      fixedHeight: true,
      fitScreen: true,
      title: '比较差异：<u>'+pagename+'</u>',
      content: '<section id="ipe-diff-table" style="text-align:center;height:400px;font-size:30px;line-height:400px">不要着急，龟速加载中~</section>',
      buttons: [{
        className: 'btn btn-secondary',
        label: '转到原始比较页面',
        method: function(){
          location.href = href
        }
      }]
    });
    $.ajax({
      url: href,
      data: {action:'render'},
      success: function(data){
        $('#ipe-diff-table').attr('style','').html(data);
        InPageEdit.articleLink($('#ipe-diff-table .mw-diff-edit a'));
      }
    });
  });
}

/** 获取段落编辑以及编辑链接 **/
InPageEdit.articleLink = function (element) {
  if (element === undefined) element = $('#mw-content-text a:not(.new)');
  element.each(function (i) {
    if ($(this).attr('href') === undefined)
      return;
    var url = $(this).attr('href'),
    title = mw.util.getParamValue('title', url),
    section = mw.util.getParamValue('section', url),
    reversion = mw.util.getParamValue('oldid', url);

    // 不是本地编辑链接
    if (url.split('/')['2'] !== location.href.split('/')['2'] && url.substr(0, 1) !== '/')
      return;

    // 不是 index.php?title=FOO 形式的url
    if (title === null) {
      var splitStr = mw.config.get('wgArticlePath').replace('$1', '');
      if (splitStr === '/') {
        splitStr = mw.config.get('wgServer').substring(mw.config.get('wgServer').length - 4) + '/';
      }
      title = url.split(splitStr).pop().split('?')['0'];
    }

    if (mw.util.getParamValue('action', url) === 'edit' && title !== undefined && section !== 'new') {
      $(this).after(
        $('<span>',{
          'class':'in-page-edit-article-link-group'
        }).append(
          $('<span>',{
            'class': 'in-page-edit-article-link-pipe'
          }).text('|'),
          $('<span>',{
            'class': 'in-page-edit-article-link-bracket'
          }).text('['),
          $('<a>', {
            'href': 'javascript:void(0)',
            'class': 'in-page-edit-article-link'
          })
          .text('快速编辑')
          .click(function () {
            if (reversion !== null) {
              InPageEdit.edit({
                page: title,
                reversion: reversion
              });
            } else {
              InPageEdit.edit({
                page: title,
                section: section
              });
            }
          }),
          $('<span>',{
            'class': 'in-page-edit-article-link-bracket'
          })
          .text(']')
        )
      );
    }
  });
}
/** 获取用户权限信息 **/
$(function () {
  var wgUserRights,
      user = mw.config.get('wgUserName');
  new mw.Api().get({
    action: 'query',
    list: 'users',
    usprop: 'rights',
    ususers: user
  }).done(function(data){
    wgUserRights = data.query.users[0]['rights'];
    $('body').attr('data-rights',wgUserRights);
  });
});
function hasRight(right) {
  if ($('body').attr('data-rights').indexOf(right) > -1) {
    return true;
  } else {
    return false;
  }
}
/** 初始化 **/
mw.loader.using('jquery.cookie', function () {
  // 由于兼容性问题，阻止Fandom平台
  if (mw.config.get('skin') === 'oasis') {
    new BannerNotification('注意，当前版本InPageEdit扩展在Fandom平台有严重兼容性问题。<br/>目前不建议在Fandom使用，后续的支持计划请暂定于Fandom社区统一计划(UCP)完成后。', 'warn').show();
    $('.ssi-stack').remove();
    console.error('%c[InPageEdit] 警告：暂不支持的平台。','color:darkred;font-size:1.2em;font-weight:bold');
    return;
  }
  /** 额外的模块 **/
  // 快速页面差异模块
  InPageEdit.viewDiff();
  /** Toolbox模块 **/
  // 检测是否为文章页
  if (mw.config.get('wgIsArticle') === false) {
    console.warn('%c[InPageEdit] 不是文章页面，插件已暂停执行。','color:orange;font-size:1.2em;font-weight:bold');
    return;
  }

  // 读取设定
  if (typeof(MyInPageEditPreference) === 'object') {
    if (typeof(MyInPageEditPreference.editMinor) !== 'boolean' || typeof(MyInPageEditPreference.editSummary) !== 'string') {
      console.error('[InPageEdit] 静态自定义参数有错误');
    } else {
      console.warn('[InPageEdit] 正在使用静态自定义参数');
      $.cookie('InPageEditPreference', JSON.stringify({editMinor:MyInPageEditPreference.editMinor,editSummary:MyInPageEditPreference.editSummary}), {
        expires: 60,
        path: '/'
      });
    }
  }
  if ($.cookie('InPageEditPreference') === null) {
    // 没有保存任何设置
    var ipePreference = {};
    ipePreference.editMinor = false;
    ipePreference.editSummary = '[InPageEdit] 没有编辑摘要 $section$oldid';
    $.cookie('InPageEditPreference', JSON.stringify(ipePreference), {
      expires: 60,
      path: '/'
    });
  }

  // ipe工具盒
  $('body').append(
    '<div id="ipe-edit-toolbox">' +

    // group1 上方的一列按钮
    '<div class="btn-group">' +
    '<div class="btn-tip-group"><div class="btn-tip">快速编辑</div><div id="edit-btn" class="ipe-toolbox-btn material-icons">edit</div></div>' +
    '<div class="btn-tip-group"><div class="btn-tip">重定向至此</div><div id="redirectfrom-btn" class="ipe-toolbox-btn material-icons">flight_land</div></div>' +
    '<div class="btn-tip-group"><div class="btn-tip">重定向到</div><div id="redirectto-btn" class="ipe-toolbox-btn material-icons">flight_takeoff</div></div>' +
    '<div class="btn-tip-group"><div class="btn-tip">自定义设置</div><div id="preference-btn" class="ipe-toolbox-btn material-icons">settings</div></div>' +
    '</div>' +

    // group2 左边的一排按钮
    '<div class="btn-group group2"><div style="display: flex;">' +
    '<div class="btn-tip-group"><div class="btn-tip">删除本页面</div><div id="deletepage-btn" class="ipe-toolbox-btn material-icons">delete_forever</div></div>' +
    '<div class="btn-tip-group"><div class="btn-tip">重命名页面</div><div id="renamepage-btn" class="ipe-toolbox-btn material-icons">format_italic</div></div>' +
    '<div class="btn-tip-group"><div class="btn-tip">关于&帮助</div><div id="about-btn" class="ipe-toolbox-btn material-icons">help_outline</div></div>' +
    '</div></div>' +

    '<div class="ipe-toolbox-btn material-icons" id="toolbox-toggle">add</div>' +
    '</div>');
  $('#ipe-edit-toolbox #toolbox-toggle').click(function () {
    $('#ipe-edit-toolbox #toolbox-toggle').toggleClass('opened');
    $('#ipe-edit-toolbox .btn-group').toggle(100);
  });
  $('body > *:not(#ipe-edit-toolbox)').click(function () {
    $('#ipe-edit-toolbox #toolbox-toggle').removeClass('opened');
    $('#ipe-edit-toolbox .btn-group').hide(100);
  });
  $('#ipe-edit-toolbox .ipe-toolbox-btn').click(function () {
    switch ($(this).attr('id')) {
    case 'toolbox-toggle':
      break;
    case 'edit-btn':
      InPageEdit.edit({
        page: mw.config.get('wgPageName'),
        reversion: mw.config.get('wgRevisionId')
      });
      break;
    case 'redirectfrom-btn':
      InPageEdit.redirect('from');
      break;
    case 'redirectto-btn':
      InPageEdit.redirect('to');
      break;
    case 'preference-btn':
      InPageEdit.preference();
      break;
    case 'deletepage-btn':
      InPageEdit.deletepage();
      break;
    case 'renamepage-btn':
      InPageEdit.renamepage();
      break;
    case 'about-btn':
      mw.loader.load('https://common.wjghj.cn/js/InPageEdit-v2.js/about');
      break;
    default:
      ssi_modal.notify('info', {
        title: '暂未推出',
        content: '抱歉，这个功能还在开发中~'
      });
    }
  });
  // 加载段落编辑模块
  InPageEdit.articleLink();
  // 花里胡哨的加载提示
  console.info('%c[InPageEdit] 加载完毕，です~ ','color:green;font-size:1.2em;font-weight:bold');
});
