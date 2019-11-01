/**
 *『Wjghj Project Static』
 * This _JavaScript_ code is from https://common.wjghj.cn
 * CC BY-NC-SA
 *
 * MediaWiki JS Plugin: In Page Edit
 * Version: See “获取版本信息”
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
var InPageEditcurVersion = '2.2.420'; // 这里填写当前的版本号
$(window).load(function () {
  InPageEditVersionInfo(InPageEditcurVersion);
});

/** 样式表 **/
// Local CSS
mw.loader.load('https://common.wjghj.cn/css/InPageEdit-v2', 'text/css');
// Material icons
mw.loader.load('https://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.min.css', 'text/css');

/** InPageEdit主框架 **/
function InPageEdit(option) {

  // 变量
  if (option === undefined)
    option = {};
  var editPage = decodeURIComponent(option.page),
  editSection = option.section,
  titleSection = '',
  editReversion = option.reversion,
  titleReversion = '',
  editText,
  editSummary = option.summary,
  editMinor = $('#editMinor').prop('checked'),
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
  if (editSummary === undefined)
    editSummary = '';
  if (editReversion !== undefined && editReversion !== '' && editReversion !== mw.config.get('wgCurRevisionId')) {
    ssi_modal.notify('warning', {
      content: '您正在编辑页面的历史版本。',
      title: '提示'
    });
    delete jsonGet.page;
    jsonGet.oldid = editReversion;
    titleReversion = '<span style="font-size:small;">(历史版本：' + editReversion + ')</span>'
  } else {
    if (editSection !== undefined && editSection !== '') {
      jsonGet.section = editSection;
      titleSection = '(第' + editSection + '部分)';
    }
  }

  // Debug
  console.info(
    '[InPageEdit] Running params\n' +
    'editPage = ' + editPage + '\n' +
    'editSection = ' + editSection + '\n' +
    'editReversion = ' + editReversion + '\n' +
    'wgCurRevisionId = ' + mw.config.get('wgCurRevisionId'));

  // 显示主窗口
  ssi_modal.show({
    title: '正在编辑：<u id="editPage">' + editPage + '</u>' + titleSection + titleReversion,
    content: '<textarea id="editArea" style="" disabled="">正在加载……</textarea><label>摘要：<input id="editSummary" value="' + editSummary + '"/></label><br/><label><input id="editMinor" type="checkbox" style=""/>小编辑</label>',
    keepContent: false,
    className: 'in-page-edit timestamp-' + timestamp,
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
          var text = $('#editArea').val();
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
              var text = $('#editArea').val(),
              minor = $('#editMinor').prop('checked'),
              section = option.section,
              summary = $('#editSummary').val();
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
  new mw.Api().get(jsonGet).then(function (data) {
    if (data.error === undefined) {
      editText = data.parse.wikitext['*']
    } else {
      editText = '<!-- 警告：无法获取页面内容 -->';
      console.error('[InPageEdit]警告：无法获取页面内容');
    }
    $('#editArea').val(editText).attr('disabled', false);
  }).fail(function (data) {
    editText = '<!-- 警告：无法获取页面内容 -->';
    console.error('[InPageEdit]警告：无法获取页面内容');
    $('#editArea').val(editText).attr('disabled', false);
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
      editNotice = '<div id="edit-notice" style="display:none">' + data.parse.text['*'] + '</div>'
        $('#editArea').before(editNotice);
      $('#edit-notice').show(400);
    });
  });

  // 预览模块
  function requestPreview(text) {
    var timestamp2 = new Date().getTime();
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
      var content = data.parse.text['*'];
      $('#InPageEditPreview[data-timestamp="' + timestamp2 + '"]').html(content);
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
    if (pValue.section !== undefined && pValue.section !== '') {
      jsonPost.section = pValue.section;
    }
    new mw.Api().post(jsonPost).then(function (data) {
      ssi_modal.notify('success', {
        position: 'right top',
        title: '成功',
        content: '成功，正在刷新页面。'
      });
      window.location.reload();
    }).fail(function (errorCode, fallback, errors) {
      ssi_modal.notify('error', {
        position: 'right top',
        title: '警告',
        content: '发布编辑时发生错误<br/><span style="font-size:amall">' + errors.errors[0]['*'] + '(' + errors.errors[0]['code'] + ')</span>'
      });
    });
  }

}

/** 快速重定向模块 **/
function InPageEditRedirect(type) {
  var json = {
    action: 'edit',
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
    question = '您要将 <b>' + mw.config.get('wgPageName') + '</b> 重定向到那个页面？';
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

/** 获取段落编辑以及编辑链接 **/
function InPageEditSectionLink() {
  $('#mw-content-text a:not(.new)').each(function (i) {
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
        $('<a>', {
          'href': 'javascript:void(0)',
          'class': 'in-page-edit-article-link'
        })
        .text('快速编辑')
        .click(function () {
          if (reversion !== null) {
            InPageEdit({
              page: title,
              summary: ' //InPageEdit - from oldid: ' + reversion,
              reversion: reversion
            });
          } else if (section !== null) {
            InPageEdit({
              page: title,
              summary: ' //InPageEdit - Section' + section,
              section: section
            });
          } else {
            InPageEdit({
              page: title,
              summary: ' //InPageEdit'
            });
          }
        }));
    }
  });
  $('.mw-editsection .in-page-edit-article-link').before(' | ');
  $(':not(.mw-editsection) .in-page-edit-article-link').before('[').after(']');
}

/** 初始化，添加按钮 **/
$(function () {
  // 检测是否为文章页
  if (mw.config.get('wgIsArticle') === false) {
    console.warn('[InPageEdit] 不是文章页面，插件已暂停执行。');
    return;
  }

  // get skin name
  var bodyClass = $('body').attr('class'),
  skinReg = /\sskin-(.*)\s/ig,
  skin;
  bodyClass.replace(skinReg,
    function (s, value) {
    skin = value.split(' ')[0];
  });

  switch (skin) {
  case 'oasis': //由于兼容性问题暂不支持Fandom平台);
    new BannerNotification('注意，当前版本InPageEdit扩展在Fandom平台有严重兼容性问题。<br/>目前不建议在Fandom使用，后续的支持计划请暂定于Fandom社区统一计划(UCP)完成后。', 'warn').show();
    console.error('[InPageEdit] 警告：暂不支持的平台。');
    break;

  default: //一般
    $('body').append(
      '<div id="ipe-edit-toolbox">' +

      // group1 上方的一列按钮
      '<div class="btn-group">' +
      '<div class="btn-tip-group"><div class="btn-tip">快速编辑</div><div id="edit-btn" class="ipe-toolbox-btn material-icons">edit</div></div>' +
      '<div class="btn-tip-group"><div class="btn-tip">重定向至此</div><div id="redirectfrom-btn" class="ipe-toolbox-btn material-icons">flight_land</div></div>' +
      '<div class="btn-tip-group"><div class="btn-tip">重定向到</div><div id="redirectto-btn" class="ipe-toolbox-btn material-icons">flight_takeoff</div></div>' +
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
    $('#ipe-edit-toolbox .ipe-toolbox-btn').click(function () {
      switch ($(this).attr('id')) {
      case 'toolbox-toggle':
        break;
      case 'edit-btn':
        InPageEdit({
          page: mw.config.get('wgPageName'),
          summary: ' //InPageEdit',
          reversion: mw.config.get('wgRevisionId')
        });
        break;
      case 'redirectfrom-btn':
        InPageEditRedirect('from')
        break;
      case 'redirectto-btn':
        InPageEditRedirect('to')
        break;
      case 'about-btn':
        ssi_modal.show({
          title: '关于InPageEdit',
          className: 'in-page-edit-about',
          content: '<div id="placeholder">正在加载……</div><section style="display:none"></section>'
        });
        $.ajax({
          url: 'https://common.wjghj.cn/api.php',
          dataType: 'jsonp',
          type: 'post',
          data: {
            page: 'InPageEdit-v2',
            action: 'parse',
            prop: 'text',
            format: 'json'
          },
          success: function (data) {
            var info = data.parse.text['*'];
            $('.in-page-edit-about #placeholder').fadeOut(800);
            $('.in-page-edit-about section').html(info).delay(1000).show(800);
          }
        });
        break;
      default:
        ssi_modal.notify('info',{title:'暂未推出',content:'抱歉，这个功能还在开发中~'});
      }
    });
    InPageEditSectionLink();
  }

});
