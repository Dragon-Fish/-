/** Custom Modal**/
function Modal(content,title) {
  PopupWindow(content,title);
}
function PopupWindow(content,title) {
  if (title != '' && title != undefined) {
    title = '<h2 id="popup-window-title">' + title + '</h2>';
  } else {
    title = '';
  }
  if (content == undefined || content == '') {
    title = '<h2 id="popup-window-title" class="error"> Error in Popup Window </h2>';
    content = 'No content!';
  }
  $('body').append(
  '<div id="popup-window-bg"></div>' +
  '<div id="popup-window">' +
  title +
  '<div id="popup-window-content">' +
  content +
  '</div><div id="popup-window-close">' +
  '<img id="btn"/>'+
  '</div></div>'
);
  $('#popup-window, #popup-window-bg').fadeIn(300);
  $('#popup-window-close #btn, #popup-window-bg').click(function(){
    $('#popup-window, #popup-window-bg').fadeOut(400);
    setTimeout(function(){$('#popup-window, #popup-window-bg').remove()},400);
  });
}
