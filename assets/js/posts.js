"use strict";

(function ($) {
  $(document).ready(function () {
    var request = null;
    $("#ai_buddy-metadata").addClass('postbox').removeClass('closed');
    $(".button-abort-generate").on("click", function (event) {
      event.preventDefault();
      if (request !== null) {
        request.abort();
        request = null;
      }
      $(".ai-buddy-modal-window").removeClass('active');
    });
    function generatePostContent(api_url, nonce, post_type, post_id) {
      if (request !== null) {
        request.abort();
        request = null;
      }
      $('#postbox-container-1').css({
        'position': 'relative',
        'z-index': '9999'
      });
      $('.post-image-generate-done').hide();
      $('.post-image-generate').hide();
      $('.generated-post-headers').html('<div class="preloader"><div class="circle"></div><div class="circle"></div><div class="circle"></div></div>');
      $('.post-generate-popup').addClass('active popup-for-' + post_type).removeClass("popup-for-".concat(post_type === 'titles' ? 'excerpts' : 'titles'));
      $('.post-generate-popup').removeClass('popup-for-images');
      $(".ai-buddy-modal-window").removeClass('server-error');
      request = $.ajax({
        method: "POST",
        url: api_url,
        data: JSON.stringify({
          "post_id": post_id
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', nonce);
        },
        success: function success(response) {
          var list = $('<ul></ul>');
          for (var i = 0; i < response[post_type].length; i++) {
            if (response[post_type][i].trim()) {
              var item = $('<li></li>').text(response[post_type][i].replace(/^"(.+(?="$))"$/, '$1'));
              item.on('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
                $(".post-".concat(post_type, "-generate")).prop('disabled', false);
              });
              list.append(item);
            }
          }
          $('.generated-post-headers').html(list);
          $(".post-".concat(post_type, "-generate")).on('click', function (event) {
            event.preventDefault();
            $(".ai-buddy-modal-window").removeClass("active popup-for-".concat(post_type));
            var selected = $('.generated-post-headers .active');
            if (selected.length) {
              if (post_type === 'titles') {
                $('.wp-block-post-title:visible').focus().addClass('is-focus-mode').text(selected.text().trim());
                $('.interface-complementary-area-header__small-title:visible').text(selected.text().trim());
                $('#title:visible').val(selected.text().trim());
              } else {
                if (typeof wp !== 'undefined' && typeof wp.data !== 'undefined' && typeof wp.data.select === 'function') {
                  var excerpt = selected.text().trim();
                  var currentPost = wp.data.select('core/editor').getCurrentPost();
                  var updatedPost = wp.data.dispatch('core/editor').editPost({
                    excerpt: excerpt
                  });
                  $('.editor-post-excerpt textarea:visible').val(excerpt);
                }
                $('#postexcerpt textarea').val(selected.text().trim());
                $('#postexcerpt textarea').text(selected.text().trim());
              }
            }
          });
        },
        error: function error(xhr, status, _error) {
          $(".ai-buddy-modal-window").addClass('server-error');
        }
      });
    }
    function generatePost(type, api_url, nonce, post_id) {
      $('.generated-post-headers').empty();
      var post_type = '';
      if ($('body').hasClass('block-editor-page')) {
        var post_type = wp.data.select('core/editor').getCurrentPostType();
      } else {
        var post_type = $('#post_type').val();
      }
      var url = '/wp-json/wp/v2/' + post_type + 's/' + post_id;
      $.ajax({
        url: url,
        method: 'GET',
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', nonce);
        },
        success: function success(data) {
          var post_content = data.content.rendered;
          if (typeof post_content !== 'undefined' && post_content.trim().length > 0) {
            $('.post-generate-popup').removeClass('no-content-for-request');
            generatePostContent(api_url, nonce, type, post_id);
          } else {
            var popup_class = '';
            switch (type) {
              case 'titles':
                popup_class = 'popup-for-titles';
                break;
              case 'excerpts':
                popup_class = 'popup-for-excerpts';
                break;
              default:
                break;
            }
            $('.post-generate-popup').addClass('active ' + popup_class + ' no-content-for-request').removeClass('popup-for-images');
          }
        }
      });
    }
    $('.button-post-title-generate').on("click", function (event) {
      event.preventDefault();
      var post_id = $(this).data('post-id');
      $('.post-generate-popup').removeClass('popup-for-excerpts popup-for-images');
      $('.generated-post-headers').removeAttr('style');
      generatePost('titles', ai_buddy_generate_titles.api_url, ai_buddy_generate_titles.nonce, post_id);
    });
    $('.button-post-excerpt-generate').on("click", function (event) {
      event.preventDefault();
      var post_id = $(this).data('post-id');
      $('.post-generate-popup').removeClass('popup-for-titles popup-for-images');
      $('.generated-post-headers').removeAttr('style');
      generatePost('excerpts', ai_buddy_generate_excerpts.api_url, ai_buddy_generate_excerpts.nonce, post_id);
    });
  });
})(jQuery);