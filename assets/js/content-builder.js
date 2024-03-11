"use strict";

(function ($) {
  $(document).ready(function () {
    // Enable and disable input fields and buttons
    function handleInput(inputElement, elementsToDisable) {
      if (!inputElement) return;
      var $inputElement = $(inputElement);
      var $elementsToDisable = $(elementsToDisable);
      $inputElement.on("input", function () {
        $elementsToDisable.prop("disabled", this.value === "");
      }).trigger("input");
      if (!$elementsToDisable.length) return;
      var initialValue = $inputElement.val();
      $elementsToDisable.prop("disabled", initialValue === "");
      if (initialValue) return;
      $inputElement.one("input", function () {
        $elementsToDisable.prop("disabled", this.value === "");
      });
    }
    function showErrorPopup(errorMessage) {
      if (!errorMessage) {
        errorMessage = "There may be issues with the server or internet connection, or it's possible that an incorrect API Key has ben specified";
      } else {
        errorMessage = $.parseJSON(errorMessage).message;
      }
      $('.server-error').addClass('active');
      $('.server-error .response-message .section-description').html(errorMessage);
    }
    handleInput($("#topic-message")[0], ".button-post-reset, .button-post-message");
    handleInput($("#topic-bulk-message")[0], ".button-bulk-post-message, .button-post-reset, .dependent-fields");
    handleInput($("#post-title")[0], ".dependent-fields, .button-post-reset");
    handleInput($("#post-content")[0], ".button-create-post");
    $(".button-post-reset").on("click", function () {
      $(".dependent-fields").prop("disabled", true);
      $(".button-post-message").prop("disabled", true);
    });

    //Get params for generate post
    var request = null;
    var responseData;
    var responseContentReceived = false;
    var countdown;
    var count;
    var generate_button;
    var model_temperature = $("#model-temperature").val();
    var is_button_post_message_clicked = false;
    var language_model = $("#language-model-select").val();
    $(".button-abort").on("click", function (event) {
      event.preventDefault();
      if (request != null) {
        request.abort();
        request = null;
      }
      $('.server-error').removeClass('active');
      ai_buddy_request_clear();
    });
    $(".button-post-sample").on("click", function (event) {
      event.preventDefault();
      var sample = $(this).data("sample");
      $("#topic-message").val(sample);
      if ($("#topic-message").val()) {
        $(".button-post-reset").removeAttr("disabled");
        $(".button-post-message").removeAttr("disabled");
      } else {
        $(".button-post-reset").attr("disabled", true);
        $(".button-post-message").attr("disabled", true);
      }
    });
    $('.button-post-message').on('click', function (event) {
      generate_button = $(".button-post-message").data("id");
      is_button_post_message_clicked = false;
      event.preventDefault();
      if (request != null) {
        request.abort();
        request = null;
      }
      var button = $(this);
      var progress = 6;
      var title_key = $("#topic-message").val();
      var post_language = $("#select-language").val();
      var post_style = $("#select-style").val();
      var post_tone = $("#select-tone").val();
      var keywords = $('#ai-buddy-content-keywords').val();
      var model_temperature = $("#model-temperature").val();
      var language_model = $("#language-model-select").val();
      var prompt_title_template = $("#prompt-title-template").val();
      var prompt_title_text = prompt_title_template.replace('{TOPIC}', title_key).replace('{LANGUAGE}', post_language).replace('{WRITING_STYLE}', post_style).replace('{WRITING_TONE}', post_tone);
      if (keywords) {
        prompt_title_text = prompt_title_text + ' keywords of the content will be: ' + keywords;
      }
      var data_section = {
        button_id: generate_button,
        messages: [{
          "role": "user",
          "content": prompt_title_text
        }],
        model: language_model,
        max_tokens: 512,
        temperature: 0.6
      };
      request = $.ajax({
        method: "POST",
        url: ai_buddy_content_builder.api_url,
        data: JSON.stringify(data_section),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', ai_buddy_content_builder.nonce);
          ai_buddy_request_count(button, progress);
        },
        success: function success(response) {
          $(button).closest(".section-content").find(".progress-bar").css("width", "100%");
          setTimeout(function () {
            ai_buddy_request_clear();
            if (response.completions) {
              var postTitle = response.completions.trim();
              postTitle = postTitle.replaceAll('"', '');
              $("#post-title").val(postTitle);

              // Determine the class of the button that was clicked
              if (generate_button === 'button-post-message') {
                $('html, body').animate({
                  scrollTop: $('#post-section-box').offset().top - 190
                }, 1000);
                $('.button-post-section').eq(0).click();
              }
            }
          }, 300);
        },
        error: function error(xhr, status, _error) {
          showErrorPopup(xhr.responseText);
          ai_buddy_request_clear();
        }
      });
    });
    $('.button-post-section').on('click', function (event) {
      event.preventDefault();
      if (request != null) {
        request.abort();
        request = null;
      }
      var button = $(this);
      var progress = 6;
      var title_key = $("#post-title").val();
      var post_language = $("#select-language").val();
      var post_style = $("#select-style").val();
      var post_tone = $("#select-tone").val();
      var count_post_section = $("#count-post-section").val();
      var keywords = $('#ai-buddy-content-keywords').val();
      var model_temperature = $("#model-temperature").val();
      var language_model = $("#language-model-select").val();
      if ($("#post-title").val()) {
        $(".dependent-fields").removeAttr("disabled");
      } else {
        $(".dependent-fields").attr("disabled", true);
      }
      var prompt_section_template = $("#prompt-section-template").val();
      var prompt_section_text = prompt_section_template.replace('{SECTIONS_COUNT}', count_post_section).replace('{TITLE}', title_key).replace('{LANGUAGE}', post_language).replace('{WRITING_STYLE}', post_style).replace('{WRITING_TONE}', post_tone);
      if (keywords) {
        prompt_section_text = prompt_section_text + ' keywords of the content will be: ' + keywords;
      }
      var data_section = {
        button_id: generate_button,
        messages: [{
          "role": "user",
          "content": prompt_section_text
        }],
        model: language_model,
        max_tokens: 512,
        temperature: model_temperature
      };
      request = $.ajax({
        method: "POST",
        url: ai_buddy_content_builder.api_url,
        data: JSON.stringify(data_section),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', ai_buddy_content_builder.nonce);
          ai_buddy_request_count(button, progress);
        },
        success: function success(response) {
          $(button).closest(".section-content").find(".progress-bar").css("width", "100%");
          setTimeout(function () {
            ai_buddy_request_clear();
            if (response.completions) {
              $("#post-section").val(response.completions.trim());
              responseData = response.completions;

              // Determine the class of the button that was clicked
              if (!is_button_post_message_clicked) {
                if (generate_button === 'button-post-message') {
                  $('html, body').animate({
                    scrollTop: $('#post-content-box').offset().top - 50
                  }, 1000);
                  $('.button-content-button').eq(0).click();
                }
              }
            }
          }, 300);
        },
        error: function error(xhr, status, _error2) {
          showErrorPopup(xhr.responseText);
          ai_buddy_request_clear();
        }
      });
    });
    $('.button-content-button').on("click", function (event) {
      event.preventDefault();
      if (request != null) {
        request.abort();
        request = null;
      }
      var button = $(this);
      var progress = 30;
      var post_section = $("#post-section").val();
      if (!post_section) {
        alert("Completing the \"Section\" part is required for content generation.");
        return;
      }
      var title_key = $("#post-title").val();
      var post_language = $("#select-language").val();
      var post_sections = $("#post-section").val();
      var post_style = $("#select-style").val();
      var post_tone = $("#select-tone").val();
      var count_post_content = $("#count-post-content").val();
      var keywords = $('#ai-buddy-content-keywords').val();
      var keywordsBold = $('#ai-buddy-make-keywords-bold');
      var model_temperature = $("#model-temperature").val();
      var language_model = $("#language-model-select").val();
      if ($("#post-title").val()) {
        $(".dependent-fields").removeAttr("disabled");
      } else {
        $(".dependent-fields").attr("disabled", true);
      }
      var prompt_content_template = $("#prompt-content-template").val();
      var prompt_content_text = prompt_content_template.replace('{PARAGRAPHS_COUNT}', count_post_content).replace('{TITLE}', title_key).replace('{LANGUAGE}', post_language).replace('{SECTIONS}', post_sections).replace('{WRITING_STYLE}', post_style).replace('{WRITING_TONE}', post_tone);
      if (keywords) {
        if (keywordsBold.is(':checked')) {
          prompt_content_text = prompt_content_text + ' keywords of the content will be: ' + keywords + '. Important: do not use bold for any word in the content.';
        } else {
          prompt_content_text = prompt_content_text + ' keywords of the content will be: ' + keywords;
        }
      }
      var data_content = {
        messages: [{
          "role": "user",
          "content": prompt_content_text
        }],
        model: language_model,
        max_tokens: $('.model-max-tokens').val(),
        temperature: model_temperature
      };
      $.ajax({
        method: "POST",
        url: ai_buddy_content_builder.api_url,
        data: JSON.stringify(data_content),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', ai_buddy_content_builder.nonce);
          ai_buddy_request_count(button, progress);
        },
        success: function success(response) {
          $(button).closest(".section-content").find(".progress-bar").css("width", "100%");
          setTimeout(function () {
            ai_buddy_request_clear();
            if (response.completions) {
              var response_completions = response.completions;
              response_completions = response_completions.replace(/===INTRO:|===OUTRO:/gi, "").trim();
              response_completions = response_completions.replace(/\n===|===/gi, "").trim();
              if (keywords) {
                if (keywordsBold.is(':checked')) {
                  keywords.split(",").sort(function (a, b) {
                    return a.length - b.length;
                  }).forEach(function (keyword) {
                    keyword = keyword.trim();
                    response_completions = response_completions.replace(new RegExp(keyword, 'gi'), function (match) {
                      return "**" + match + "**";
                    });
                  });
                }
              }
              $("#post-content").val(response_completions);
              responseContentReceived = true;
              var textarea_value = $('#post-content').val();
              if (textarea_value.trim() !== '') {
                $('.button-create-post').removeAttr('disabled');
              } else {
                $('.button-create-post').attr('disabled', 'disabled');
              }

              // Determine the class of the button that was clicked
              if (!is_button_post_message_clicked) {
                if (generate_button === 'button-post-message' && responseContentReceived === true) {
                  $('html, body').animate({
                    scrollTop: $('#post-excerpt-box').offset().top
                  }, 1000);
                  $('.button-excerpt-button').eq(0).click();
                }
              }
            }
          }, 300);
        },
        error: function error(xhr, status, _error3) {
          showErrorPopup(xhr.responseText);
          ai_buddy_request_clear();
        }
      });
    });
    $('.button-excerpt-button').on("click", function (event) {
      event.preventDefault();
      if (request != null) {
        request.abort();
        request = null;
      }
      var button = $(this);
      var progress = 4;
      var title_key = $("#post-title").val();
      var post_language = $("#select-language").val();
      var post_style = $("#select-style").val();
      var post_tone = $("#select-tone").val();
      var keywords = $('#ai-buddy-content-keywords').val();
      var model_temperature = $("#model-temperature").val();
      var language_model = $("#language-model-select").val();
      var prompt_excerpt_template = $("#prompt-excerpt-template").val();
      var prompt_excerpt_text = prompt_excerpt_template.replace('{TITLE}', title_key).replace('{LANGUAGE}', post_language).replace('{WRITING_STYLE}', post_style).replace('{WRITING_TONE}', post_tone);
      if (keywords) {
        prompt_excerpt_text = prompt_excerpt_text + ' keywords of the content will be: ' + keywords;
      }
      var data_excerpt = {
        messages: [{
          "role": "user",
          "content": prompt_excerpt_text
        }],
        model: language_model,
        max_tokens: 512,
        temperature: model_temperature
      };
      $.ajax({
        method: "POST",
        url: ai_buddy_content_builder.api_url,
        data: JSON.stringify(data_excerpt),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', ai_buddy_content_builder.nonce);
          ai_buddy_request_count(button, progress);
        },
        success: function success(response) {
          $(button).closest(".section-content").find(".progress-bar").css("width", "100%");
          setTimeout(function () {
            ai_buddy_request_clear();
            if (response.completions) {
              $("#post-excerpt").val(response.completions.trim());

              // Determine the class of the button that was clicked
              if (!is_button_post_message_clicked) {
                if (generate_button === 'button-post-message') {
                  $('html, body').animate({
                    scrollTop: $('#post-message-box').offset().top - 50
                  }, 1000);
                  is_button_post_message_clicked = true;
                }
              }
            } else {}
          }, 300);
        },
        error: function error(xhr, status, _error4) {
          showErrorPopup(xhr.responseText);
          ai_buddy_request_clear();
        }
      });
    });

    //Start Counter
    function ai_buddy_request_count(button, progress) {
      $(button).closest(".section-content").find(".drop-down-box-wrapper").hide();
      $(button).closest(".section-content").find(".running-generation").show();
      var count = 0;
      var totalTime = progress;
      $(button).closest(".section-content").find(".running-generation-count").text("00:00");
      countdown = setInterval(function () {
        count++;
        var minutes = Math.floor(count / 60);
        var seconds = count % 60;
        $(button).closest(".section-content").find(".running-generation-count").text((minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds));
        $(button).closest(".section-content").find(".progress-bar").css("width", count / totalTime * 100 + "%");
        if (count === 0) {
          clearInterval(countdown);
        }
      }, 1000);
    }
    //Stop Counter
    function ai_buddy_request_clear() {
      clearInterval(countdown);
      count = 0;
      $(".running-generation").hide();
      $(".running-generation-count").text("00:00");
      $(".progress-bar").css("width", "0");
      $(".drop-down-box-wrapper").show();
    }
  });
})(jQuery);