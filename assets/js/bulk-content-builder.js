"use strict";

(function ($) {
  $(document).ready(function () {
    var checkBulkContent = $('#check-bulk-content');
    var topicForm = $('#content-builder');
    var bulkTopicForm = $('#bulk-content-builder');
    var createPost = $('.button-create-post');
    var seoDetails = $('.ai-buddy-seo-details');
    function handleEvent(event) {
      if (event.type === 'click') {
        if (checkBulkContent.is(':checked')) {
          topicForm.hide();
          seoDetails.hide();
          bulkTopicForm.show();
          createPost.hide();
        } else {
          topicForm.show();
          seoDetails.show();
          bulkTopicForm.hide();
          createPost.show();
        }
      }
    }
    checkBulkContent.on('click', handleEvent);

    //Get params for generate post
    var isAborted = null;
    var responseDataSection;
    var countdown;
    var request;
    $(".button-abort").on("click", function (event) {
      event.preventDefault();
      if (isAborted != null) {
        isAborted.abort();
        isAborted = null;
      }
      $('.server-error').removeClass('active');
      clearInterval(countdown);
      $(".running-generation-count").text("00:00");
      $(".progress-bar").css("width", "0%");
    });
    $(".button-post-sample").on("click", function (event) {
      event.preventDefault();
      var sample = $(this).data("sample");
      $("#topic-bulk-message").val(sample);
      if ($("#topic-bulk-message").val()) {
        $(".button-post-reset").removeAttr("disabled");
        $(".button-bulk-post-message").removeAttr("disabled");
      } else {
        $(".button-post-reset").attr("disabled", true);
        $(".button-bulk-post-message").attr("disabled", true);
      }
    });
    $('.button-bulk-post-message').on('click', function (event) {
      event.preventDefault();
      if (isAborted != null) {
        isAborted.abort();
        isAborted = null;
      }
      var button = $(this);
      var message = $("#topic-bulk-message").val();
      var message_keys = message.split("\n");
      var totalRequests = message_keys.length * 4;
      var responsesReceived = 0;
      var promises = [];
      $(button).closest(".section-content").find(".drop-down-box-wrapper").hide();
      $(button).closest(".section-content").find(".running-generation").show();
      var count = 0;
      $(button).closest(".section-content").find(".running-generation-count").text("00:00");
      countdown = setInterval(function () {
        count++;
        var minutes = Math.floor(count / 60);
        var seconds = count % 60;
        $(button).closest(".section-content").find(".running-generation-count").text((minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds));
        if (count === 0) {
          clearInterval(countdown);
        }
      }, 1000);
      function sendRequest(index) {
        if (index >= message_keys.length) {
          Promise.all(promises).then(function () {
            clearInterval(countdown);
            count = 0;
            $(".running-generation").hide();
            $(".running-generation-count").text("00:00");
            $(".progress-bar").css("width", "0");
            $(".drop-down-box-wrapper").show();
          });
          return;
        }
        var title_key = message_keys[index];
        if (title_key.trim() !== "") {
          var requestData = function requestData(requestType) {
            var prompt = "";
            var max_tokens = $('.model-max-tokens').val();
            var model = $("#language-model-select").val();
            switch (requestType) {
              case "title":
                var prompt_title_template = $("#prompt-title-template").val();
                var prompt_title_text = prompt_title_template.replace('{TOPIC}', title_key).replace('{LANGUAGE}', post_language).replace('{WRITING_STYLE}', post_style).replace('{WRITING_TONE}', post_tone);
                if (keywords) {
                  prompt_title_text = prompt_title_text + ' keywords of the content will be: ' + keywords;
                }
                prompt = prompt_title_text;
                max_tokens = 512;
                break;
              case "section":
                var prompt_section_template = $("#prompt-section-template").val();
                var prompt_section_text = prompt_section_template.replace('{SECTIONS_COUNT}', section_count).replace('{TITLE}', title_key).replace('{LANGUAGE}', post_language).replace('{WRITING_STYLE}', post_style).replace('{WRITING_TONE}', post_tone);
                if (keywords) {
                  prompt_section_text = prompt_section_text + ' keywords of the content will be: ' + keywords;
                }
                prompt = prompt_section_text;
                max_tokens = 512;
                break;
              case "content":
                var prompt_content_template = $("#prompt-content-template").val();
                var prompt_content_text = prompt_content_template.replace('{PARAGRAPHS_COUNT}', content_count).replace('{TITLE}', title_key).replace('{LANGUAGE}', post_language).replace('{SECTIONS}', responseDataSection).replace('{WRITING_STYLE}', post_style).replace('{WRITING_TONE}', post_tone);
                if (keywords) {
                  prompt_content_text = prompt_content_text + ' keywords of the content will be: ' + keywords;
                }
                max_tokens = parseInt(max_tokens);
                prompt = prompt_content_text;
                break;
              case "excerpt":
                var prompt_excerpt_template = $("#prompt-excerpt-template").val();
                var prompt_excerpt_text = prompt_excerpt_template.replace('{TITLE}', title_key).replace('{LANGUAGE}', post_language).replace('{WRITING_STYLE}', post_style).replace('{WRITING_TONE}', post_tone);
                if (keywords) {
                  prompt_excerpt_text = prompt_excerpt_text + ' keywords of the content will be: ' + keywords;
                }
                prompt = prompt_excerpt_text;
                max_tokens = 512;
                break;
            }
            var data = {
              model: model,
              messages: [{
                "role": "user",
                "content": prompt
              }],
              max_tokens: max_tokens,
              temperature: model_temperature
            };
            return isAborted = $.ajax({
              method: "POST",
              url: ai_buddy_content_builder.api_url,
              data: JSON.stringify(data),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              beforeSend: function beforeSend(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', ai_buddy_content_builder.nonce);
              }
            }).always(function () {
              responsesReceived++;
              var percentComplete = responsesReceived * 100 / totalRequests;
              $(".progress-bar").css("width", percentComplete + "%");
            });
          };
          var post_language = $("#select-language").val();
          var post_style = $("#select-style").val();
          var post_tone = $("#select-tone").val();
          var model_temperature = $("#model-temperature").val();
          var section_count = $(".count-post-section").val();
          var content_count = $(".count-post-content").val();
          var keywords = $('#ai-buddy-content-keywords').val();
          var keywordsBold = $('#ai-buddy-make-keywords-bold');
          requestData("title").done(function (response) {
            var generated_post_title = response.completions;
            requestData("section").done(function (response) {
              responseDataSection = response.completions;
              requestData("content").done(function (response) {
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
                var post_content = response_completions;
                requestData("excerpt").done(function (response) {
                  var post_excerpt = response.completions;
                  if ($("#post-title-option").prop("checked")) {
                    var post_title = title_key;
                  } else {
                    var post_title = generated_post_title;
                  }
                  var newPostData = {
                    title: post_title,
                    content: post_content,
                    excerpt: post_excerpt
                  };
                  $.ajax({
                    method: "POST",
                    url: ai_buddy_create_post.api_url,
                    data: JSON.stringify(newPostData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    beforeSend: function beforeSend(xhr) {
                      xhr.setRequestHeader('X-WP-Nonce', ai_buddy_create_post.nonce);
                    }
                  }).done(function (response) {
                    sendRequest(index + 1);
                    var postTitle = $('<div class="generated-post-title">').html(response.post_title);
                    var postPermalink = $('<a href="' + response.post_permalink + '" target="_blank" class="ai-buddy-button">View</a>');
                    var postEditLink = $('<a href="' + response.post_edit_link + '" target="_blank" class="ai-buddy-button outline">Edit</a>');
                    var generatedPost = $('<div class="generated-post"></div>').append(postTitle).append(postPermalink).append(postEditLink);
                    generatedPost.appendTo('.generated-posts');
                  });
                  promises.push(request);
                });
              });
            });
          });
        } else {
          clearInterval(countdown);
          count = 0;
          $(".running-generation").hide();
          $(".running-generation-count").text("00:00");
          $(".progress-bar").css("width", "0");
          $(".drop-down-box-wrapper").show();
        }
      }
      sendRequest(0);
    });
  });
})(jQuery);