/**
 * MediaWiki JS Plugin: In Page Edit
 * Author: 机智的小鱼君
 * Url: https://github.com/Dragon-Fish/wjghj-wiki/Gadgets/in-page-edit
 * Description: Let you edit page without open new tab. And edit Navebox via navbar, edit section via section edit link etc.
 **/

function InPageEdit(inPageEditTarget,inPageEditSection) {

  if ($('#InPageEdit').length > 0) { // 只能存在一个窗口
    Modal('已经存在一个编辑任务！请先关闭现在的编辑窗口。', 'In page edit 错误');
  } else { // 开始执行任务
    // Variables
    if (inPageEditTarget == undefined) {
      inPageEditTarget = mw.config.get('wgPageName');
    }
    if (inPageEditSection == undefined) {
      inPageEditTarget = '';
    }
    var origintext;

    new mw.Api().get({
      action: "parse",
      page: inPageEditTarget,
      section: inPageEditSection,
      prop: "wikitext",
      format: "json"
    }).then(function(data) {
      origintext = data.parse.wikitext['*'];
      ajaxArea()
    }).fail(function() {
      origintext = '<!-- 注意: 无法获取页面内容。新建页面请删除此行 -->\n';
      ajaxArea()
    });
    function ajaxArea() {
      // Create area & hide article
      $('#mw-content-text').hide();
      $('#mw-content-text').before(
        '<div id="InPageEdit">' + 
        '<h1 id="edit-title">in-page-edit-title</h1>' + 
        '<textarea id="newcontent" style="width:100%;min-height:300px"></textarea>' + 
        '<button id="cancle-btn">取消</button> <button id="preview-btn">预览</button><div style="float:right"><input id="reason" placeholder="编辑摘要"> <button id="submit-btn">提交</button></div>' + 
        '<h1>预览</h1><div id="preview-area" style="padding:8px; border:2px dotted #aaa"></div>'+
        '</div>'
      );
      $('#InPageEdit #newcontent').val(origintext);
      $('#InPageEdit #edit-title').html('正在编辑: ' + inPageEditTarget);

      // Cancle
      $('#InPageEdit #cancle-btn').click(function() {
        var cancleconfirm = confirm('取消吗？');
        if (cancleconfirm) {
          $('#InPageEdit').remove();
          $('#mw-content-text').show();
        }
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
        var submitconfirm = confirm('提交吗？');
        if (submitconfirm) {
          new mw.Api().post({
            action: 'edit',
            text: $('#InPageEdit #newcontent').val(),
            title: inPageEditTarget,
            section: inPageEditSection,
            summary: '[InPageEdit] ' + $('#InPageEdit #reason').val(),
            token: mw.user.tokens.get('editToken')
          }).done(function() {
            $('#InPageEdit').html('<center style="font-weight:bold;color:green;min-height: 300px;line-height: 300px;font-size: 48px;">已提交</center>');
            window.location.reload();
          });
        }
      });
    }
  }
}
// Add button
$(function() {
  $('.action-view #p-userpagetools ul').append($('<li>').append($('<a>').attr('href', '#_InPageEdit').text('快速编辑').click(function() {
    InPageEdit()
  })));
});
// Get links in ariticle
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
        'class': 'in-page-edit-link-edit'
      }).html('<sup title="快速编辑">[编]<sup>').data({
        'target': decodeURIComponent(params.title),
        'number': params.section || -1
      }));
      $('.in-page-edit-link-edit').click(function() {
        InPageEdit(params.title,params.section)
      });
    }
  });
});
