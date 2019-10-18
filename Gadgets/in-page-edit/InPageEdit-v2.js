/**
 *『Wjghj Project Static』
 * This _JavaScript_ code is from https://common.wjghj.cn
 * CC BY-NC-SA
 *
 * MediaWiki JS Plugin: In Page Edit
 * Version: 2.0.9 20191018
 * Author: 机智的小鱼君
 * Url: https://github.com/Dragon-Fish/wjghj-wiki/edit/master/Gadgets/in-page-edit
 * Description: Let you edit page without open new tab. And edit Navebox via navbar, edit section via section edit link etc.
 **/
/** Modal plugin **/
mw.loader.load('https://cdn.bootcss.com/ssi-modal/1.0.27/js/ssi-modal.min.js');
mw.loader.load('https://cdn.bootcss.com/ssi-modal/1.0.27/styles/ssi-modal.min.css','text/css');

/** Main **/
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
  if (editReversion !== undefined && editReversion !== '') {
    ssi_modal.notify('warning',{content:'您正在编辑页面的历史版本。',title:'警告'});
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

  // 显示主窗口
  ssi_modal.show({
    title: '<span style="font-style:normal;">正在编辑：<u id="editPage">'+editPage+'</u>'+titleSection+'</span>'+titleReversion,
    content: editNotice+'<textarea id="editArea" style="max-width:100%;min-width:100%;min-height:350px" disabled="">正在加载……</textarea><label>摘要：<input id="editSummary" value="'+editSummary+'"/></label><br/><label><input id="editMinor" type="checkbox" style="margin-left:0;margin-right:4px"/>小编辑</label>',
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
    ammessages: 'Editnotice-' + wgNamespaceNumber,
    amlang: mw.config.get('wgUserLanguage') || mw.config.get('wgContentLanguage')
  }).then(function(data){
    editNotice = data.query.allmessages[0]['*'];
    new mw.Api().post({action:'parse',preview:true,text:editNotice}).then(function(data){
      editNotice = '<div id="edit-notice">' + data.parse.text['*'] + '</div>'
      $('#editArea').before(editNotice);
    });
  });

  // 预览模块
  function requestPreview(text){
    new mw.Api().post({
      action: "parse",
      text: text,
      prop: "text",
      preview: true,
      format: "json"
    }).then(function(data){
      var content = data.parse.text['*'];
      ssi_modal.show({content:content});
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
        summary: pValue.summary
      }
    } else {
      jsonPost = {
        action: "edit",
        text: pValue.text,
        title: pValue.page,
        section: pValue.section,
        token: mw.user.tokens.get('editToken'),
        minor: pValue.minor,
        summary: pValue.summary
      }	
    }
    new mw.Api().post(jsonPost).then(function(data){
      ssi_modal.show({content:'成功，正在刷新页面。'});
      window.location.reload();
    }).fail(function(data){
      ssi_modal.notify('error',{position: 'right top',title:'警告',content:'发生未知错误。'});
    });
  }
  
}

/** 获取段落编辑以及编辑链接 **/
function InPageEditSectionLink() {
  $('#mw-content-text a:not(.new)').each(function(i) {
    if ($(this).attr('href') === undefined) return;
    var url = $(this).attr('href');
        params = {};
    var vars = url.split('?').pop().split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      params[pair[0]] = pair[1];
    }
 
    // 不是本地编辑链接
    if (url.split('/')['2'] !== location.href.split('/')['2'] && url.substr(0, 1)!=='/') return;
    // 不是 index.php?title=FOO 形式的url
    if (params.title === undefined) {
      var splitStr = wgArticlePath.replace('$1','');
      if (splitStr = '/') {
      	splitStr = wgServer.substring(wgServer.length-4)+'/';
      }
      params.title = url.split(splitStr).pop().split('?')['0'];
    }
    if (params.section === undefined) params.section = false;

    var target = params.title,
        section = params.section,
        reversion = params.oldid;
    if (reversion === undefined) reversion = false;

    if (params.action === 'edit' && target !== undefined && section !== 'new') {
      $(this).after(
        $('<a>',{
          'href': 'javascript:void(0)',
          'class': 'in-page-edit-article-link'
        })
        .text('快速编辑')
        .click(function (){
          if (reversion !== true) {
            InPageEdit({page:target, summary:' //InPageEdit - from oldid: '+ reversion, reversion:reversion});
          } else if (section !== undefined) {
            InPageEdit({page:target, summary:' //InPageEdit - Section'+section, section:section});
          } else {
            InPageEdit({page:target, summary:' //InPageEdit'});
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
  if (wgIsArticle === false) {
    console.info('[InPageEdit] 不是文章页面，插件已暂停执行。');
    return;
  }
  
  var url = location.href;
      params = {};
  var vars = url.split('?').pop().split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    params[pair[0]] = pair[1];
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
    $('#ca-edit').after($('<li>').append($('<a>').addClass('in-page-edit-btn-link').attr('href', 'javascript:void(0)').text('快速编辑').click(function() {
      InPageEdit({
        page: mw.config.get('wgPageName'),
        summary: ' //InPageEdit',
        reversion: params.oldid
      })
    })));
    InPageEditSectionLink();
    break;

  case 'oasis': //Fandom平台
    /*
    $('.page-header__contribution-buttons .wds-dropdown__content ul').append($('<li>').append($('<a>').addClass('in-page-edit-btn-link').attr('href', 'javascript:void(0)').text('快速编辑').click(function() {
    InPageEdit({
      page:mw.config.get('wgPageName'),
      summary:' //InPageEdit'
    })
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
    }).append('✎ <a class="in-page-edit-btn-link" href="javascript:void(0)" onclick="InPageEdit({page: \''+mw.config.get('wgPageName')+'\',summary: \' //InPageEdit\',reversion:'+params.oldid+'})">快速编辑</a>'));
    InPageEditSectionLink();
    console.error('[InPageEdit] 警告：未经优化的皮肤。');
  }

});
