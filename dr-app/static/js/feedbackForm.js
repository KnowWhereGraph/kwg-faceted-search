$('#myModalNorm').on('shown.bs.modal', function (e) {
  $("#inputUrl").val(window.location.href);
});

$('#feedback-form').submit(function (e) {
  e.preventDefault(); // Prevent Default Submission
  if (grecaptcha.getResponse(feedbackCaptchaContainer) != '') {
    $('#submitBtn').prop('disabled', true);
    var IDGenerator = function () {
      this.length = 8;
      this.timestamp = +new Date;
      var _getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      var ts = this.timestamp.toString();
      var parts = ts.split("").reverse();
      var id = "";
      for (var i = 0; i < this.length; ++i) {
        var index = _getRandomInt(0, parts.length - 1);
        id += parts[index];
      }
      return id;
    };
    var id = IDGenerator();
    var url = '<http://lod.fuzzyinsights.com/ldp/feedback/' + id + '>';

    // console.log('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX duv: <http://www.w3.org/ns/duv#> PREFIX schema: <http://schema.org/> insert data{ graph <LDPUserFeedback> { ' + url + ' rdf:type duv:UserFeedback . ' + url + ' schema:name "' + $('#inputName').val() + '" .' + url + ' schema:email "' + $('#inputEmail').val() + '" .' + url + ' duv:hasFeedback "' + $('#comments').val() + '" .' + url + ' duv:refersTo <' + $('#inputUrl').val() + '> .' + url + ' schema:about "' + $('#subject').val() + '"}}');

    $.ajax({
        url: 'http://lod.fuzzyinsights.com:3030/fuzzyinsights-beta/update',
        type: 'POST',
        data: {
          update: 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX duv: <http://www.w3.org/ns/duv#> PREFIX schema: <http://schema.org/> insert data{ graph <UserFeedback> { ' + url + ' rdf:type duv:UserFeedback . ' + url + ' schema:name "' + $('#inputName').val() + '" .' + url + ' schema:email "' + $('#inputEmail').val() + '" .' + url + ' duv:hasFeedback "' + $('#comments').val() + '" .' + url + ' duv:refersTo <' + $('#inputUrl').val() + '> .' + url + ' schema:about "' + $('#subject').val() + '"}}'
        }, // it will serialize the form data
      })
      .done(function (data) {
        var mailData = {
          name: $("#inputName").val(),
          email: $("#inputEmail").val(),
          subject: $("#subject").val(),
          url: $("#inputUrl").val(),
          comments: $('#comments').val()
        };
        $.ajax({
            type: "POST",
            url: "http://ld.iospress.nl/php/mail.php",
            data: mailData,
          })
          .done(function (data) {
            $('#myModalNorm').on('hidden.bs.modal', function (e) {
              $(this)
                .find("input[type=text], input[type=email], textarea, select")
                .val('')
                .end();
              grecaptcha.reset(feedbackCaptchaContainer);
            })
            $('#myModalNorm').modal('toggle');
            $('#submitBtn').prop('disabled', false);
            alert("Thanks for your feedback");
          })
          .fail(function () {
            $('#myModalNorm').on('hidden.bs.modal', function (e) {
              $(this)
                .find("input[type=text], input[type=email], textarea, select")
                .val('')
                .end();
              grecaptcha.reset(feedbackCaptchaContainer);
            })
            $('#myModalNorm').modal('toggle');
            $('#submitBtn').prop('disabled', false);
            alert("Thanks for your feedback");
          });
      })
      .fail(function () {
        alert('Form Submit Failed ...');
      });
  } else {
    alert("Please resolve the captcha and submit!");
  }
});

var correctCaptchaFeedback = function (response) {
  console.log(response);
  return response;
};

var downloadCaptchaResponse;
var correctCaptchaDownload = function (response) {
  console.log(response);
  var downloadCaptchaResponse = response;
};

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

$('#download-feedback-form').submit(function (e) {
  e.preventDefault(); // Prevent Default Submission
  grecaptcha.reset(downloadFeedbackCaptchaContainer);
  grecaptcha.execute(downloadFeedbackCaptchaContainer);
});

function downloadFeedbackFormSubmit() {
  $('#downloadFeedbackBtn').prop('disabled', true);
  var data = {
    "code": 5,
    "name": $("#downName").val(),
    "email": $("#downEmail").val(),
    "comments": $('#subset-comments').val()
  };
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
        comments: $('#subset-comments').val(),
        mailSubject: "LD Connect - download subset"
      };
      $.ajax({
          type: "POST",
          url: "http://ld.iospress.nl/php/mail.php",
          data: mailData,
        })
        .done(function (data) {
          $('#downName').val('');
          $('#downEmail').val('');
          $('#subset-comments').val('');
          $('#downloadFeedbackBtn').prop('disabled', false);
          $('#myModal').modal('toggle');
          alert("Thank you for your feedback");
        })
        .fail(function () {
          $('#downName').val('');
          $('#downEmail').val('');
          $('#subset-comments').val('');
          $('#downloadFeedbackBtn').prop('disabled', false);
          $('#myModal').modal('toggle');
          alert("Thank you for your feedback");
        });
    })
    .fail(function () {
      $('#downloadFeedbackBtn').prop('disabled', false);
      alert("Please try again later");
    });
}

$('#download-form').submit(function (e) {
  e.preventDefault();
  grecaptcha.reset(downloadCaptchaContainer);
  grecaptcha.execute(downloadCaptchaContainer);
});

function downloadSubFormSubmit() {
  $('#downloadBtn').prop('disabled', true);
  if ($("#download-options").val() == "TTL")
    var downloadOptions = "text/turtle";
  else if ($("#download-options").val() == "JSON")
    var downloadOptions = "application/sparql-results+json";

  var targetEntity = null;
  targetEntity = window.location.pathname; //params.targetEntity;

  console.log(targetEntity);

  var prefix = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  ";
  var URILink = "<" + configObject.baseURI + targetEntity + ">";
  console.log(URILink);
  var graphName = configObject.graph;
  if ($("#download-options").val() == "TTL") {
    var query = 'describe ' + URILink + '?p ?o ?ip { ' + URILink + ' ?p ?o . ?ip ?pre ' + URILink + ' }';
  } else {
    var query = prefix;
    var graphArray = graphName.split(",");
    query += "select distinct ?Property ?ip ?Value ?label  ";

    if (graphName.length > 1) {
      for (var i = 0; i < graphArray.length; i++) {
        query += " from <" + graphArray[i] + ">  ";
      }
    }
    query += "  {   { " + URILink + "  ?Property ?Value .  } union { ?Value ?ip " + URILink + " .  }  optional { ?Value rdfs:label ?label . }  }  order by ?Property ?Value LIMIT 1000";
  }
  console.log(query);
  var url = _SPARQL_endpoint + "?query=" + encodeURIComponent(query) + "&format=" + encodeURIComponent(downloadOptions) + "&timeout=3000&debug=on";
  console.log(url);
  if ($("#download-options").val() == "TTL") {
    $.ajax({
      url: url,
      type: 'GET',
      // dataType: 'jsonp',
      success: function (data, textStatus, xhr) {
        console.log(data);
        if (targetEntity == "")
          var fileName = "default";
        else
          var fileName = targetEntity;
        var dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(data);
        fileName += ".ttl";
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "sparql.ttl");
        dlAnchorElem.click();
      },
      error: function (xhr, textStatus, errorThrown) {

      }
    });
  } else if ($("#download-options").val() == "JSON") {
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'jsonp',
      success: function (data, textStatus, xhr) {
        // console.log(data.results.bindings);
        if (targetEntity == "")
          var fileName = "default";
        else
          var fileName = targetEntity;
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data.results.bindings));
        fileName += ".json";
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "sparql.json");
        dlAnchorElem.click();
      },
      error: function (xhr, textStatus, errorThrown) {

      }
    });
  }
  $('#downloadModalNorm').modal('toggle');
  $('#downloadBtn').prop('disabled', false);
  window.setTimeout(function () {
    $("#myModal").modal('show');
  }, 1000);
}