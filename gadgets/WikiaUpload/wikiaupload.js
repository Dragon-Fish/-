/**
 * WikiaUpload小工具
 * 从万界规划局 https://wjghj.fandom.com 快速转存图片
 **/
$(function () {
  // Variables
  var FileName

  $('.page-Special_上传文件 #mw-content-text').prepend(
    '<div id="wikiaupload"><h2>从Fandom获取文件</h2><center id="input-area"><input id="filename-input" rows="1" placeholder="请输入文件名"></center><hr/><center id="button-area"> <button id="openfile-btn">从Fandom获取文件</button> <button id="preview-btn">预览</button> </center><center id="preview-area"></center></div><h2>文件上传表格</h2>'
  )

  // Check if default file name exist
  if ($('#wpDestFile').val() !== '' || $('#wpDestFile').val() !== undefined) {
    $('#filename-input').val($('#wpDestFile').val())
    FileName = $('#wpDestFile').val()
  }

  // Refresh when input
  $('#wikiaupload #filename-input').keyup(function () {
    FileName = $('#wikiaupload #filename-input').val()
  })

  // Open file btn
  $('#openfile-btn').click(function () {
    if (FileName === '' || FileName === undefined) {
      return
    } else {
      window.open('https://wjghj.fandom.com/wiki/Special:Filepath/' + encodeURIComponent(FileName))
    }
  })

  // Preview btn
  $('#wikiaupload #preview-btn').click(function () {
    if (FileName === '' || FileName === undefined) {
      return
    } else {
      $('#wikiaupload #preview-area').html(
        '<div id="inset"><span id="close-btn">[<a href="#PoweredByDF" onclick="$(\'#wikiaupload #preview-area #inset\').remove()">关闭预览</a>]</span><img id="preview-img" src="https://wjghj.fandom.com/wiki/Special:Filepath/' +
          FileName +
          '"/><br clear=both /><span id="preview-filename">正在预览: ' +
          FileName +
          '<img id="loading-icon" src="https://wjghj.cn/images/4/4d/Windows_loading.gif"/></span></div>'
      )
      $('#wikiaupload #preview-area #preview-img')
        .load(function () {
          // If image exist
          $('#wikiaupload #preview-area #preview-img').css({
            background: '#fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAGElEQVQYV2N4DwX/oYBhgARgDJjEAAkAAEC99wFuu0VFAAAAAElFTkSuQmCC) repeat',
            'border-bottom': '4px solid #1c840f',
          })
          $('#wikiaupload #preview-area #loading-icon').attr('src', '/images/c/c9/Yes_check.svg.png').delay(1500).hide(500)
        })
        .error(function () {
          // If not
          $('#wikiaupload #preview-area #preview-img').attr('src', '/images/7/71/Help.jpeg').css({ 'border-bottom': '4px solid #e11212' }).unbind()
          $('#wikiaupload #preview-area #preview-filename')
            .html('加载出错: ' + FileName + ' 可能不存在<img id="error-icon" src="/images/6/60/X_mark.png"/>')
            .css({ color: '#b00', 'font-weight': 'bold' })
        })
    }
  })

  // Auto input image url
  $('#wpSourceTypeurl').click(function () {
    if (FileName === '' || FileName === undefined) {
      return
    } else {
      $('#wpUploadFileURL').val('https://wjghj.fandom.com/wiki/Special:Filepath/' + encodeURIComponent(FileName))
    }
  })
})
