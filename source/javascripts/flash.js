var trans = {
  animation: {
    show: 'slide down',
    hide: 'slide up'
  },
  duration: {
    show: 750,
    hide: 250
  }
};

$(document).ready(function () {
  // Handle close flash message button
  $('.message .close.icon').on('click', function () {
    var $container = $(this).closest('.message');
    $container.transition({
      duration: '1s',
      animation: 'slide down',
      onComplete: function () {
        $container.find('.content').empty();
      }
    });
  });
  $('.message .close.icon').on('keypress', function (e) {
    if (e.which === 13 || e.which === 32) {
      e.preventDefault();
      $(e.target).trigger('click');
    }
  });
  // Show flash messages
  for (var level in messages) {
    if (messages.hasOwnProperty(level)) {
      flash(level, messages[level]);
    }
  }
});

function flash (level, text) {
  var $visibleMessages = $('.alert .message:visible');
  var hidden = 0;
  if ($visibleMessages.length) {
    // Hide all shown messages
    $.each($visibleMessages, function () {
      $(this).transition({
        duration: trans.duration.hide,
        animation: trans.animation.hide,
        onComplete: function () {
          hidden++;
          if (hidden === $visibleMessages.length) {
            showMessage(level, text);
          }
        }
      });
    });
  } else {
    showMessage(level, text);
  }
  function showMessage (level, text) {
    var $container = $('.alert').find('.' + level);
    if (text) {
      $container.find('.content').html(text);
      $container.transition({
        duration: trans.duration.show,
        animation: trans.animation.show
      });
    } else {
      $container.find('.content').empty();
    }
  }
}
