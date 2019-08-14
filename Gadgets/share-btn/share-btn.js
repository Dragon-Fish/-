/* 分享按钮 */
$('.action-view .firstHeading').after(
  '<div id="share-this-page">'+
  '<input id="shareQQ-btn" type=button value="分享到QQ"></input>'+
  '<input id="QR-btn" type=button value="分享二维码"></input>'+
  '<input id="purge-btn" type=button title="强刷新(purge)" value="强刷新页面"></input>'+
  '</div>'
);
/* 刷新按钮 */
$('#purge-btn').on('click',function(){location.href='/index.php/'+wgPageName+'?action=purge';});
/* QQ空间 */
$('#shareQQ-btn').on('click',function(){
//ZONE
  var zoneurl='https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https://wjghj.cn/index.php/'+wgPageName+'&sharesource=qzone&title=【'+wgPageName+'】-来自小鱼君和他的朋友们&summary=快来看看机智的小鱼君和他的朋友们的故事吧&pics=https://wjghj.cn/images/b/bc/Wiki.png';
//FRIEND
  var friendurl='http://connect.qq.com/widget/shareqq/index.html?url=https://wjghj.cn/index.php/'+wgPageName+'&sharesource=qzone&title=【'+wgPageName+'】-来自小鱼君和他的朋友们&summary=快来看看机智的小鱼君和他的朋友们的故事吧&pics=https://wjghj.cn/images/b/bc/Wiki.png';

  $('body').prepend(
    '<div style="z-index:500;background:rgba(255,255,255,0.5);position:fixed;width:100%;height:100%" id="share-bg"></div>'+
    '<div id="QQ-share" style="z-index:505"><center>'+
    '<a href="'+friendurl+'" target="_blank"><img src="/images/9/97/Qq_logo.png" style="height:50px;width:50px;border-radius:50%;border:1px solid gray;"></a>'+
    '<a href="'+zoneurl+'" target="_blank"><img style="height:50px;width:50px;border-radius:50%;border:1px solid orange;" src="/images/b/b8/Qzone_logo.png"></a>'+
    '<br clear="all">'+
    '<a href="'+friendurl+'" target="_blank">分享给好友</a> | <a href="'+zoneurl+'" target="_blank">分享到空间</a>'+
    '<br style="clear:both;"/><a id="QQshare-close"><img src="/images/thumb/8/8b/Close-icon.png/36px-Close-icon.png"/></a>'+
    '</center></div>'
  );
  $('#QQshare-close,#share-bg').on('click',function(){$('#QQ-share,#share-bg').remove();});
});

/* 二维码 */
var QRimg='<img id="QR-code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wjghj.cn/wiki/'+wgPageName+'"  alt="二维码服务检索失败！"/>';
var QRurl='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wjghj.cn/wiki/'+wgPageName;$('#QR-btn').on('click',function(){
  $('body').prepend(
    '<div style="z-index:500;background:rgba(255,255,255,0.5);position:fixed;width:100%;height:100%" id="share-bg"></div>'+
    '<div id="QR-share"><center>'+
    QRimg +
    '<div>扫描或长按保存，然后分享给你的小伙伴吧！<br/><span style="color:gray;font-size:70%;">你也可以<a href="'+QRurl+'" target="_blank">直接下载</a>二维码</span></div>'+
    '<a id="QR-close"><img src="/images/thumb/8/8b/Close-icon.png/36px-Close-icon.png"/></a>'+
    '</center></div>'
  );
  $('#QR-close,#share-bg').on('click',function(){$('#QR-share,#share-bg').remove();});
});
