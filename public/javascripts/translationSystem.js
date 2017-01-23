$(document).ready(function () {
  if (mode === 'view') {
    $('.ui.form .input').addClass('transparent');
    setSystemDescription(translationSystem);
  }
  $('.ui.dropdown').dropdown();
  $('#createSystem, #saveSystem').on('click', function () {
    var params = getSystemDescription();
    var url = params.system_id ? '/translationSystem/update' : '/translationSystem/create';
    $.post(url, params)
    .success(function (response) {
      try {
        response = JSON.parse(response);
      } catch (e) {
        console.log('Unable to parse server response', e);
      }
      if (response.error) {
        console.log(response.error);
      } else {
        window.location = '/translationSystem/view/' + response.data._id;
      }
    })
    .fail(function (err) {
      console.log(err, err.stack);
    });
  });

  $('#deleteSystem').on('click', function () {
    //TODO - modal confirmation
    var url = '/translationSystem/delete/' + translationSystem._id;
    $.post(url)
    .done(function (result) {
      if (!result.error) {
        window.location = '/'; // redirect to home with confirmation message
      }
    })
    .fail(function (err) {
      console.log(err.trace);
    });
  });

  $('#editSystem').on('click', function () {
    window.location = '/translationSystem/edit/' + translationSystem._id;
  });

  // Customize file input
  $(document).on('change', ':file[name=file]', function () {
    var input = $(this);
    var fileName = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    var $form = $(this).closest('form');
    input.trigger('fileselect', [fileName, $form]);
  });
  $(':file[name=file]').on('fileselect', function (e, fileName, $form) {
    var $selectOutput = $form.find('.selectOutput');
    var $uploadOutput = $form.find('.uploadOutput');
    $uploadOutput.find('.fileName').text(fileName);
    $selectOutput.hide();
    $uploadOutput.show();
  });
  $('.selectOutput').on('click', function () {
    var fileId = $(this).attr('data-fileId');
    $(':file[data-fileId="' + fileId + '"]').trigger('click');
  });

  // Upload output
  $('.uploadOutput').on('click', function () {
    $(this).closest('form').submit();
  });

  // Remove output
  $('#deleteOutput').on('click', function () {
    // TODO - modal confirmation
    var url = '/testOutput/delete/' + $(this).attr('data-testOutputId');
    $.get(url)
    .success(function (response) {
      try {
        response = JSON.parse(response);
      } catch (e) {
        console.log('Unable to parse server response', e);
      }
      if (response.error) {
        console.log(response.error);
      } else {
        location.reload();
      }
    })
    .fail(function (err) {
      console.log(err);
    });
  });

  // Download source
  $('#getSource').on('click', function () {
    var fileId = $(this).attr('data-fileId');
    var downloadPage = window.open('/download/' + fileId);
  });
});

function getSystemDescription () {
  var description = {};
  $('.ui.form input, .ui.form textarea').each(function (i, input) {
    description[$(input).attr('name')] = $(input).val();
  });
  return description;
}

function setSystemDescription (description) {
  $('.ui.form input, .ui.form textarea').each(function (i, input) {
    var field = $(input).attr('name');
    $(input).val(description[field] || '');
    $(input).attr('placeholder', '');
    $(input).attr('disabled', true);
  });
}