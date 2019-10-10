/**
 * MediaWiki JS Plugin: In Page Edit
 * Author: 机智的小鱼君
 * Url: https://github.com/Dragon-Fish/wjghj-wiki/edit/master/Gadgets/in-page-edit
 * Description: Let you edit page without open new tab. And edit Navebox via navbar, edit section via section edit link etc.
 **/

function InPageEdit(option) {
  // 只能存在一个窗口
  if ($('#InPageEdit').length > 0) {
    $('#InPageEdit').remove();
  }

  // Variables
  var origintext,
      inPageEditTarget = option.target,
      inPageEditSection = option.section,
      inPageEditReason = option.reason,
      inPageEditTags = option.tags,
      inPageEditRefresh = option.refresh;
  if (inPageEditTarget === undefined || inPageEditTarget === ''){inPageEditTarget = mw.config.get('wgPageName')}else{inPageEditTarget = decodeURIComponent(inPageEditTarget)}
  if (inPageEditSection === undefined || inPageEditSection === ''){inPageEditSection = 'none'}
  if (inPageEditReason === undefined || inPageEditReason === ''){inPageEditReason = ''}
  if (inPageEditRefresh === undefined || inPageEditRefresh == 'true' || inPageEditRefresh == '1'){inPageEditRefresh = true;}
  if (inPageEditTags === undefined || inPageEditTags === ''){inPageEditTags = ''}

  // Debug
  console.info('[InPageEdit]\n'+'ninPageEditTarget = ' + inPageEditTarget + '\n' + 'inPageEditSection = ' + inPageEditSection + '\n' + 'inPageEditReason = ' + inPageEditReason + '\n' + 'inPageEditTags = ' + inPageEditTags + '\n' + 'inPageEditRefresh = ' + inPageEditRefresh);

  // 开始执行任务
  $('body').addClass('action-in-page-edit');
  // Create area
  Modal(
  '<div id="InPageEdit">' +
  '<textarea id="newcontent" style="width:100%;min-height:300px;max-height:1200px"></textarea>' +

  '<div id="button-area">' + '<div id="normal"><button id="cancle-btn">取消</button> <button id="preview-btn">预览</button> <label><input type="checkbox" id="is-minor"/> 小编辑</label> <div style="float:right"><input id="reason" placeholder="编辑摘要"> <button id="submit-btn">提交</button></div></div>' +

  '<center id="confirm" style="display:none;clear:both"><span id="code"></span><br/><button id="no">否</button> <button id="yes">是</button></center>' +

  '</div>' +

  '<center id="info-area" style="display:none;"></center>' +

  '<h1>预览</h1>' + '<div id="preview-area" style="padding:8px; border:2px dotted #aaa"></div>' +

  '</div>','<span id="inPageEdit-edit-title">inPageEditTitlePlaceholder</span>',{closeBtn:false});
  $('#popup-window-bg').unbind();

  if (inPageEditSection === 'none') {
    varGet = {
      action: "parse",
      page: inPageEditTarget,
      prop: "wikitext",
      format: "json"
    }
    Section = ''
  } else {
    varGet = {
      action: "parse",
      page: inPageEditTarget,
      section: inPageEditSection,
      prop: "wikitext",
      format: "json"
    }
    Section = '#'+inPageEditSection
  }
 
  new mw.Api().get(varGet).then(function(data) {
    origintext = data.parse.wikitext['*'];
    ajaxArea()
  }).fail(function() {
    origintext = '<!-- ⚠ 警告：无法获取页面内容，新建页面请删除此行。 -->\n';
    console.error('[InPageEdit] Can’t get page content.');
    ajaxArea()
  });
  function ajaxArea() {

    $('#InPageEdit #reason').val(inPageEditReason);
    $('#InPageEdit #newcontent').val(origintext);
    $('#inPageEdit-edit-title').html('正在编辑：' + decodeURIComponent(inPageEditTarget)+Section);
 
    // Cancle
    $('#InPageEdit #cancle-btn').click(function() {
      $('#InPageEdit #button-area #normal').hide();
      $('#InPageEdit #confirm').show(); $('#InPageEdit #confirm button').unbind();
      $('#InPageEdit #confirm #code').text('确定取消编辑？');
      $('#InPageEdit #confirm #no').click(function(){$('#InPageEdit #button-area #normal').show();$('#InPageEdit #confirm').hide();});
      $('#InPageEdit #confirm #yes').click(function(){
        $('body').removeClass('action-in-page-edit');
        $('#popup-window-bg, #popup-window').remove();
      });
    });
 
    // Preview
    $('#InPageEdit #preview-btn').click(function() {
      new mw.Api().post({
        action: "parse",
        text: $('#InPageEdit #newcontent').val(),
        prop: "text",
        preview: true,
        format: "json"
      }).then(function(data) {
        var previewcontent = data.parse.text['*'];
 
        $('#InPageEdit #preview-area').html(previewcontent);
      });
    });
 
    // Submit
    $('#InPageEdit #submit-btn').click(function() {
      $('#InPageEdit #button-area #normal').hide();
      $('#InPageEdit #confirm').show(); $('#InPageEdit #confirm button').unbind();
      $('#InPageEdit #confirm #code').text('确定发布编辑？');
      $('#InPageEdit #confirm #no').click(function(){$('#InPageEdit #button-area #normal').show();$('#InPageEdit #confirm').hide();});
      $('#InPageEdit #confirm #yes').click(function(){
        // Hide elements
        $('#InPageEdit #newcontent').attr('readonly','readonly');
        $('#InPageEdit #button-area').hide();
        $('#InPageEdit #info-area').show().html('正在提交&nbsp;<span id="spinner"></span>');
 
        // Do post request
        var isMinor = $('#InPageEdit #is-minor').prop('checked');
        if (inPageEditSection === 'none') {
          varSubmit = {
            action: 'edit',
            text: $('#InPageEdit #newcontent').val(),
            title: inPageEditTarget,
            minor: isMinor,
            tags: inPageEditTags,
            summary: $('#InPageEdit #reason').val(),
            token: mw.user.tokens.get('editToken')
          }
        } else {
          varSubmit = {
            action: 'edit',
            text: $('#InPageEdit #newcontent').val(),
            title: inPageEditTarget,
            section: inPageEditSection,
            minor: isMinor,
            tags: inPageEditTags,
            summary: $('#InPageEdit #reason').val(),
            token: mw.user.tokens.get('editToken')
          }
        }
        new mw.Api().post(varSubmit).done(function() {
          $('#InPageEdit #info-area').html('发布成功');
          window.location.reload();
        }).fail(function(){
          // Show elements
          $('#InPageEdit #submit-btn').html('Retry');
          $('#InPageEdit #newcontent').attr('readonly',false);
          $('#InPageEdit #button-area, #InPageEdit #button-area #normal').show();
          $('#InPageEdit #confirm').hide();
          alert('InPageEdit: Error post your request.');
          $('#InPageEdit #info-area').hide().html('');
        });
      });
    });
  }
}
 
/** Add button **/
$(function() {
  if (wgIsArticle === false) {
    console.info('[InPageEdit] Not article page, plugin shut down.');
    return;
  }
  $('.action-view #p-userpagetools ul, #p-views .mw-portlet-body ul').append($('<li>').append($('<a>').addClass('in-page-edit-btn-link').attr('href', 'javascript:void(0)').text('快速编辑').click(function() {
    InPageEdit({target:mw.config.get('wgPageName'), reason:' //InPageEdit', tags:'in-page-edit'})
  })));
});
/** Get links in ariticle **/
$(function() {
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
            InPageEdit({target:target, reason:' //InPageEdit', tags:'in-page-edit|in-page-edit-outer'});
          } else {
            InPageEdit({target:target, reason:' //InPageEdit - Section'+section, section: section, tags:'in-page-edit|in-page-edit-outer'});
          }
        }
      ));
    }
  });
  $('.mw-editsection .in-page-edit-article-link').before(' | ');
  $('.in-page-edit-article-link:not(.mw-editsection)').before('[').after(']');
});
