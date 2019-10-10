/** 
 * Custom Modal
 * Author: 机智的小鱼君
 * https://github.com/Dragon-Fish/wjghj-wiki/blob/master/Gadgets/CustomModal/script.js
**/
function PopupWindow(content,title,settings) {
  PopupWindow(content,title,settings);
}
function closeModal(id){
  var target;
  if (id === undefined) {
    target = $('.customModal, .customModal-bg');
  } else {
    target = $('.customModal[data-modalid="'+id+'"], .customModal-bg[data-modalid="'+id+'"]');
  }
  target.fadeOut(400);
  setTimeout(function(){target.remove()},400);
}
function Modal(content,title,settings) {
  var closeBtn = '<div class="customModal-close"><img class="close-modal" data-action="closeModal" src="https://wjghj.cn/images/d/d0/Close-btn.png"/></div>';

  if (settings !== undefined) {
    if (settings.closeBtn == false) {
      closeBtn = '';
    }
    if (settings.addClass !== undefined) {
      addClass = settings.addClass;
    }
  }

  if (title != '' && title != undefined) {
    title = '<h2 class="customModal-title">' + title + '</h2>';
  } else {
    title = '';
  }
  if (content == undefined || content == '') {
    title = '<h2 class="customModal-title" class="error"> Error in Popup Window </h2>';
    content = 'No content!';
  }

  var modalId = new Date().getTime();
  $('body').append(
  '<div class="customModal-bg" data-modalid="'+ modalId + '"></div>' +
  '<div class="customModal" data-modalid="'+ modalId + '">' +
  '<div id="dragArea" style="width: 100%; text-align: center; color:white; background: gray; height:18px; user-select: none;"><span class="m-icons">drag_handle</span></div>'+
  closeBtn+
  title +
  '<div class="customModal-content">' +
  content +
  '</div>'+
  '</div>'
);
  $('.customModal, .customModal-bg').fadeIn(300);
  $('.customModal').css({
    'position': 'absolute',
    'top': $(window).scrollTop()+120
    'z-index': $(this).attr()
  });
  $('.customModal [data-action="closeModal"]').attr('data-modalid',modalId);
  $('.customModal-bg, .customModal [data-action="closeModal"]').click(function(){closeModal($(this).attr('data-modalid'))});
  if (settings !== undefined) {
    if (settings.disableBg !== undefined && settings.disableBg === true) {
      $('.customModal-bg').unbind();
    }
  }

  // Dragable
  function bindDragging(e) {
    var element = $(this);
    var baseX = e.clientX;
    var baseY = e.clientY;
    var baseOffsetX = element.parent().offset().left;
    var baseOffsetY = element.parent().offset().top;
    $(document).mousemove(function(e) {
      element.parent().css({
        'left': baseOffsetX + e.clientX - baseX,
        'top': baseOffsetY + e.clientY - baseY
      });
    });
    $(document).mouseup(function() {
      $(document).unbind('mousemove');
      $(document).unbind('mouseup');
      bindDragging(element);
    });
  };
  if (settings !== undefined) {
    if (settings.disableDrag === true) {
      $('.customModal #dragArea').remove();
    } else {
      $('.customModal #dragArea').mousedown(bindDragging);
    }
  } else {
    $('.customModal #dragArea').mousedown(bindDragging);
  }

}
