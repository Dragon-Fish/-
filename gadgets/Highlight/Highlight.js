/**
 * @name highlight.js
 * @description 为页面内的代码块提供语法高亮
 */
!(function () {
  // 为代码页面添加 class
  var pageName = mw.config.get('wgPageName')
  if (pageName.substr(pageName.length - 3, 3) === '.js') {
    $('#mw-content-text pre').addClass('lang-js highlight linenums')
  } else if (pageName.substr(pageName.length - 4, 4) === '.css') {
    $('#mw-content-text pre').addClass('lang-css highlight linenums')
  } else if (mw.config.get('wgNamespaceNumber') === 828) {
    // Lua
    $('#mw-content-text pre').addClass('lang-lua highlight linenums')
  }

  $('pre.prettyprint').addClass('highlight').removeClass('prettyprint')

  // 加载主题
  mw.loader.load('https://cdn.jsdelivr.net/npm/highlight.js@9.12.0/styles/solarized-light.css', 'text/css')

  // 加载脚本
  $.ajax({
    url: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.3.1/build/highlight.min.js',
    dataType: 'script',
    cache: true,
  }).then(function () {
    // 初始化高亮
    $('#mw-content-text pre.highlight, #mw-content-text pre.prettyprint').each(function (_, block) {
      var $block = $(block)

      // 高亮当前块
      if ($block.attr('data-hljs') !== 'done') {
        hljs.highlightBlock(block)
        $block.attr('data-hljs', 'done')
      }

      // 行号显示
      if ($block.data('line-from') !== undefined || $block.data('line-ping') !== undefined) $block.addClass('linenums')
      if ($block.hasClass('linenums')) {
        // 起始行号
        var lineNumFrom = Number($block.data('line-from'))
        if (isNaN(lineNumFrom) || lineNumFrom < 1) lineNumFrom = 1
        lineNumFrom = Number(lineNumFrom.toFixed(0))

        // 高亮行号
        var pingLine = $block.data('line-emphatic') || $block.data('line-ping')
        if (typeof pingLine === 'number') pingLine = [pingLine]
        if (typeof pingLine === 'string') pingLine = pingLine.replace(/\s/g, '').split(',')
        if (typeof pingLine !== 'object') pingLine = []

        $block.html(function () {
          // 创建 jQuery 对象
          var $html = $('<div>', { class: 'line-container' }).append($('<div>', { class: 'line-content' }), $('<div>', { class: 'line-numbers' }))

          // 拆开每一行
          var splitHtml = $(this).html().split('\n')
          $.each(splitHtml, function (lineNum, lineContent) {
            // 防止最后一行后被添加一行空行
            if (lineNum + 1 === splitHtml.length) return

            // 显示行号为起始行号加当前行号
            displayLineNum = lineNum + lineNumFrom

            // 是否高亮显示
            var isPing = ''
            if (pingLine.includes(lineNum + 1)) {
              isPing = ' line-ping'
            }

            // 添加行号
            $html.find('.line-numbers').append($('<div>', { class: 'line-number-block' + isPing, text: displayLineNum }))

            // 添加内容
            $html.find('.line-content').append($('<div>', { class: 'line-row' + isPing, html: lineContent }))
          })

          return $html
        })
      }
    })
  })
})()
