/**
 *『Wjghj Project Static』
 * This _JavaScript_ code is from https://common.wjghj.cn
 * CC BY-NC-SA
 *
 * MediaWiki JS Plugin: In Page Edit
 * Version: 2.1.298 20191019
 * Author: 机智的小鱼君
 * Url: https://github.com/Dragon-Fish/wjghj-wiki/edit/master/Gadgets/in-page-edit
 * Description: Let you edit page without open new tab. And edit Navebox via navbar, edit section via section edit link etc.
 *
 * Logs:
 ** 2.0.0 - Alpha release, rewrite InPageEdit via ssi modal plugin.
 ** 2.0.7 - Fixed bugs, content can be published now.
 ** 2.0.8 - Now support preview.
 ** 2.0.9 - Now support multi skins.
 ** 2.0.279(20191018) - Now support minor edit.
 ** 2.1.298(20191019) - Now support reversion edit. Posting error will show you the error code.
 ** 2.1.306(20191025) - Replace syntax with mw resource loader.
 ** 2.1.318(20191025) - Testing: Load via URL param.
 **/
/** 导入模态框插件 **/
mw.loader.load('https://cdn.bootcss.com/ssi-modal/1.0.27/js/ssi-modal.min.js');
mw.loader.load('https://cdn.bootcss.com/ssi-modal/1.0.27/styles/ssi-modal.min.css','text/css');

/** 获取版本信息 **/
mw.loader.load('https://common.wjghj.cn/js/InPageEdit-v2.js/version-info');
var InPageEditcurVersion = '2.1.318';// 这里填写当前的版本号
$(window).load(function(){
  InPageEditVersionInfo(InPageEditcurVersion);
});

/** InPageEdit主框架 **/
function InPageEdit(option) {

  // Variables
  if (option === undefined) option = {};
  var editPage = decodeURIComponent(option.page),
      editSection = option.section,
      titleSection = '',
      editReversion = option.reversion,
      titleReversion = '',
      editText,
      editSummary = option.summary,
      editMinor = $('#editMinor').prop('checked'),
      editNotice = '',
      jsonGet = {},
      jsonPost = {};

  if (editPage === undefined) return;
  if (editSummary === undefined) editSummary = '';
  if (editReversion !== undefined && editReversion !== '' && editReversion !== mw.config.get('wgCurRevisionId')) {
    ssi_modal.notify('warning',{content:'您正在编辑页面的历史版本。',title:'提示'});
    jsonGet = {
      action: 'parse',
      oldid: editReversion,
      prop: 'wikitext',
      format: 'json'
    }
    titleReversion = '<span style="font-size:small;">(历史版本：'+editReversion+')</span>'
  } else {
    if (editSection !== undefined && editSection !== '') {
      jsonGet = {
        action: 'parse',
        page: editPage,
        section: editSection,
        prop: 'wikitext',
        format: 'json'
      }
      titleSection = '(第'+editSection+'部分)';
    } else {
      jsonGet = {
        action: 'parse',
        page: editPage,
        prop: 'wikitext',
        format: 'json'
      }
    }
  }

  // Debug
  console.info(
    '[InPageEdit] Debug info\n'+
    'editPage = ' + editPage + '\n' +
    'editSection = ' + editSection + '\n' +
    'editReversion = ' + editReversion + '\n' +
    'wgCurRevisionId = ' + mw.config.get('wgCurRevisionId')
  );

  // 显示主窗口
  ssi_modal.show({
    title: '<span style="font-style:normal;">正在编辑：<u id="editPage">'+editPage+'</u>'+titleSection+'</span>'+titleReversion,
    content: '<textarea id="editArea" style="max-width:100%;min-width:100%;min-height:350px" disabled="">正在加载……</textarea><label>摘要：<input id="editSummary" value="'+editSummary+'"/></label><br/><label><input id="editMinor" type="checkbox" style="margin-left:0;margin-right:4px"/>小编辑</label>',
    keepContent: false,
    beforeClose: function(modal) {
      ssi_modal.confirm({
        position: 'top center',
        content: '确定要关闭窗口吗？<br/>你所做的修改不会被保存。',
        okBtn: {
          className: 'btn btn-primary',
          label: '确定'
        },
        cancelBtn: {
          className: 'btn btn-danger',
          label: '取消'
        }
      },
      function(result) {
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
      method: function (){
        var text = $('#editArea').val();
        requestPreview(text)
      }
    },
    {
      label: '发布',
      method: function() {
        ssi_modal.confirm({
          content: '是否发布',
          okBtn: {
            label: '确定'
          },
          cancelBtn: {
            label: '取消'
          },
        },
        function(result) {
          if (result) {
            var text = $('#editArea').val(),
                minor = $('#editMinor').prop('checked'),
                section = option.section,
                summary = $('#editSummary').val();
            postArticle({text:text,page:editPage,minor:minor,section:section,summary:summary});
          }
        })
      }
    }]
  });
  new mw.Api().get(jsonGet).then(function(data){
    if (data.error === undefined) {
      editText = data.parse.wikitext['*']
    } else {
      editText = '<!-- 警告：无法获取页面内容 -->';
      console.error('[InPageEdit]警告：无法获取页面内容');
    }
    $('#editArea').val(editText).attr('disabled',false);
  }).fail(function(data){
    editText = '<!-- 警告：无法获取页面内容 -->';
    console.error('[InPageEdit]警告：无法获取页面内容');
    $('#editArea').val(editText).attr('disabled',false);
  });
  // 获取编辑提示
  new mw.Api().get({
    action: 'query',
    meta: 'allmessages',
    ammessages: 'Editnotice-' + mw.config.get('wgNamespaceNumber'),
    amlang: mw.config.get('wgUserLanguage') || mw.config.get('wgContentLanguage')
  }).then(function(data){
    editNotice = data.query.allmessages[0]['*'];
    new mw.Api().post({action:'parse',preview:true,text:editNotice}).then(function(data){
      editNotice = '<div id="edit-notice" style="display:none">' + data.parse.text['*'] + '</div>'
      $('#editArea').before(editNotice);
      $('#edit-notice').show(400);
    });
  });

  // 预览模块
  function requestPreview(text){
    var timestamp = new Date().getTime();
    ssi_modal.show({content:'<section id="InPageEditPreview" data-timestamp="'+timestamp+'">正在读取预览……</section>',title:'预览'});
    new mw.Api().post({
      action: "parse",
      text: text,
      prop: "text",
      preview: true,
      format: "json"
    }).then(function(data){
      var content = data.parse.text['*'];
      $('#InPageEditPreview[data-timestamp="'+timestamp+'"]').html(content);
    });
  }

  // 发布编辑模块
  function postArticle(pValue){
    if (pValue.section === undefined || pValue.section === '') {
      jsonPost = {
        action: "edit",
        text: pValue.text,
        title: pValue.page,
        token: mw.user.tokens.get('editToken'),
        minor: pValue.minor,
        summary: pValue.summary,
        errorformat: 'plaintext'
      }
    } else {
      jsonPost = {
        action: "edit",
        text: pValue.text,
        title: pValue.page,
        section: pValue.section,
        token: mw.user.tokens.get('editToken'),
        minor: pValue.minor,
        summary: pValue.summary,
        errorformat: 'plaintext'
      }	
    }
    new mw.Api().post(jsonPost).then(function(data){
      ssi_modal.notify('success',{position: 'right top',title:'成功',content:'成功，正在刷新页面。'});
      window.location.reload();
    }).fail(function(errorCode, fallback, errors){
      ssi_modal.notify('error',{position: 'right top',title:'警告',content:'发布编辑时发生错误<br/><span style="font-size:amall">'+errors.errors[0]['*']+'('+errors.errors[0]['code']+')</span>'});
    });
  }
  
}

/** 获取段落编辑以及编辑链接 **/
function InPageEditSectionLink() {
  $('#mw-content-text a:not(.new)').each(function(i) {
    if ($(this).attr('href') === undefined) return;
    var url = $(this).attr('href'),
        title = mw.util.getParamValue( 'title', url ),
        section = mw.util.getParamValue( 'section', url ),
        reversion = mw.util.getParamValue( 'oldid', url );

    // 不是本地编辑链接
    if (url.split('/')['2'] !== location.href.split('/')['2'] && url.substr(0, 1)!=='/') return;

    // 不是 index.php?title=FOO 形式的url
    if (title === null) {
      var splitStr = mw.config.get('wgArticlePath').replace('$1','');
      if (splitStr === '/') {
      	splitStr = mw.config.get('wgServer').substring(mw.config.get('wgServer').length-4)+'/';
      }
      title = url.split(splitStr).pop().split('?')['0'];
    }

    if (mw.util.getParamValue( 'action', url ) === 'edit' && title !== undefined && section !== 'new') {
      $(this).after(
        $('<a>',{
          'href': 'javascript:void(0)',
          'class': 'in-page-edit-article-link'
        })
        .text('快速编辑')
        .click(function (){
          if (reversion !== null) {
            InPageEdit({page:title, summary:' //InPageEdit - from oldid: '+ reversion, reversion:reversion});
          } else if (section !== null) {
            InPageEdit({page:title, summary:' //InPageEdit - Section'+section, section:section});
          } else {
            InPageEdit({page:title, summary:' //InPageEdit'});
          }
        }
      ));
    }
  });
  $('.mw-editsection .in-page-edit-article-link').before(' | ');
  $('.in-page-edit-article-link:not(.mw-editsection)').before('[').after(']');
}

/** 初始化，添加按钮 **/
$(function() {
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
  function(s, value) {
    skin = value.split(' ')[0];
  });

  switch (skin) {
  case 'timeless': //Wjghj project
    $('#ca-edit, #ca-viewsource').after($('<li>').append($('<a>').addClass('in-page-edit-btn-link').attr('href', 'javascript:void(0)').text('快速编辑').click(function() {
      InPageEdit({
        page: mw.config.get('wgPageName'),
        summary: ' //InPageEdit',
        reversion: mw.config.get('wgRevisionId')
      })
    })));
    InPageEditSectionLink();
    break;

  case 'oasis': //Fandom平台
    /*
    $('.page-header__contribution-buttons .wds-dropdown__content ul').append($('<li>').append($('<a>').addClass('in-page-edit-btn-link').attr('href', 'javascript:void(0)').text('快速编辑').click(function() {
    // OOO
  })));
 */
    new BannerNotification('注意，当前版本InPageEdit扩展在Fandom平台有严重兼容性问题。<br/>目前不建议在Fandom使用，后续的支持计划请暂定于Fandom社区统一计划(UCP)完成后。', 'warn').show();
    console.error('[InPageEdit] 警告：暂不支持的平台。');
    break;

  default: //未优化的皮肤
    $('body').append($('<div>').css({
      'position':
      'fixed',
      'bottom': '12px',
      'right': '-4px',
      'background': 'white',
      'box-shadow': '0 0 5px gray',
      'border-radius': '2px',
      'padding': '4px 20px 4px 4px'
    }).append('✎ <a class="in-page-edit-btn-link" href="javascript:void(0)" onclick="InPageEdit({page: \''+mw.config.get('wgPageName')+'\',summary: \' //InPageEdit\',reversion:'+mw.config.get('wgRevisionId')+'})">快速编辑</a>'));
    InPageEditSectionLink();
    console.warn('[InPageEdit] 警告：未经优化的皮肤。');
  }

});

/** 正在测试中，通过URL参数载入 **/
$(function(){
  var ipeparam = mw.util.getParamValue( 'inpageedit', location.href ),
     reversion = mw.util.getParamValue( 'oldid', location.href )
  if ( ipeparam == '1' || ipeparam == 'true' ) {
    if (reversion == null) {
      InPageEdit({page:mw.config.get('wgPageName')});
    } else {
      InPageEdit({page:mw.config.get('wgPageName'),reversion:reversion});
    }
  }
});
