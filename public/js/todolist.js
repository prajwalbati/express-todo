
$(function() {

  $('input[type=checkbox]').on('click', function () {
    let parentForm = $(this).parents('form');
    parentForm.submit();
  })

});