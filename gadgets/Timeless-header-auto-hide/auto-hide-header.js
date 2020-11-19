/** 自动神隐顶部条 **/
var lastScrollY = 0
window.onscroll = function () {
  //变化量可自行修改，使其在指定高度内滚动时不隐藏
  if (window.scrollY - lastScrollY > 0 && window.scrollY > 500) {
    //往下滚动，隐藏导航栏
    //-70px修改为 -导航栏高度px
    $('#mw-header-container,#mw-header-hack').addClass('header-hide')
    $('.notify').addClass('notify-hide')
  } else if (window.scrollY - lastScrollY < 0) {
    //往上滚动，显示导航栏（Safari会有BUG，尴尬）
    $('#mw-header-container,#mw-header-hack').removeClass('header-hide')
    $('.notify').removeClass('notify-hide')
  }
  lastScrollY = window.scrollY
}
