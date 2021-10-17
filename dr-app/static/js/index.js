window.onload = function () {
  document.getElementById('open-menu').addEventListener("click", showMenu, false);

  function showMenu() {
    console.log("menu");
    var menu = document.getElementById('menu');
    menu.classList.toggle('show');
  }
}

// Iterate over each select element
$('#subject').each(function () {

  // Cache the number of options
  var $this = $(this),
    numberOfOptions = $(this).children('option').length;

  // Hides the select element
  $this.addClass('s-hidden');

  // Wrap the select element in a div
  $this.wrap('<div class="select" style="margin-top: 0"></div>');

  // Insert a styled div to sit over the top of the hidden select element
  $this.after('<div class="styledSelect" id="stylSelect" style="width: 100%; font-size: 13px; text-transform: initial"></div>');

  // Cache the styled div
  var $styledSelect = $this.next('div.styledSelect');

  // Show the first select option in the styled div
  $styledSelect.text($this.children('option').eq(0).text());

  // Insert an unordered list after the styled div and also cache the list
  var $list = $('<ul />', {
    'class': 'options'
  }).insertAfter($styledSelect);

  // Insert a list item into the unordered list for each select option
  for (var i = 0; i < numberOfOptions; i++) {
    $('<li />', {
      text: $this.children('option').eq(i).text(),
      rel: $this.children('option').eq(i).val()
    }).appendTo($list);
  }

  // Cache the list items
  var $listItems = $list.children('li');

  // Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
  $styledSelect.click(function (e) {
    e.stopPropagation();
    console.log("click function");
    $('div.styledSelect.active').each(function () {
      $(this).removeClass('active').next('ul.options').hide();
    });
    $(this).toggleClass('active').next('ul.options').toggle();
  });

  // Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
  // Updates the select element to have the value of the equivalent option
  $listItems.click(function (e) {
    e.stopPropagation();
    $styledSelect.text($(this).text()).removeClass('active');
    $this.val($(this).attr('rel'));
    $list.hide();
    /* alert($this.val()); Uncomment this for demonstration! */
  });

  // Hides the unordered list when clicking outside of it
  $(document).click(function () {
    $styledSelect.removeClass('active');
    $list.hide();
  });

});

$('.form-container label').each(function () {
  var getTitle = $(this).html();
  $(this).parent().find('input').attr('placeholder', getTitle)

});

function downloadEmbeddings(option) {
  window.location = 'php/downloadEmbeddings.php?doc2vec=' + option;
  window.setTimeout(function () {
    $("#myModalNorm").modal('show');
    $("#embed-type").val(option);
  }, 2000);
}

$('#download-embeddings-form').submit(function (e) {
  e.preventDefault(); // Prevent Default Submission
  grecaptcha.reset(downloadEmbedCaptchaContainer);
  grecaptcha.execute(downloadEmbedCaptchaContainer);
});

function downloadEmbedFormSubmit() {
  $('#downloadEmbeddingsBtn').prop('disabled', true);
  var option = $("#embed-type").val().replace("IOS-", "");
  option = option.replace(".zip", "");
  var data = {
    "code": 4,
    "name": $("#downEmbedName").val(),
    "email": $("#downEmbedEmail").val(),
    "comments": $('#embed-comments').val(),
    "type": option
  };
  $.ajax({
      url: 'https://script.google.com/macros/s/AKfycbxMcDeQUnDJ924GLBm9myzpQsRSD49HHmJKPm6nhKMr_naSaqRN/exec',
      type: 'POST',
      crossDomain: true,
      data: JSON.stringify(data)
    })
    .done(function (data) {
      console.log($("#embed-type").val());
      var mailData = {
        name: $("#downEmbedName").val(),
        email: $("#downEmbedEmail").val(),
        comments: $('#embed-comments').val(),
        mailSubject: "LD Connect - " + option
      };
      $.ajax({
          type: "POST",
          url: "http://ld.iospress.nl/php/mail.php",
          data: mailData,
        })
        .done(function (data) {
          $('#downEmbedName').val('');
          $('#downEmbedEmail').val('');
          $('#embed-comments').val('');
          $('#downloadEmbeddingsBtn').prop('disabled', false);
          $('#myModalNorm').modal('toggle');
          alert("Thank you for your feedback");
        })
        .fail(function () {
          $('#downEmbedName').val('');
          $('#downEmbedEmail').val('');
          $('#embed-comments').val('');
          $('#downloadEmbeddingsBtn').prop('disabled', false);
          $('#myModalNorm').modal('toggle');
          alert("Thank you for your feedback");
        });
    }).fail(function () {
      $('#downloadEmbeddingsBtn').prop('disabled', false);
      alert("Please try again later");
    });
}

function downloadDataset() {
  window.location = 'php/downloadDataset.php?access=true';
  window.setTimeout(function () {
    $("#myModal").modal('show');
  }, 2000);
}

$('#download-form').submit(function (e) {
  e.preventDefault(); // Prevent Default Submission
  grecaptcha.reset(downloadDataCaptchaContainer);
  grecaptcha.execute(downloadDataCaptchaContainer);
});

function downloadDataFormSubmit() {
  $('#downloadDatasetBtn').prop('disabled', true);
  var data = {
    "code": 3,
    "name": $("#downName").val(),
    "email": $("#downEmail").val(),
    "comments": $('#dataset-comments').val()
  }
  $.ajax({
      url: 'https://script.google.com/macros/s/AKfycbxMcDeQUnDJ924GLBm9myzpQsRSD49HHmJKPm6nhKMr_naSaqRN/exec',
      type: 'POST',
      crossDomain: true,
      data: JSON.stringify(data)
    })
    .done(function (data) {
      var mailData = {
        name: $("#downName").val(),
        email: $("#downEmail").val(),
        comments: $('#dataset-comments').val(),
        mailSubject: "LD Connect - download dataset"
      };
      $.ajax({
          type: "POST",
          url: "http://ld.iospress.nl/php/mail.php",
          data: mailData,
        })
        .done(function (data) {
          $('#downName').val('');
          $('#downEmail').val('');
          $('#dataset-comments').val('');
          $('#downloadDatasetBtn').prop('disabled', false);
          $('#myModal').modal('toggle');
          alert("Thank you for your feedback");
        })
        .fail(function () {
          $('#downName').val('');
          $('#downEmail').val('');
          $('#dataset-comments').val('');
          $('#downloadDatasetBtn').prop('disabled', false);
          $('#myModal').modal('toggle');
          alert("Thank you for your feedback");
        });
    })
    .fail(function () {
      $('#downloadDatasetBtn').prop('disabled', false);
      alert("Please try again later");
    });
}

$('#stay-informed-form').submit(function (e) {
  e.preventDefault(); // Prevent Default Submission
  grecaptcha.reset(stayInformedCaptchaContainer);
  grecaptcha.execute(stayInformedCaptchaContainer);
});

function stayInformedFormSubmit() {
  console.log('stay informed');
  console.log($('#stayInformedEmail').val());
  $('#stayInformedBtn').prop('disabled', true);
  var email = encodeURIComponent($('#stayInformedEmail').val());
  $.ajax({
      url: 'https://script.google.com/macros/s/AKfycbxMcDeQUnDJ924GLBm9myzpQsRSD49HHmJKPm6nhKMr_naSaqRN/exec?email=' + email,
      type: 'GET',
      crossDomain: true,
      // dataType: 'jsonp',

    })
    .done(function (data) {
      var mailData = {
        email: $("#stayInformedEmail").val(),
        mailSubject: "LD Connect - stay informed"
      };
      $.ajax({
          type: "POST",
          url: "http://ld.iospress.nl/php/mail.php",
          data: mailData,
        })
        .done(function (data) {
          $('#stayInformedBtn').prop('disabled', false);
          $('#stayInformedEmail').val('');
          alert("Thank you, we will keep you informed.");
        })
        .fail(function () {
          $('#stayInformedBtn').prop('disabled', false);
          $('#stayInformedEmail').val('');
          alert("Thank you, we will keep you informed.");
        });
    })
    .fail(function () {
      $('#stayInformedBtn').prop('disabled', false);
      $('#stayInformedEmail').val('');
      alert("Please try again later");
    });
}

$('#more').click(function () {
  $('#myModalNorm').modal('hide');
  $('body').removeClass().removeAttr('style');
  $('.modal-backdrop').remove();
});

$('#moreInfo').click(function () {
  $('#myModal').modal('hide');
  $('body').removeClass().removeAttr('style');
  $('.modal-backdrop').remove();
});

$('#feedback-form').submit(function (e) {
  e.preventDefault(); // Prevent Default Submission
  grecaptcha.reset(feedbackCaptchaContainer);
  grecaptcha.execute(feedbackCaptchaContainer);
});

function feedbackFormSubmit() {
  $('#submitBtn').prop('disabled', true);
  var subject = $('#stylSelect').html() == 'SUBJECT' ? '' : $('#stylSelect').html();
  var data = {
    "code": 2,
    "name": $("#inputName").val(),
    "email": $("#inputEmail").val(),
    "subject": subject,
    "comments": $('#feedback-comments').val()
  };
  $.ajax({
      url: 'https://script.google.com/macros/s/AKfycbxMcDeQUnDJ924GLBm9myzpQsRSD49HHmJKPm6nhKMr_naSaqRN/exec',
      type: 'POST',
      crossDomain: true,
      data: JSON.stringify(data)
    })
    .done(function (data) {
      var mailData = {
        name: $("#inputName").val(),
        email: $("#inputEmail").val(),
        subject: subject,
        comments: $('#feedback-comments').val(),
        mailSubject: "LD Connect - Feeback"
      };
      $.ajax({
          type: "POST",
          url: "http://ld.iospress.nl/php/mail.php",
          data: mailData,
        })
        .done(function (data) {
          $('#inputName').val('');
          $('#inputEmail').val('');
          $('#subject').val('');
          $('textarea').val('')
          grecaptcha.reset(feedbackCaptchaContainer);
          $('#submitBtn').prop('disabled', false);
          alert("Thank you for your feedback");
        })
        .fail(function () {
          $('#inputName').val('');
          $('#inputEmail').val('');
          $('#subject').val('');
          $('textarea').val('')
          grecaptcha.reset(feedbackCaptchaContainer);
          $('#submitBtn').prop('disabled', false);
          alert("Thank you for your feedback");
        });
    })
    .fail(function () {
      grecaptcha.reset(feedbackCaptchaContainer);
      $('#submitBtn').prop('disabled', false);
      alert("Please try again later");
    });
}