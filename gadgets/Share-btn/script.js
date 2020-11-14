mw.loader.using('jquery.cookie', function () {
  var config = mw.config.get();
  /* 分享按钮 */
  $('.action-view .firstHeading').after(
    '<div id="share-this-page">' +
    '<button id="shareQQ-btn">分享到QQ</button>' +
    '<button id="QR-btn">分享二维码</button>' +
    '<button id="purge-btn" title="强刷新(purge)">强刷新页面</button>' +
    '</div>'
  );
  /* 刷新按钮 */
  $('#purge-btn').click(function () {
    var $this = $(this);
    if ($.cookie('wasPerged') > 0) {
      $this.html('请求频率过高 (<span id="purge-btn_countdown">' + Math.floor(($.cookie('wasPerged') - new Date().getTime()) / 1000) + '</span>)').attr('disabled', 'disabled');
      var endTime = $.cookie('wasPerged');
      setInterval(function () {
        var timeleft = Math.floor((endTime - new Date().getTime()) / 1000);
        if (timeleft < 1) {
          $this.html('强刷新页面').attr('disabled', false);
          clearInterval();
        } else {
          $('#purge-btn_countdown').html(timeleft);
        }
      }, 1000);
    } else {
      $this.html('正在刷新&nbsp;<img src="https://vignette.wikia.nocookie.net/dftest/images/8/8c/Ms-loading-spinner.svg" style="height:14px;width:auto" />').attr('disabled', 'disabled');
      // 设置30秒cd
      mw.loader.using(['jquery.cookie'], function () {
        var timeLeft = new Date();
        timeLeft.setTime(timeLeft.getTime() + 30 * 1000);
        $.cookie('wasPerged', new Date().getTime() + (30 * 1000), {
          expires: timeLeft
        });
      });
      new mw.Api().post({
        action: 'purge',
        titles: config.wgPageName,
      }).done(function () {
        $this.html('刷新成功!');
        window.location.reload();
      }).fail(function () {
        $this.html('刷新失败，请重试').attr('disabled', false);
      });
    }
  });
  /* QQ空间 */
  $('#shareQQ-btn').click(function () {
    //ZONE
    var zoneurl = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https://wjghj.cn/index.php/' + config.wgPageName + '&sharesource=qzone&title=【' + config.wgPageName + '】-来自小鱼君和他的朋友们&summary=快来看看机智的小鱼君和他的朋友们的故事吧&pics=https://wjghj.cn/images/www/b/bc/Wiki.png';
    //FRIEND
    var friendurl = 'http://connect.qq.com/widget/shareqq/index.html?url=https://wjghj.cn/index.php/' + config.wgPageName + '&sharesource=qzone&title=【' + config.wgPageName + '】-来自小鱼君和他的朋友们&summary=快来看看机智的小鱼君和他的朋友们的故事吧&pics=https://wjghj.cn/images/www/b/bc/Wiki.png';
    ssi_modal.show({
      sizeClass: 'dialog',
      className: 'centerbox',
      center: 1,
      content:
        '<div style="text-align: center; display: grid; grid-template-columns: 50% 50%">' +
        '<div><a href="' + friendurl + '" target="_blank"><img src="/images/www/9/97/Qq_logo.png" style="height:50px;width:50px;border-radius:50%;border:1px solid gray;"></a></div>' +
        '<div><a href="' + zoneurl + '" target="_blank"><img style="height:50px;width:50px;border-radius:50%;border:1px solid orange;" src="/images/www/b/b8/Qzone_logo.png"></a></div>' +
        '<div><a href="' + friendurl + '" target="_blank">分享给好友</a></div>' +
        '<a href="' + zoneurl + '" target="_blank">分享到空间</a></div>' +
        '</div>',
      title: '分享到QQ'
    });
  });
  /* 二维码 */
  $('#QR-btn').click(function () {
    var QRurl = 'https://api.qrserver.com/v1/create-qr-code/?color=Fl000000&bgcolor=FFFFFF&data=https://wjghj.cn/' + config.wgPageName + '&qzone=1&margin=0&size=150x150';
    var QRimg = '<img id="QR-code" src="' + QRurl + '"  alt="二维码服务检索失败！" style="width:150px;height:150px"/>';
    ssi_modal.show({
      sizeClass: 'dialog',
      className: 'centerbox',
      center: 1,
      content:
        '<center>' +
        QRimg +
        '<div>扫描或长按保存，然后分享给你的小伙伴吧！<br/><span style="color:gray;font-size:70%;">你也可以<a href="' + QRurl + '" target="_blank">直接下载</a>二维码</span></div>' +
        '</center>',
      title: '分享本页二维码'
    });
  });
});
/**
 * @name Short URL
 * @author 机智的小鱼君
 * 
 * @description Get the "fake" short link provided by MediaWiki.
 *              Solve the very long link of the pages that name contain non-ASCII words.
 */
!(function () {
  window.shortUrl = window.shortUrl || '';
  // 缓存 mw 变量
  var config = mw.config.get();
  // 判断是否存在文章ID
  if (config.wgArticleId > 0) {
    shortUrl = config.wgServer + '/-/' + config.wgArticleId;
    // 在文章后插入段落
    $('#firstHeading').after(
      $('<div>', { class: 'shortUrl-block' }).append(
        $('<span>', { class: 'shortUrl-description' }).append(
          $('<span>', { text: '您还可以通过此链接分享页面：' }),
          $('<strong>', { text: shortUrl + ' ' }),
          $('<a>', { text: '复制', href: 'javascript:;' }).click(function () {
            // 创建 input 元素，选中复制，然后销毁
            var $this = $(this),
              surlInput = $('<input>', { id: 'shortUrl-copy', value: shortUrl, style: 'z-index: -1; opacity: 0; position: absolute; left: -200vw;', readonly: 'readonly' });
            $this.append(surlInput);
            surlInput.select();
            document.execCommand('copy');
            surlInput.remove();
            $this.text('已复制！');
            setTimeout(function () {
              $this.text('复制');
            }, 1500);
          })
        )
      )
    );
  }
  // 将短链接替换进文章
  $('.shortUrl').text(shortUrl);
  $('.shortUrl-link').html(
    $('<a>', { href: shortUrl, text: shortUrl })
  );
}());
