$(function(){
/* 分享按钮 */
$('.action-view .firstHeading').after(
  '<div id="share-this-page">'+
  '<button id="shareQQ-btn">分享到QQ</button>'+
  '<button id="QR-btn">分享二维码</button>'+
  '<button id="purge-btn" title="强刷新(purge)">强刷新页面</button>'+
  '</div>'
);
/* 刷新按钮 */
$('#purge-btn').click(function(){location.href='/index.php?title='+wgPageName+'&action=purge';});
/* QQ空间 */
$('#shareQQ-btn').click(function(){
//ZONE
  var zoneurl='https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https://wjghj.cn/index.php/'+wgPageName+'&sharesource=qzone&title=【'+wgPageName+'】-来自小鱼君和他的朋友们&summary=快来看看机智的小鱼君和他的朋友们的故事吧&pics=https://wjghj.cn/images/b/bc/Wiki.png';
//FRIEND
  var friendurl='http://connect.qq.com/widget/shareqq/index.html?url=https://wjghj.cn/index.php/'+wgPageName+'&sharesource=qzone&title=【'+wgPageName+'】-来自小鱼君和他的朋友们&summary=快来看看机智的小鱼君和他的朋友们的故事吧&pics=https://wjghj.cn/images/b/bc/Wiki.png';

  Modal(
    '<center>'+
    '<a href="'+friendurl+'" target="_blank"><img src="/images/9/97/Qq_logo.png" style="height:50px;width:50px;border-radius:50%;border:1px solid gray;"></a>'+
    '<a href="'+zoneurl+'" target="_blank"><img style="height:50px;width:50px;border-radius:50%;border:1px solid orange;" src="/images/b/b8/Qzone_logo.png"></a>'+
    '<br clear="all">'+
    '<a href="'+friendurl+'" target="_blank">分享给好友</a> | <a href="'+zoneurl+'" target="_blank">分享到空间</a>'+
    '</center>'
  ,'分享到QQ');
});

/* 二维码 */
$('#QR-btn').click(function(){
  var QRimg='<img id="QR-code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wjghj.cn/wiki/'+wgPageName+'"  alt="二维码服务检索失败！"/>';
  var QRurl='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wjghj.cn/wiki/'+wgPageName;$('#QR-btn').on('click',function(){
  Modal(
    '<center>'+
    QRimg +
    '<div>扫描或长按保存，然后分享给你的小伙伴吧！<br/><span style="color:gray;font-size:70%;">你也可以<a href="'+QRurl+'" target="_blank">直接下载</a>二维码</span></div>'+
    '</center>'
  ,'分享本页二维码');
});
});
