/**
 * WikiaUpload小工具
 * 从万界规划局 https://wjghj.fandom.com 快速转存图片
 **/
$(function() {
  var FileName;
  $('.page-Special_上传文件 #mw-content-text').prepend('<div id="wikiaupload"><h2>从Fandom获取文件</h2><center id="input-area"><input id="filename-input" rows="1" placeholder="请输入文件名"></center><hr/><center id="button-area"> <button id="openfile-btn">从Wikia获取文件</button> <button id="preview-btn">预览</button> </center><center id="preview-area"></center></div><h2>文件上传表格</h2>');
  if ($('#wpDestFile').val() !== '' || $('#wpDestFile').val() !== undefined) {
    $('#filename-input').val($('#wpDestFile').val());
    FileName = $('#wpDestFile').val();
  }
  $('#wikiaupload #filename-input').keyup(function() {
    FileName = $('#wikiaupload #filename-input').val();
  });
  $('#openfile-btn').click(function() {
    if (FileName === '' || FileName === undefined) {
      return;
    } else {
      window.open("https://wjghj.wikia.com/wiki/Special:Filepath/" + encodeURIComponent(FileName) );
    }
  });
  $('#wikiaupload #preview-btn').click(function() {
    if (FileName === '' || FileName === undefined) {
      return;
    } else {
      $('#wikiaupload #preview-area').html('<div id="inset"><span id="close-btn">[<a href="#PoweredByDF" onclick="$(\'#wikiaupload #preview-area #inset\').remove()">关闭预览</a>]</span><img id="preview-img" src="https://wjghj.wikia.com/wiki/Special:Filepath/' + FileName + '"/><br clear=both /><span id="preview-filename">正在预览: ' + FileName + '</span></div>');
      $('#wikiaupload #preview-area #preview-img').load(function(){
        $('#wikiaupload #preview-area #preview-img').css('background','#fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAGElEQVQYV2N4DwX/oYBhgARgDJjEAAkAAEC99wFuu0VFAAAAAElFTkSuQmCC) repeat')
      });
    }
  });
  $('#wpSourceTypeurl').click(function() {
    if (FileName === '' || FileName === undefined) {
      return;
    } else {
      $('#wpUploadFileURL').val('https://wjghj.wikia.com/wiki/Special:Filepath/' + encodeURIComponent(FileName) );
    }
  });
});
