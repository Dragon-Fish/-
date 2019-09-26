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
  // 开始执行任务
  $('body').addClass('action-in-page-edit');
  // Variables
  var origintext,
      inPageEditTarget = option.target,
      inPageEditReason = option.reason,
      inPageEditTags = option.tags,
      inPageEditRefresh = option.refresh;
  if (inPageEditTarget === undefined || inPageEditTarget === ''){inPageEditTarget = mw.config.get('wgPageName')}
  if (inPageEditReason === undefined || inPageEditReason === ''){inPageEditReason = ''}
  if (inPageEditRefresh === undefined || inPageEditRefresh == 'true' || inPageEditRefresh == '1'){inPageEditRefresh = true;}
  if (inPageEditTags === undefined || inPageEditTags === ''){inPageEditTags = 'in-page-edit'} else {inPageEditTags = 'in-page-edit|'+ inPageEditTags}

  new mw.Api().get({
    action: "parse",
    page: inPageEditTarget,
    prop: "wikitext",
    format: "json"
  }).then(function(data) {
    origintext = data.parse.wikitext['*'];
    ajaxArea()
  }).fail(function() {
    origintext = '<!-- ⚠警告:无法获取页面内容，新建页面请删除此行。 -->\n';
    ajaxArea()
  });
  function ajaxArea() {
    // Create area & hide article
    $('#mw-content-text').hide();
    $('#mw-content-text').before(
      '<div id="InPageEdit">' + 

      '<h1 id="edit-title">in-page-edit-title</h1>' + 
      '<textarea id="newcontent" style="width:100%;min-height:300px;max-height:1200px"></textarea>' + 

      '<div id="button-area">' +
      '<div id="normal"><button id="cancle-btn">取消</button> <button id="preview-btn">预览</button> <label><input type="checkbox" id="is-minor"/> 小编辑</label> <div style="float:right"><input id="reason" placeholder="编辑摘要" value="'+inPageEditReason+'"> <button id="submit-btn">提交</button></div></div>' + 

      '<center id="confirm" style="display:none;clear:both"><span id="code"></span><br/><button id="no">否</button> <button id="yes">是</button></center>' +

      '</div>' +

      '<center id="info-area" style="display:none;"></center>' +

      '<h1>预览</h1>' +
      '<div id="preview-area" style="padding:8px; border:2px dotted #aaa"></div>' + 

      '</div>'
    );
    $('#InPageEdit #newcontent').val(origintext);
    $('#InPageEdit #edit-title').html('正在编辑: ' + inPageEditTarget);

    // Cancle
    $('#InPageEdit #cancle-btn').click(function() {
      $('#InPageEdit #button-area #normal').hide();
      $('#InPageEdit #confirm').show(); $('#InPageEdit #confirm button').unbind();
      $('#InPageEdit #confirm #code').text('确认要取消吗？');
      $('#InPageEdit #confirm #no').click(function(){$('#InPageEdit #button-area #normal').show();$('#InPageEdit #confirm').hide();});
      $('#InPageEdit #confirm #yes').click(function(){
        $('body').removeClass('action-in-page-edit');
        $('#InPageEdit').remove();
        $('#mw-content-text').show();
      });
    });

    // Preview.
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
      $('#InPageEdit #confirm #code').text('确认要提交吗？');
      $('#InPageEdit #confirm #no').click(function(){$('#InPageEdit #button-area #normal').show();$('#InPageEdit #confirm').hide();});
      $('#InPageEdit #confirm #yes').click(function(){
        // Hide elements
        $('#InPageEdit #newcontent').attr('readonly','readonly');
        $('#InPageEdit #button-area').hide();
        $('#InPageEdit #info-area').show().html('<div style="font-weight:bold;color:green;min-height: 50px;line-height: 50px;font-size: 36px;">提交中&nbsp;<img src="https://wjghj.cn/images/9/98/Windows-loading.gif" style="height:36px;width:auto" /></div>');

        // Do post request
        var isMinor = $('#InPageEdit #is-minor').prop('checked');
        new mw.Api().post({
          action: 'edit',
          text: $('#InPageEdit #newcontent').val(),
          title: inPageEditTarget,
          minor: isMinor,
          tags: inPageEditTags,
          summary: $('#InPageEdit #reason').val(),
          token: mw.user.tokens.get('editToken')
        }).done(function() {
          $('#InPageEdit #info-area').html('<div style="font-weight:bold;color:green;min-height: 50px;line-height: 50px;font-size: 36px;">提交成功</div>');
          window.location.reload();
        }).fail(function(){
          // Show elements
          $('#InPageEdit #submit-btn').html('重试');
          $('#InPageEdit #newcontent').attr('readonly',false);
          $('#InPageEdit #button-area, #InPageEdit #button-area #normal').show();
          $('#InPageEdit #confirm').hide();
          Modal('<span class="error">Error post your request.</span>','InPageEdit Error');
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
    InPageEdit({target:mw.config.get('wgPageName'), reason:' //InPageEdit'})
  })));
});
/** Get links in ariticle **/
$(function() {
  var self = this;
  $('#mw-content-text a.external').each(function(i) {
    var url = $(this).attr('href');
    var reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
    var params = {},
    match;
    while (match = reg.exec(url)) {
      params[match[2]] = decodeURIComponent(match[3]);
    }
    if (params.action === 'edit' && params.title !== undefined && params.section !== 'new') {
      $(this).after($('<a>').attr({
        'href': 'javascript:void(0)',
        'class': 'in-page-edit-article-link'
      }).html('[快速编辑]').data({
        'target': decodeURIComponent(params.title),
        'number': params.section || -1
      }).click(function (){
        InPageEdit({target:params.title,tags:'in-page-edit-outer', reason:' //InPageEdit'})
      }));
    }
  });
});
/** Add special page **/
$(function() {
  $('.mw-special-Specialpages .mw-specialpages-list:nth-of-type(10) ul').append('<li><a href="/wiki/Special:空白页面/QuickEdit">快速编辑</a></li>');
  if (wgPageName === 'Speial:Quickedit' || wgPageName === 'Special:QuickEdit' || wgPageName === 'Special:快速编辑') {
    location.href = '/wiki/Special:空白页面/QuickEdit';
  } else if (wgPageName === 'Special:空白页面/QuickEdit' ) {
    $('title').text('Special:快速编辑 | 小鱼君和他的朋友们 | Wjghj Project');
    $('#firstHeading').text('进行快速编辑');
    $('#mw-content-text').before(
      '<br/><div id="inputArea"><input id="requestPage" /> <button id="requestBtn">加载</button> <button id="randomBtn">随机</button></div>'
    ).html('');
    $('#inputArea #randomBtn').click(function(){
      new mw.Api().get({
        action:'query',
        list:'random',
        rnnamespace:'0|4|14'
      }).done(function(data){
        $('#inputArea #requestPage').val(data.query.random[0].title);
      });
    });
    $('#inputArea #requestBtn').click(function(){
      var requestPage = $('#inputArea #requestPage').val();
      if (requestPage !== ''||requestPage !== undefined) {
        InPageEdit({target:requestPage,reason:' //InPageEdit',tags:'in-page-edit-editor|in-page-edit-outer'});
      }
    });
  }
});
