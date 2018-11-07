/* 分享按钮 */
$('.action-view .firstHeading').after(
  '<input id="shareQQ-btn" type=button value="分享到QQ"></input>'+
  '<input id="QR-btn" type=button value="分享二维码"></input>'+
  '<input id="purge-btn" type=button title="强刷新(purge)" value="强刷新页面"></input>'
);
/* 刷新按钮 */
$('#purge-btn').on('click',function(){location.href='/index.php/'+wgPageName+'?action=purge';});
/* QQ空间 */
$('#shareQQ-btn').on('click',function(){
  $('#QR-share').remove();
//ZONE
  var zoneurl='https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=http://119.29.217.143/index.php/'+wgPageName+'&sharesource=qzone&title=【'+wgPageName+'】-来自小鱼君和他的朋友们&summary=快来看看机智的小鱼君和他的朋友们的故事吧&pics=http://119.29.217.143/images/b/bc/Wiki.png';
//FRIEND
  var friendurl='http://connect.qq.com/widget/shareqq/index.html?url=http://119.29.217.143/index.php/'+wgPageName+'&sharesource=qzone&title=【'+wgPageName+'】-来自小鱼君和他的朋友们&summary=快来看看机智的小鱼君和他的朋友们的故事吧&pics=http://119.29.217.143/images/b/bc/Wiki.png';

  $('body').prepend(
    '<div id="QQ-share"><center>'+
    '<a href="'+friendurl+'" target="_blank"><img src="https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=ee16e0189f45d688a302b5a29cf91a23/2934349b033b5bb5e40109d53bd3d539b700bcc2.jpg" style="height:45px;width:40px;"></a>'+
    '<a href="'+zoneurl+'" target="_blank"><img style="height:50px;width:50px;border-radius: 50%;" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3866407262,272464914&amp;fm=26&amp;gp=0.jpg"></a>'+
    '<br clear="all">'+
    '<a href="'+friendurl+'" target="_blank">分享给好友</a> | <a href="'+zoneurl+'" target="_blank">分享到空间</a>'+
    '<br style="clear:both;"/><a id="QQshare-close"><img src="/images/thumb/8/8b/Close-icon.png/36px-Close-icon.png"/></a>'+
    '</center></div>'
  );
  $('#QQshare-close').on('click',function(){$('#QQ-share').remove();});
});

/* 二维码 */
var QRimg='<img id="QR-code" src="http://qr.liantu.com/api.php?text=http://119.29.217.143/index.php/'+wgPageName+'"  alt="二维码加载失败…这不是小鱼君的错，一定是二维码支持网站出问题了！"/>';
var QRurl='http://qr.liantu.com/api.php?text=http://119.29.217.143/index.php/'+wgPageName;$('#QR-btn').on('click',function(){
  $('#QQ-share').remove();
  $('body').prepend(
    '<div id="QR-share"><center>'+
    QRimg +
    '<div>扫描或长按保存，然后分享给你的小伙伴吧！<br/><span style="color:gray;font-size:70%;">你也可以<a href="'+QRurl+'" target="_blank">直接下载</a>二维码</span></div>'+
    '<a id="QR-close"><img src="/images/thumb/8/8b/Close-icon.png/36px-Close-icon.png"/></a>'+
    '</center></div>'
  );
  $('#QR-close').on('click',function(){$('#QR-share').remove();});
});
