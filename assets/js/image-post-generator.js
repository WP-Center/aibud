"use strict";

(function ($) {
  $(document).ready(function () {
    var request = null;
    $(".button-abort-generate").on("click", function (event) {
      event.preventDefault();
      if (request != null) {
        request.abort();
        request = null;
      }
      $(".ai-buddy-modal-window").removeClass('active');
    });
    $('.button-post-image-generate').on("click", function (event) {
      event.preventDefault();
      if (request != null) {
        request.abort();
        request = null;
      }
      var url = '';
      var post_id = '';
      if ($('body').is('.woocommerce-page')) {
        var post_id = $('.button-post-image-generate').data('post-id');
        var url = '/wp-json/wc/v3/products/' + post_id;
      } else {
        var post_id = $(this).data('post-id');
        if ($('body').hasClass('block-editor-page')) {
          var post_type = wp.data.select('core/editor').getCurrentPostType();
        } else {
          var post_type = $('#post_type').val();
        }
        var url = '/wp-json/wp/v2/' + post_type + 's/' + post_id;
      }
      $('.section.product-image, .product-title-image').show();
      $('.section.product-fields, .product-title-fields').hide();
      $.ajax({
        url: url,
        method: 'GET',
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', ai_buddy_image_post_generator.nonce);
        },
        success: function success(data) {
          var post_content = '';
          if (data.content && data.content.rendered) {
            var post_content = data.content.rendered;
          } else {
            var post_content = data.description;
          }
          if (typeof post_content !== 'undefined' && post_content.trim().length > 0) {
            request = $.ajax({
              method: "POST",
              url: ai_buddy_image_post_generator.api_url,
              data: JSON.stringify({
                "post_id": post_id
              }),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              beforeSend: function beforeSend(xhr) {
                $('.post-image-generate-done').hide();
                $('.post-image-generate').show();
                $('.post-generate-popup, .product-generate-popup').addClass('active popup-for-images').removeClass('popup-for-excerpts popup-for-titles');
                $('.generated-post-headers').html('<div class="preloader"><div class="circle"></div><div class="circle"></div><div class="circle"></div></div>').css({
                  'min-height': '460px',
                  'display': 'flex'
                });
                xhr.setRequestHeader('X-WP-Nonce', ai_buddy_image_post_generator.nonce);
              },
              success: function success(response) {
                $('.generated-post-headers').html($('<img>').attr('src', response.images));
                $('.post-image-generate').prop('disabled', false);
                $('.post-image-generate').on("click", function (event) {
                  event.preventDefault();
                  if (request != null) {
                    request.abort();
                    request = null;
                  }
                  $(this).addClass('loading');
                  var data = {
                    title: '',
                    caption: '',
                    alt: '',
                    description: '',
                    url: response.images[0],
                    filename: ''
                  };
                  request = $.ajax({
                    method: "POST",
                    url: ai_buddy_image_post_attachment.api_url,
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    beforeSend: function beforeSend(xhr) {
                      xhr.setRequestHeader('X-WP-Nonce', ai_buddy_image_post_attachment.nonce);
                    },
                    success: function success(response) {
                      $('.post-image-generate').removeClass('loading').hide();
                      $('.post-image-generate-done').show();
                      var featuredImageId = response.attachment_id;
                      if ($('body').hasClass('woocommerce-page')) {
                        $('#set-post-thumbnail').html('<img src="' + response.attachment_url + '">');
                        $('input#_thumbnail_id').val(featuredImageId);
                      } else {
                        if ($('body').hasClass('block-editor-page')) {
                          var currentPost = wp.data.select('core/editor').getCurrentPost();
                          var updatedPost = wp.data.dispatch('core/editor').editPost({
                            featured_media: featuredImageId
                          });
                        } else {
                          $('#set-post-thumbnail').html('<img src="' + response.attachment_url + '">');
                          $('input#_thumbnail_id').val(featuredImageId);
                        }
                      }
                    }
                  });
                });
              },
              error: function error(xhr, status, _error) {
                $('.post-image-generate-done').hide();
                $('.post-image-generate').hide();
                $(".ai-buddy-modal-window").addClass('server-error');
              }
            });
          } else {
            $('.post-generate-popup, .product-generate-popup').addClass('active popup-for-images no-content-for-request').removeClass('popup-for-excerpts popup-for-titles');
          }
        },
        error: function error(xhr, status, _error2) {
          $(".product-generate-popup").addClass('server-error');
        }
      });
    });
  });
})(jQuery);