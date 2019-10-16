/**
 *『Wjghj Project Static』
 * This _JavaScript_ code is from https://common.wjghj.cn
 * CC BY-NC-SA
 **/
/** Modal plugin **/
mw.loader.load('https://common.wjghj.cn/js/SsiModal');

/** Main **/
function InPageEdit(option) {

  // Variables
  if (option === undefined) option = {};
  var editPage = decodeURIComponent(option.page),
      editSection = option.section,
      editReversion = option.reversion,
      editText,
      editSummary = option.summary,
      editMinor = $('#editMinor').prop('checked'),
      jsonGet = {},
      jsonPost = {};

  if (editPage === undefined) {return;}
  if (editReversion !== undefined && editReversion !== '') {
    // 开发中！
  } else {
    if (editSection !== undefined && editSection !== '') {
      jsonGet = {
        action: 'parse',
        page: editPage,
        section: editSection,
        prop: 'wikitext',
        format: 'json'
      }
      jsonPost = {
        action: 'edit',
        title: editPage,
        section: editSection,
        text: $('#editArea').val(),
        minor: editMinor,
        token: mw.user.tokens.get('editToken')
      }
    } else {
      jsonGet = {
        action: 'parse',
        page: editPage,
        prop: 'wikitext',
        format: 'json'
      }
      jsonPost = {
        action: 'edit',
        title: editPage,
        section: editSection,
        text: $('#editArea').val(),
        minor: editMinor,
        token: mw.user.tokens.get('editToken')
      }
    }
  }

  // Show modal
  ssi_modal.show({
    title: '<span style="font-style:normal;">正在编辑：<u id="editPage">'+editPage+'</u></span>',
    content: '<textarea id="editArea" style="max-width:100%;min-width:100%;min-height:350px" disabled="">正在加载……</textarea><label>摘要：<input id="editSummary"/></label><br/><label><input id="editMinor" type="checkbox" style="margin-left:0;margin-right:4px"/>小编辑</label>',
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
            var text = $('#editArea').val();
            postArticle(text,editPage);
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
  
  function postArticle(text,page){
    new mw.Api().post(jsonPost).then(function(data){
      ssi_modal.show({content:'成功，正在刷新页面。'});
      window.location.reload();
    }).fail(function(data){
      ssi_modal.notify('error',{position: 'right top',title:'警告',content:'发生未知错误。'});
    });
  }
  
}

/** 初始化，添加按钮 **/
$(function() {
  if (wgIsArticle === false) {
    console.info('[InPageEdit] Not article page, plugin shut down.');
    return;
  }

  if ($('.skin-timeless').length > 0) {
    $('.action-view #p-userpagetools ul, #p-views .mw-portlet-body ul').append($('<li>').append($('<a>').addClass('in-page-edit-btn-link').attr('href', 'javascript:void(0)').text('快速编辑').click(function() {
      InPageEdit({
        page: mw.config.get('wgPageName'),
        summary: ' //InPageEdit'
      })
    })));
  } else if ($('.skin-oasis').length > 0) {
/*
    $('.page-header__contribution-buttons .wds-dropdown__content ul').append($('<li>').append($('<a>').addClass('in-page-edit-btn-link').attr('href', 'javascript:void(0)').text('快速编辑').click(function() {
    InPageEdit({
      page:mw.config.get('wgPageName'),
      summary:' //InPageEdit'
    })
  })));
 */
    new BannerNotification( '注意，当前版本InPageEdit扩展在Fandom平台有严重兼容性问题。<br/>目前不建议在Fandom使用，后续的支持计划请暂定于Fandom社区统一计划(UCP)完成后。' , 'warn').show();
    console.error('[InPageEdit] 警告：暂不支持的平台。');
  } else {
    $('body').append($('<div>').css({
      'position': 'fixed',
      'bottom': '12px',
      'right': '-4pxpx',
      'background': 'white',
      'box-shadow': '0 0 5px gray',
      'border-radius': '2px',
      'padding': '4px 20px 4px 4px'
    }).append($('✎ <a class="in-page-edit-btn-link" href="javascript:void(0)" onclick="InPageEdit({page: mw.config.get(\'wgPageName\'),summary: \' //InPageEdit\'})">快速编辑</a>')));
    console.error('[InPageEdit] 警告：未经优化的皮肤。');
  }
});
/** 获取段落编辑以及编辑链接 **/
$(function() {
  if ($('.skin-oasis').length > 0) {return;}
  $('#mw-content-text a:not(.new)').each(function(i) {
    if ($(this).attr('href') === undefined) return;
    var url = $(this).attr('href');
        params = {};
    var vars = url.split('?').pop().split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      params[pair[0]] = pair[1];
    }
 
    // Not edit link of this wiki
    if (url.split('/')['2'] !== location.href.split('/')['2'] && url.substr(0, 1)!=='/') return;
    // Not url start with 'index.php?title=FOO'
    if (params.title === undefined) params.title = url.split('com/').pop().split('?')['0'];
    if (params.section === undefined) params.section = 'none';

    var target = params.title,
        section = params.section;
 
    if (params.action === 'edit' && target !== undefined && section !== 'new') {
      $(this).after(
        $('<a>',{
          'href': 'javascript:void(0)',
          'class': 'in-page-edit-article-link'
        })
        .text('快速编辑')
        .click(function (){
          if (section === 'none') {
            InPageEdit({page:target, summary:' //InPageEdit'});
          } else {
            InPageEdit({page:target, summary:' //InPageEdit - Section'+section});
          }
        }
      ));
    }
  });
  $('.mw-editsection .in-page-edit-article-link').before(' | ');
  $('.in-page-edit-article-link:not(.mw-editsection)').before('[').after(']');
});
