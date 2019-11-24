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
 ** https://common.wjghj.cn/wiki/InPageEdit-v2
 * Logs:
 ** https://github.com/Dragon-Fish/wjghj-wiki/blob/master/Gadgets/in-page-edit/version-info.md
 ** https://common.wjghj.cn/wiki/InPageEdit-v2/version-info
 **/
 
'use strict';
if (InPageEdit) throw '[InPageEdit] 已经有一个IPE插件在执行了';
 
// 创建全局函数
var InPageEdit = {};
 
/** 导入模态框插件 **/
mw.loader.load('https://cdn.bootcss.com/ssi-modal/1.0.27/js/ssi-modal.min.js');
mw.loader.load('https://cdn.bootcss.com/ssi-modal/1.0.27/styles/ssi-modal.min.css', 'text/css');
 
/** 获取版本信息 **/
mw.loader.load('https://common.wjghj.cn/js/InPageEdit-v2.js/version-info');
 
/** 样式表 **/
// 皮肤
mw.loader.load('https://common.wjghj.cn/css/InPageEdit-v2', 'text/css');
// Material icons
mw.loader.load('https://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.min.css', 'text/css');
 
/** InPageEdit主框架 **/
/** 快速编辑模块 **/
InPageEdit.edit = function (option) {
  // 变量
  if (option === undefined)
    option = {};
  var preference = JSON.parse(localStorage.getItem('InPageEditPreference'));
  var editPage = decodeURIComponent(option.page),
    editSection = option.section,
    titleSection = '',
    editRevision = option.revision,
    titleRevision = '',
    summaryRevision = '',
    editText,
    editSummary = preference.editSummary,
    editMinor = preference.editMinor,
    editNotice = '',
    outSideClose = preference.outSideClose,
    jsonGet = {
      action: 'parse',
      page: editPage,
      prop: 'wikitext',
      format: 'json'
    },
    jsonGetInfo = {
      action: 'query',
      titles: editPage,
      prop: 'revisions|info',
      rvprop: 'timestamp',
      format: 'json'
    },
    jsonPost = {},
    basetimestamp,
    date = new Date(),
    timestamp = date.getTime(),
    now = date.toUTCString(); // 缓存时间戳
 
  if (editPage === undefined) editPage = mw.loader.load('wgPageName');
  if (editRevision !== undefined && editRevision !== '' && editRevision !== mw.config.get('wgCurRevisionId')) {
    ssi_modal.notify('warning', {
      className: 'in-page-edit',
      content: '您正在编辑页面的历史版本。',
      title: '提示'
    });
    delete jsonGet.page;
    jsonGet.oldid = editRevision;
    titleRevision = '<span style="font-size:small;">(历史版本：' + editRevision + ')</span>';
    summaryRevision = '(编辑自[[Special:Diff/'+editRevision+']])';
  } else {
    if (editSection !== undefined && editSection !== '' && editSection !== null) {
      jsonGet.section = editSection;
      titleSection = '(第' + editSection + '部分)';
    }
  }
  if (typeof (MyInPageEditPreference) !== 'undefined') {
    if (typeof (MyInPageEditPreference.editSummary) === 'string')
      editSummary = MyInPageEditPreference.editSummary;
    if (typeof (MyInPageEditPreference.editMinor) === 'boolean')
      editMinor = MyInPageEditPreference.editMinor;
    if (typeof (MyInPageEditPreference.outSideClose) === 'boolean')
      outSideClose = MyInPageEditPreference.outSideClose;
  }
 
  // Debug
  console.time('[InPageEdit] Get page content');
  console.info('%c[InPageEdit] Edit function running with params: ', 'color:#fe20d1');
  console.table({
    'editPage': editPage,
    'editSection': editSection,
    'titleSection': titleSection,
    'editRevision': editRevision,
    'titleRevision': titleRevision,
    'editSummary': editSummary,
    'editMinor': editMinor,
    'now': now
  });
  // 绑定事件，在尝试离开页面时提示
  $(window).bind('beforeunload', function () {
    return '您输入的内容尚未保存，确定离开此页面吗？';
  });
 
  // 显示主窗口
  ssi_modal.show({
    title: '正在编辑：<u class="editPage">' + editPage + '</u>' + titleSection + titleRevision,
    content: '<div class="ipe-progress" style="width:100%"><div class="progress-bar"></div></div><section class="editForm"><textarea class="editArea"></textarea><div class="editOptionsLabel editForm"><label for="editSummary">摘要：</label><br/><input id="editSummary" class="editSummary" placeholder="Edit via InPageEdit~"/><br/><input id="editMinor" class="editMinor" type="checkbox" style=""/><label for="editMinor">标记为小编辑</label></div></section>',
    outSideClose: outSideClose,
    className: 'in-page-edit ipe-editor timestamp-' + timestamp,
    sizeClass: 'large',
    beforeClose: function (modal) {
      ssi_modal.confirm({
        className: 'in-page-edit centerbox',
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
              className: 'in-page-edit',
              position: 'right top',
              title: '取消',
              content: "编辑被取消"
            })
          }
        });
      return false;
    },
    buttons: [{
      label: '保存更改',
      className: 'btn btn-primary leftBtn editForm',
      method: function () {
        ssi_modal.confirm({
          className: 'in-page-edit centerbox',
          content: '是否保存',
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
    }, {
      label: '显示预览',
      className: 'btn btn-secondary leftBtn editForm',
      method: function () {
        var text = $('.editArea').val();
        requestPreview(text)
      }
    }, {
      label: '比较差异',
      className: 'btn btn-secondary leftBtn editForm',
      method: function () {
        var text = $('.editArea').val();
        var diffJson = {};
        diffJson.fromtext = editText;
        diffJson.totext = text;
        diffJson.hideBtn = true;
        diffJson.pageName = editPage;
        diffJson.isPreview = true;
        InPageEdit.quickDiff(diffJson);
      }
    }
    ]
  });
  // 设置样式
  $('.ipe-editor.timestamp-' + timestamp + ' .editForm').hide();
  $('.ipe-editor.timestamp-' + timestamp + ' .ipe-progress').css('margin', Number($(window).height() / 3 - 50) + 'px 0');
  $('.ipe-editor.timestamp-' + timestamp + ' .editArea').css('height', $(window).height() / 3 * 2 - 100);
  $('.ipe-editor.timestamp-' + timestamp + ' .editOptionsLabel').prependTo('.ipe-editor.timestamp-' + timestamp + ' .ssi-buttons');
  $('.leftBtn').appendTo('.ssi-leftButtons');
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
    $('.ipe-editor.timestamp-' + timestamp + ' .ipe-progress').hide();
    $('.ipe-editor.timestamp-' + timestamp + ' .editForm').fadeIn(500);
    $('.ipe-editor.timestamp-' + timestamp + ' .editArea').val(editText);
  }).fail(function (data) {
    console.timeEnd('[InPageEdit] Get page content');
    editText = '<!-- 警告：无法获取页面内容 -->';
    console.error('[InPageEdit]警告：无法获取页面内容');
    $('.ipe-editor.timestamp-' + timestamp + ' .ipe-progress').hide();
    $('.ipe-editor.timestamp-' + timestamp + ' .editForm').fadeIn(500);
    $('.ipe-editor.timestamp-' + timestamp + ' .editArea').val(editText);
  });
  // 设定状态
  if (editMinor) {
    $('.ipe-editor.timestamp-' + timestamp + ' .editMinor').attr('checked', 'checked');
  }
  $('.ipe-editor.timestamp-' + timestamp + ' .editSummary').val(editSummary.replace(/\$section/ig, $($.parseHTML(titleSection)).text()).replace(/\$oldid/ig,summaryRevision));
 
  // 获取页面最后编辑时间戳
  new mw.Api().get(jsonGetInfo).then(function (data) {
    if (data && data.query && data.query.pages) {
      var info = data.query.pages;
      for (var key in info) {
        if (key !== '-1') {
          if (info[key].touched) {
            basetimestamp = info[key].touched;
          }
        }
      }
    }
    if (!basetimestamp) {
      basetimestamp = now;
    }
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
      editNotice = '<section class="editNotice" style="display:none">' + data.parse.text['*'] + '</section>';
      $('.ipe-editor.timestamp-' + timestamp + ' .ssi-modalContent').prepend(editNotice);
      $('.ipe-editor.timestamp-' + timestamp + ' .editNotice').fadeIn(500);
    });
  });
 
  // 预览模块
  function requestPreview(text) {
    var timestamp2 = new Date().getTime();
    console.time('[InPageEdit] Request preview');
    ssi_modal.show({
      sizeClass: 'large',
      className: 'in-page-edit previewbox',
      content: '<div class="ipe-progress" style="width:100%"><div class="progress-bar"></div></div><section id="InPageEditPreview" data-timestamp="' + timestamp2 + '" style="display:none">正在读取预览……</section>',
      title: '预览',
      fixedHeight: true,
      fitScreen: true,
      buttons: [{ label: '', className: 'hideThisBtn' }]
    });
    $('.previewbox .ipe-progress').css('margin-top', $('.previewbox .ipe-progress').parent().height() / 2);
    $('.previewbox .hideThisBtn').hide();
    new mw.Api().post({
      action: "parse",
      title: editPage,
      text: text,
      prop: "text",
      preview: true,
      format: "json"
    }).then(function (data) {
      console.timeEnd('[InPageEdit] Request preview');
      var content = data.parse.text['*'];
      $('.previewbox .ipe-progress').hide(150);
      $('#InPageEditPreview[data-timestamp="' + timestamp2 + '"]').fadeIn(500).html(content);
    }).fail(function () {
      console.timeEnd('[InPageEdit] Request preview');
      console.warn('[InPageEdit] 预览失败');
      $('.previewbox .ipe-progress').hide(150);
      $('#InPageEditPreview[data-timestamp="' + timestamp2 + '"]').fadeIn(500).html('获取预览时发生错误！');
    });
  }
 
  // 发布编辑模块
  function postArticle(pValue) {
    InPageEdit.progress('正在发布编辑...');
    jsonPost = {
      action: 'edit',
      basetimestamp: basetimestamp,
      starttimestamp: now,
      text: pValue.text,
      title: pValue.page,
      token: mw.user.tokens.get('editToken'),
      minor: pValue.minor,
      summary: pValue.summary,
      errorformat: 'plaintext'
    }
    if (pValue.section !== undefined && pValue.section !== '' && pValue.section !== null) {
      jsonPost.section = pValue.section;
      delete jsonPost.basetimestamp;
    }
    // Debug
    console.info('%c[InPageEdit] Submitting with params: ', 'color:#fe20d1');
    console.table(jsonPost);
    new mw.Api().post(jsonPost).then(function (data) {
      InPageEdit.progress(true);
      $(window).unbind('beforeunload');
      ssi_modal.notify('success', {
        className: 'in-page-edit',
        position: 'right top',
        title: '成功',
        content: '成功，正在刷新页面。'
      });
      if (pValue.page === mw.config.get('wgPageName')) {
        window.location = mw.config.get('wgArticlePath').replace('$1', pValue.page);
      } else {
        window.location.reload();
      }
    }).fail(function (errorCode, feedback, errorThrown) {
      InPageEdit.progress(false);
      ssi_modal.notify('error', {
        className: 'in-page-edit',
        position: 'right top',
        closeAfter: {
          time: 15
        },
        title: '警告',
        content: '发布编辑时发生错误：<br/><span style="font-size:amall">' + errorThrown.errors[0]['*'] + '(<code>' + errorThrown.errors[0]['code'] + '</code>)</span>'
      });
      console.error('[InPageEdit] Submit failed: \nCode: ' + errorThrown.errors[0]['code'] + '\nDescription: ' + errorThrown.errors[0]['*']);
      InPageEdit.error(errorThrown.errors[0]['code']);
    });
  }
 
}
 
/** 快速重定向模块 **/
InPageEdit.redirect = function (type) {
  var json = {
    action: 'edit',
    minor: JSON.parse(localStorage.getItem('InPageEditPreference')).editMinor,
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
    outSideClose: false,
    className: 'in-page-edit quick-redirect centerbox',
    sizeClass: 'dialog',
    title: '快速重定向',
    content: '<section>' + question + '<br><input id="redirect-page" style="width:80%;margin: 0 10%;" onclick="$(this).css(\'box-shadow\',\'\')"/></section><div class="ipe-progress" style="width:100%;display:none"><div class="progress-bar"></div></div>',
    buttons: [{
      label: '确定',
      className: 'btn btn-primary okbtn',
      method: function (a, modal) {
        var input = $('#redirect-page').val();
        if (input === '' || input === mw.config.get('wgPageName')) {
          $('#redirect-page').css('box-shadow', '0 0 4px red');
        } else {
          $('.in-page-edit.quick-redirect .ipe-progress').show();
          $('.in-page-edit.quick-redirect section').hide();
          $('.in-page-edit.quick-redirect .okBtn').attr('disabled', 'disabled');
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
            $('.in-page-edit.quick-redirect .ipe-progress').addClass('done');
            ssi_modal.notify('success', {
              className: 'in-page-edit',
              content: '已创建重定向！',
              title: '成功'
            });
            if (type === 'to') {
              window.location.reload();
            } else {
              $('.in-page-edit.quick-redirect .ipe-progress').addClass('done');
              setTimeout('modal.close()', 2000);
            }
          }).fail(function () {
            $('.in-page-edit.quick-redirect .ipe-progress').hide();
            $('.in-page-edit.quick-redirect section').show();
            $('.in-page-edit.quick-redirect .okBtn').attr('disabled', false);
            $('.in-page-edit.quick-redirect .ipe-progress').addClass('done');
            ssi_modal.notify('error', {
              className: 'in-page-edit',
              content: '创建重定向时遇到未知问题！',
              title: '失败'
            });
          });
        }
      }
    }
    ]
  });
}
 
/** 删除页面模块 **/
InPageEdit.deletepage = function () {
  if (!hasRight('delete')) {
    ssi_modal.dialog({
      title: '权限不足',
      content: '抱歉，您没有删除页面(<code>delete</code>)的权限。',
      className: 'in-page-edit quick-deletepage centerbox',
      okBtn: {
        className: 'btn btn-primary'
      }
    });
    return;
  }
  var page = mw.config.get('wgPageName'),
    reasonType,
    reason = '不再需要的页面';
 
  ssi_modal.show({
    outSideClose: false,
    className: 'in-page-edit quick-delete centerbox',
    sizeClass: 'dialog',
    title: '删除页面',
    content: '<b style="color:#b00">本功能暂未实装</b><section id="InPageEditDeletepage">您要将 <b>' + page + '</b> 删除的理由？<br/><select id="reasonType" style="width: 23%;padding: 2px;margin: 2px;"><option value="其他">其他</option></select><input id="reason" style="width: 73%;padding: 2px;margin: 2px;" value="' + reason + '"><br/><input id="confirm" type="checkbox"/><label for="confirm">确定删除</label></section>'
  });
}
 
/** 重命名模块 **/
InPageEdit.renamepage = function () {
  if (!hasRight('move')) {
    ssi_modal.dialog({
      title: '权限不足',
      content: '抱歉，您没有移动页面(<code>move</code>)的权限。',
      className: 'in-page-edit quick-renamepage centerbox',
      okBtn: {
        className: 'btn btn-primary'
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
    outSideClose: false,
    className: 'in-page-edit quick-rename centerbox',
    sizeClass: 'dialog',
    title: '重命名页面',
    content: '<b style="color:#b00">本功能暂未实装</b><section id="InPageEditRename"><label id="moveTo">您要将 <b>' + from + '</b> 重命名为？<br/><input style="width:90%"></label><br/><input type="checkbox" id="movetalk" checked="checked"/><label for="movetalk">同时移动讨论页（若存在）</label><br/><input id="movesubpages" type="checkbox" checked="checked"/><label for="movesubpages">同时移动子页面（若存在）</label><br/><input id="noredirect" type="checkbox"/><label for="noredirect">不在本页面创建到新页面的重定向</label><br/><input id="ignorewarnings"type="checkbox"/><label for="ignorewarnings">忽视所有警告</label><br/><label id="reason">编辑摘要(<code>$1</code>将替换为新页面名)<br/><input style="width:90%" value="' + reason + '"/></label></section>'
  });
}
 
/** 个人设置模块 **/
InPageEdit.preference = function () {
  var settings = JSON.parse(localStorage.getItem('InPageEditPreference')),
    minor = settings.editMinor,
    summary = settings.editSummary,
    outSideClose = settings.outSideClose;
 
  ssi_modal.show({
    outSideClose: false,
    title: 'InPageEdit偏好设定 - ' + InPageEdit.version,
    content: '<section id="InPageEditSettingBox"><b>InPageEdit编辑器</b><br><input id="ipeSetoutSideClose" type="checkbox"/> <label for="ipeSetoutSideClose">点击编辑窗口外侧关闭编辑窗口</label><br><input id="ipeSetMinor" type="checkbox"/> <label for="ipeSetMinor">默认标记所有编辑为小编辑</label><br><b>摘要</b><br><label>默认编辑摘要<br/><span style="font-size:10px"><code>$section</code> - 若编辑的是段落，将替换为<code>/* 段落标题 */</code><br/><code>$oldid</code> - 若编辑的是历史版本，将替换为<code>(编辑自[[Special:Diff/revid]])</code>)</span><input id="ipeSetSummary" value="' + summary + '" style="width:100%"/></label><br><b>关于InPageEdit-v2</b><br><button class="btn btn-secondary" onclick="mw.loader.load(\'https://common.wjghj.cn/js/InPageEdit-v2.js/about\')">关于&帮助</button>&nbsp;<button class="btn btn-secondary" onclick="InPageEdit.versionInfo()">更新日志</button>&nbsp;<button class="btn btn-danger" id="ipeUninstall">卸载</button><hr><span style="font-size:10px;line-height:5px">您可以在这里保存InPageEdit-v2的个人偏好。<br><b>注意</b>：这些设置保存在您的浏览器本地，这意味着你必须在不同的设备上分别保存设置。<a href="javascript:;" id="ipeSaveLocalShow">永久保存</a>(不推荐)</span></section>',
    sizeClass: 'dialog',
    className: 'in-page-edit ipe-preference',
    buttons: [{
      label: '重置',
      className: 'btn btn-danger',
      method: function () {
        $('#InPageEditSettingBox #ipeSetoutSideClose').prop('checked', true);
        $('#InPageEditSettingBox #ipeSetMinor').prop('checked', false);
        $('#InPageEditSettingBox #ipeSetSummary').val('[InPageEdit] 没有编辑摘要 $section$oldid');
      }
    }, {
      label: '保存',
      className: 'btn btn-primary',
      method: function (a, modal) {
        localStorage.setItem('InPageEditPreference', JSON.stringify({
          outSideClose: $('#InPageEditSettingBox #ipeSetoutSideClose').prop('checked'),
          editMinor: $('#InPageEditSettingBox #ipeSetMinor').prop('checked'),
          editSummary: $('#InPageEditSettingBox #ipeSetSummary').val()
        }));
 
        modal.close();
      }
    }
    ]
  });
  $('#ipeSaveLocalShow').click(function () {
    ssi_modal.dialog({
      className: 'in-page-edit centerbox',
      content: '<section id="ipeSaveLocal"><b>不推荐这种做法</b><br>在您个人js页调用本插件的代码的上方添加以下代码：<br><input style="width:100%" readonly="readonly" onclick="$(this).select()"/><br/>注意：虽然这样做免去了更换设备时需要重新进行设置的麻烦，但我们没有参数纠错功能，您必须自行确认json设定是否正确。</section>',
      okBtn: {
        className: 'btn btn-primary'
      }
    });
    $('#ipeSaveLocal input').val('var MyInPageEditPreference = ' + JSON.stringify({
      outSideClose: $('#InPageEditSettingBox #ipeSetoutSideClose').prop('checked'),
      editMinor: $('#InPageEditSettingBox #ipeSetMinor').prop('checked'),
      editSummary: $('#InPageEditSettingBox #ipeSetSummary').val()
    }) + ';');
  });
  $('#ipeUninstall').click(function () {
    ssi_modal.show({
      className: 'in-page-edit',
      sizeClass: 'dialog',
      title: '卸载InPageEdit-v2',
      content: '插件目前处于不断开发的阶段，很多功能并不完善，可能没有达到您的预期，肥肠抱歉！由衷希望您可以等待插件继续被开发、完善，并希望您可以为我提供宝贵的建议！<br>插件在安装时会同时保存一些cookie，如果您使用的是手机那么将非常难以删除，因此我提供了这个可以清理残余项的卸载功能。<br><span style="font-size:small"><b>注意</b>：本功能尚处于测试阶段，使用正则表达式简单粗暴地从您的个人js页识别并删除插件相关的代码，有可能会卸载失败，建议按照插件说明页手动删除插件。</span>',
      buttons: [{
        label: '废话少说，残忍卸载',
        className: 'btn btn-danger',
        enableAfter: 5,
        method: function () {
          mw.loader.load('https://common.wjghj.cn/js/InPageEdit-v2.js/uninstall');
        }
      }, {
        label: '算了，暂时不卸载了',
        className: 'btn btn-primary',
        method: function (event, modal) {
          modal.close();
        }
      }
      ]
    });
  });
  if (outSideClose) {
    $('#InPageEditSettingBox #ipeSetoutSideClose').prop('checked', true);
  }
  if (minor) {
    $('#InPageEditSettingBox #ipeSetMinor').prop('checked', true);
  }
 
  if (typeof (MyInPageEditPreference) !== 'undefined') {
    $('.ipe-preference .ssi-buttons .ssi-modalBtn').attr('disabled', '');
    if (typeof (MyInPageEditPreference.editMinor) === 'boolean') {
      $('#InPageEditSettingBox #ipeSetMinor').prop('checked', MyInPageEditPreference.editMinor).attr('disabled', '');
    }
    if (typeof (MyInPageEditPreference.outSideClose) === 'boolean') {
      $('#InPageEditSettingBox #ipeSetoutSideClose').prop('checked', MyInPageEditPreference.outSideClose).attr('disabled', '');
    }
    if (typeof (MyInPageEditPreference.editSummary) === 'string') {
      $('#InPageEditSettingBox #ipeSetSummary').attr('disabled', '').val(MyInPageEditPreference.editSummary);
    }
    ssi_modal.dialog({
      content: '您使用自己的个人js保存了设定参数，请浏览<a href="' + mw.config.get('wgArticlePath').replace('$1', 'Special:Mypage/common.js') + '">您的个人js页</a>修改。<br>我们不推荐保存静态的设定，虽然这样做免去了更换设备时需要重新进行设置的麻烦，但因为暂时没有参数纠错功能，您必须自行确认json设定是否正确。',
      className: 'in-page-edit centerbox',
      okBtn: {
        className: 'btn btn-primary'
      }
    });
  }
}
 
/** 快速页面差异模块 **/
InPageEdit.quickDiff = function (param) {
  if ($('[href*="mediawiki.diff.styles"]').length < 1) {
    mw.loader.load(mw.config.get('wgScriptPath') + '/load.php?modules=mediawiki.legacy.shared|mediawiki.diff.styles&only=styles', 'text/css');
  }
  if ($('.quick-diff').length > 0) {
    console.info('[InPageEdit] Quick diff 正在加载新内容');
    $('.in-page-edit.quick-diff .diffArea').hide().html('加载中');
  } else {
    ssi_modal.show({
      className: 'in-page-edit quick-diff',
      sizeClass: 'large',
      fixedHeight: true,
      fitScreen: true,
      title: '<span class="pageName">正在加载差异……</span>',
      content: '<div class="ipe-progress" style="width:100%"><div class="progress-bar"></div></div><div class="diffArea"></div>',
      buttons: [{
        label: '转到原版比较页面',
        className: 'btn btn-secondary toDiffPage',
        method: function () {
          // Placeholder
        }
      }]
    });
  }
  $('.in-page-edit.quick-diff .ipe-progress').show().css('margin-top', $('.in-page-edit.quick-diff .ipe-progress').parent().height() / 2);
  $('.quick-diff button.toDiffPage').unbind();
  param.action = 'compare';
  param.prop = 'diff|diffsize|rel|ids|title|user|comment|parsedcomment|size';
  param.format = 'json';
  new mw.Api().post(param).then(function (data) {
    var diffTable = data.compare['*'];
    $('.in-page-edit.quick-diff .ipe-progress').hide();
    if (param.pageName === undefined) {
      var toTitle = data.compare.totitle;
    } else {
      var toTitle = param.pageName;
    }
    var userlink = function (user) {
      return '<a href="' + mw.util.getUrl('User:' + user) + '">' + user + '</a> ( <a href="' + mw.util.getUrl('User_talk:' + user) + '">讨论</a> | <a href="' + mw.util.getUrl('Special:Contributions/' + user) + '">贡献</a> | <a href="' + mw.util.getUrl('Special:Block/' + user) + '">封禁</a> )';
    }
    $('.quick-diff .pageName').html('比较差异：<u>' + toTitle + '</u>');
    $('.quick-diff .diffArea').show().html(
      '<table class="diff diffTable">' +
      '<colgroup>' +
      '<col class="diff-marker">' +
      '<col class="diff-content">' +
      '<col class="diff-marker">' +
      '<col class="diff-content">' +
      '</colgroup>' +
      '<tbody>' +
      '<tr class="diff-title">' +
      '<td colspan="2" class="diff-otitle">' +
      '<a class="" href="' + mw.config.get('wgScript') + '?oldid=' + data.compare.fromrevid + '">' + data.compare.fromtitle + '</a> (版本' + data.compare.fromrevid + ') (<a class="editLink" href="' + mw.config.get('wgScript') + '?action=edit&title=' + data.compare.fromtitle + '&oldid=' + data.compare.fromrevid + '">编辑</a>)<br/>' + userlink(data.compare.fromuser) + '<br/>(' + data.compare.fromparsedcomment + ')<br/><a class="prevVersion" href="javascript:void(0);" onclick="InPageEdit.quickDiff({fromrev:'+data.compare.fromrevid+',torelative:\'prev\'})">←上一版本</a>' +
      '</td>' +
      '<td colspan="2" class="diff-ntitle">' +
      '<a class="" href="' + mw.config.get('wgScript') + '?oldid=' + data.compare.torevid + '">' + data.compare.totitle + '</a> (版本' + data.compare.torevid + ') (<a class="editLink" href="' + mw.config.get('wgScript') + '?action=edit&title=' + data.compare.totitle + '&oldid=' + data.compare.torevid + '">编辑</a>)<br/>' + userlink(data.compare.touser) + '<br/>(' + data.compare.toparsedcomment + ')<br/><a class="nextVersion" href="javascript:void(0);" onclick="InPageEdit.quickDiff({fromrev:'+data.compare.torevid+',torelative:\'next\'})">下一版本→</a>' +
      '</td>' +
      '</tr>' +
      diffTable +
      '<tr class="diffSize" style="text-align: center;"><td colspan="2">' + data.compare.fromsize + '字节</td><td colspan="2">' + data.compare.tosize + '字节</td></tr>' +
      '</tbody>' +
      '</table>'
    );
    $('.quick-diff button.toDiffPage').click(function(){
      alert('test');
    });
    InPageEdit.articleLink($('.quick-diff .editLink'));
    if (param.isPreview === true) {
      $('.quick-diff button.toDiffPage').hide();
      $('.quick-diff .diff-otitle').html('<b>原始内容</b>');
      $('.quick-diff .diff-ntitle').html('<b>您的编辑</b>');
    }
    if (data.compare.fromsize === undefined || data.compare.tosize === undefined) {
      $('.quick-diff .diffSize').hide();
    }
    if (data.compare.fromrevid === undefined && param.isPreview !== true) {
      $('.quick-diff .diff-otitle').html('<span class="noNextVerson"><b>没有更多了哟~</b><br/><span style="font-size:10px">没有之前的版本了！之前的版本即使是盘古也没有见过呀！</span></span>');
    } else if (data.compare.torevid === undefined && param.isPreview !== true) {
      $('.quick-diff .diff-ntitle').html('<span class="noNextVerson"><b>没有更多了哟~</b><br/><span style="font-size:10px">没有之后的版本了！一点也没有了！！真的没有了！！！</span></span>');
    }
  }).fail(function (a, b, c) {
    $('.in-page-edit.quick-diff .ipe-progress').hide();
    $('.diffArea').html('比较差异时出现错误: ' + b);
  });
}
// 加载预设的快速最近更改模块
InPageEdit.loadQuickDiff = function () {
  // 最近更改
  $('.mw-changeslist-groupdiff, .mw-changeslist-diff, .mw-changeslist-diff-cur, .mw-history-histlinks a').click(function (e) {
    e.preventDefault();
    var $this = $(this),
      href = $this.attr('href'),
      diff = mw.util.getParamValue('diff', href),
      curid = mw.util.getParamValue('curid', href),
      oldid = mw.util.getParamValue('oldid', href);
    if (diff === '0') {
      InPageEdit.quickDiff({ fromrev: oldid, toid: curid });
    } else if (diff === 'prev' || diff === 'next' || diff === 'cur') {
      InPageEdit.quickDiff({ fromrev: oldid, torelative: diff });
    } else {
      InPageEdit.quickDiff({ fromrev: oldid, torev: diff });
    }
  });
  // 查看历史页面的比较按钮与快速编辑
  if (mw.config.get('wgAction') === 'history') {
    $('.historysubmit.mw-history-compareselectedversions-button').after(
      $('<button>').text('快速对比差异').click(function (e) {
        e.preventDefault();
        var before = $('.selected.before').attr('data-mw-revid'),
          after = $('.selected.after').attr('data-mw-revid');
        InPageEdit.quickDiff({ fromrev: after, torev: before });
      })
    );
    $('[data-mw-revid]').each(function () {
      var $this = $(this),
        oldid = $this.attr('data-mw-revid');
      $this.find('.mw-history-undo').after(
        $('<span>').html(' | <a class="in-page-edit-article-link" href="javascript:void(0);" onclick="InPageEdit.edit({page:mw.config.get(\'wgPageName\'),revision:'+oldid+'});">快速编辑</a>')
      );
    });
  }
}
 
/** 获取段落编辑以及编辑链接 **/
InPageEdit.articleLink = function (element) {
  if (element === undefined)
    element = $('#mw-content-text a:not(.new)');
  element.each(function (i) {
    if ($(this).attr('href') === undefined)
      return;
    var url = $(this).attr('href'),
      title = mw.util.getParamValue('title', url),
      section = mw.util.getParamValue('section', url),
      revision = mw.util.getParamValue('oldid', url);
 
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
        $('<span>', {
          'class': 'in-page-edit-article-link-group'
        }).append(
          $('<span>', {
            'class': 'in-page-edit-article-link-pipe'
          }).text('|'),
          $('<span>', {
            'class': 'in-page-edit-article-link-bracket'
          }).text('['),
          $('<a>', {
            'href': 'javascript:void(0)',
            'class': 'in-page-edit-article-link'
          })
            .text('快速编辑')
            .click(function () {
              if (revision !== null) {
                InPageEdit.edit({
                  page: title,
                  revision: revision
                });
              } else {
                InPageEdit.edit({
                  page: title,
                  section: section
                });
              }
            }),
          $('<span>', {
            'class': 'in-page-edit-article-link-bracket'
          })
            .text(']')));
    }
  });
}
/** 载入中模块 **/
InPageEdit.progress = function (title) {
  if (title === true) {
    $('.in-page-edit.loadingbox .ssi-modalTitle').html('完成');
    $('.in-page-edit.loadingbox .ipe-progress').addClass('done');
  } else if (title === false) {
    if ($('.in-page-edit.loadingbox').length > 0) ssi_modal.close();
  } else {
    if ($('.in-page-edit.loadingbox').length > 0) return;
    if (typeof (title) === 'undefined') {
      title = '加载中...'
    }
    ssi_modal.show({
      title: title,
      content: '<div class="ipe-progress" style="width:100%"><div class="progress-bar"></div></div>',
      className: 'in-page-edit centerbox loadingbox',
      sizeClass: 'dialog',
      closeIcon: false,
      outSideClose: false
    });
  }
}
/** 常见错误集 **/
InPageEdit.error = function (code) {
  var errorTitle = '发生未知错误',
    errorContent = '错误代码为：' + code + '<br height:"0.5em"/>常见的错误代码请查看<a href="https://www.mediawiki.org/wiki/API:Edit#Possible_errors" target="_blank">这里</a>。大多数情况下刷新页面可以解决问题';
  switch (code) {
    case 'editconflict':
      errorTitle = '检测到编辑冲突';
      errorContent = '在您打开编辑窗口到保存的期间，有用户修改了页面的内容，建议您现在复制您的编辑内容，重新打开编辑窗口检查并再次提交您的内容';
      break;
    case 'badtoken':
      errorTitle = '编辑令牌错误';
      errorContent = '对不起，重获取token的方案正在开发中……';
      break;
    case 'pagedeleted':
      errorTitle = '页面已被删除';
      errorContent = '在您保存页面时该页面已被删除，请备份您的编辑内容并检查删除日志，确认具体情况';
      break;
    case 'protectedpage':
    case 'protectednamespace-interface':
      errorTitle = '无权编辑页面';
      errorContent = '该页面已被保护以防止编辑和其他操作，请在讨论页提交编辑申请或联系wiki管理员';
      break;
    case 'ratelimited':
      errorTitle = '触发频率保护';
      errorContent = '您的提交频率触发了保护性上限，请稍候再试';
      break;
  }
  errorContent = errorContent + '<hr/><span style="font-size:small;line-height: 4px;">若此问题多次出现，请复制编辑内容并使用MediaWiki原生编辑页面发布您的编辑。若您愿意，请提供控制台的错误代码片段或者截图给作者，谢谢！</span>';
 
  ssi_modal.show({
    outSideClose: false,
    sizeClass: 'dialog',
    className: 'in-page-edit centerbox',
    title: errorTitle,
    content: errorContent,
    buttons: [{
      label: '*口吐芬芳*',
      className: 'btn btn-danger',
      method: function (a, modal) { window.open('https://blog.wjghj.cn/index.php/contact') }
    }, {
      label: '好的',
      className: 'btn btn-primary',
      method: function (a, modal) { modal.close() }
    }]
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
  }).done(function (data) {
    wgUserRights = data.query.users[0]['rights'];
    $('body').attr('data-rights', wgUserRights);
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
$(function () {
  // 由于兼容性问题，阻止Fandom平台
  if (mw.config.get('skin') === 'oasis') {
    new BannerNotification('注意，当前版本InPageEdit扩展在Fandom平台有严重兼容性问题。<br/>目前不建议在Fandom使用，后续的支持计划请暂定于Fandom社区统一计划(UCP)完成后。', 'warn').show();
    $('.ssi-stack').remove();
    console.error('%c[InPageEdit] 警告：暂不支持的平台。', 'color:darkred;font-size:1.2em;font-weight:bold');
    return;
  }
  /** 额外的模块 **/
  // 快速页面差异模块
  InPageEdit.loadQuickDiff();
  /** Toolbox模块 **/
  // 检测是否为文章页
  if (mw.config.get('wgIsArticle') === false) {
    console.warn('%c[InPageEdit] 不是文章页面，插件已暂停执行。', 'color:orange;font-size:1.2em;font-weight:bold');
    return;
  }
 
  // 读取设定
  if (localStorage.getItem('InPageEditPreference') === null) {
    // 没有保存任何设置
    var ipePreference = {};
    ipePreference.outSideClose = true;
    ipePreference.editMinor = false;
    ipePreference.editSummary = '[InPageEdit] 没有编辑摘要 $section$oldid';
    localStorage.setItem('InPageEditPreference', JSON.stringify(ipePreference));
  }
 
  // ipe工具盒
  $('body').append(
    '<div id="ipe-edit-toolbox">' +
 
    // group1 上方的一列按钮
    '<div class="btn-group">' +
    '<div class="btn-tip-group"><div class="btn-tip">快速编辑</div><button id="edit-btn" class="ipe-toolbox-btn material-icons">edit</button></div>' +
    '<div class="btn-tip-group"><div class="btn-tip">重定向至此</div><button id="redirectfrom-btn" class="ipe-toolbox-btn material-icons">flight_land</button></div>' +
    '<div class="btn-tip-group"><div class="btn-tip">重定向到</div><button id="redirectto-btn" class="ipe-toolbox-btn material-icons">flight_takeoff</button></div>' +
    '</div>' +
 
    // group2 左边的一排按钮
    '<div class="btn-group group2"><div style="display: flex;">' +
    '<div class="btn-tip-group"><div class="btn-tip">删除本页面</div><button id="deletepage-btn" class="ipe-toolbox-btn material-icons">delete_forever</button></div>' +
    '<div class="btn-tip-group"><div class="btn-tip">重命名页面</div><button id="renamepage-btn" class="ipe-toolbox-btn material-icons">format_italic</button></div>' +
    '<div class="btn-tip-group"><div class="btn-tip">自定义设置</div><button id="preference-btn" class="ipe-toolbox-btn material-icons">settings</button></div>' +
    '</div></div>' +
 
    '<button class="ipe-toolbox-btn material-icons" id="toolbox-toggle">add</button>' +
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
          revision: mw.config.get('wgRevisionId')
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
      default:
        ssi_modal.notify('info', {
          className: 'in-page-edit',
          title: '暂未推出',
          content: '抱歉，这个功能还在开发中~'
        });
    }
  });
  // 测试-快速查看最后差异
  if (mw.config.get('wgIsArticle')) {
    $('#ca-history').append(
      $('<a>',{
        href:'javascript:void(0);',
        style:'margin-left:2px;top: -1.2em;position: relative;font-size: 8px;'
      }).append(
        $('<span>').html('最后更改')
      ).click(function(){
        InPageEdit.quickDiff({fromtitle:mw.config.get('wgPageName'),torelative:'prev'});
      })
    );
  }
  // 加载段落编辑模块
  InPageEdit.articleLink();
  // 花里胡哨的加载提示
  console.info('%c[InPageEdit] 加载完毕，です~ ', 'color:green;font-size:1.2em;font-weight:bold');
});
