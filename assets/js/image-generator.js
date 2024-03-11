"use strict";

(function ($) {
  $(document).ready(function () {
    var request = null;
    function showErrorPopup(errorMessage) {
      if (!errorMessage) {
        errorMessage = "There may be issues with the server or internet connection, or it's possible that an incorrect API Key has ben specified";
      } else {
        errorMessage = $.parseJSON(errorMessage).message;
      }
      $('.server-error').addClass('active');
      $('.server-error .response-message .section-description').html(errorMessage);
    }
    $(".button-images-abort").on("click", function (event) {
      event.preventDefault();
      if (request != null) {
        request.abort();
        request = null;
      }
      $(this).hide();
      $('.image-generate-button').removeClass('loading').prop('disabled', false);
      $('.server-error').removeClass('active');
    });
    function disableButton(input, button) {
      if (input.val() === '') {
        button.prop('disabled', true);
      } else {
        button.prop('disabled', false);
      }
    }
    $('#image-prompt').on('keyup', function () {
      disableButton($(this), $('.image-generate-button'));
    });
    $('#image-count').on('change', function () {
      var $estimated_price = $(this).val() * 0.02;
      $('.estimated-price-wrapper .estimated-price').html(' $' + $estimated_price);
    });
    $('.save-images-settings').on('click', function (event) {
      var image_artist = $('#images-artist-options').val();
      var image_style = $('#images-style-options').val();
      var image_photography = $('#images-photography-options').val();
      var image_lighting = $('#images-lighting-options').val();
      var image_subject = $('#images-subject-options').val();
      var image_camera = $('#images-camera-options').val();
      var image_composition = $('#images-composition-options').val();
      var image_resolution = $('#images-resolution-options').val();
      var image_color = $('#images-color-options').val();
      var image_special_effects = $('#images-special-effects-options').val();
      var image_size = $('#images-size-options').val();
      var data = {
        image_generator: {
          artist: image_artist,
          style: image_style,
          photography: image_photography,
          lighting: image_lighting,
          subject: image_subject,
          camera: image_camera,
          composition: image_composition,
          resolution: image_resolution,
          color: image_color,
          special_effects: image_special_effects,
          size: image_size
        }
      };
      var settings_notice = $('.plugin-settings-request');
      $.ajax({
        method: "POST",
        url: ai_buddy_settings.api_url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', ai_buddy_settings.nonce);
        },
        success: function success(response) {
          settings_notice.fadeIn().addClass('active');
          setTimeout(function () {
            settings_notice.fadeOut().removeClass('active');
          }, 1500);
        },
        error: function error(xhr, status, _error) {
          settings_notice.fadeIn().addClass('active');
          setTimeout(function () {
            settings_notice.fadeOut().removeClass('active request-error');
          }, 1500);
        }
      });
    });
    $('.image-generate-button:not(.loading)').on('click', function (event) {
      event.preventDefault();
      if (request != null) {
        request.abort();
        request = null;
      }
      var $button = $(this);
      var image_key = $('#image-prompt').val();
      var image_size = $('#images-size-options').val();
      var selections = {
        'Artist': $('#images-artist-options').val(),
        'Style': $('#images-style-options').val(),
        'Photography': $('#images-photography-options').val(),
        'Lighting': $('#images-lighting-options').val(),
        'Subject': $('#images-subject-options').val(),
        'Camera': $('#images-camera-options').val(),
        'Composition': $('#images-composition-options').val(),
        'Resolution': $('#images-resolution-options').val(),
        'Color': $('#images-color-options').val(),
        'Special Effects': $('#images-special-effects-options').val()
      };
      var parts = ['Generate an image ' + image_key + ' with the following settings:'];
      for (var key in selections) {
        if (selections[key] && selections[key] !== 'None') {
          parts.push(key + ': ' + selections[key]);
        }
      }
      var image_prompt = parts.join(', ') + '.';
      var image_count = $('#image-count').val();
      var $result_wrapper = $('.result-wrapper');
      $button.addClass('loading');
      var data = {
        prompt: image_prompt,
        max_results: image_count,
        model: 'dall-e',
        size: image_size
      };
      request = $.ajax({
        method: "POST",
        url: ai_buddy_image_generator.api_url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', ai_buddy_image_generator.nonce);
          $button.prop('disabled', true);
          $('.button-images-abort').show();
        },
        success: function success(response) {
          $('.result-section').show(500);
          $button.removeClass('loading');
          $button.prop('disabled', false);
          for (var i = 0; i < response.images.length; i++) {
            $result_wrapper.append('<div class="image-wrapper"><img src="' + response.images[i] + '" class="generated-img" data-prompt="' + image_prompt + '"><div class="image-buttons-wrapper"><a href="' + response.images[i] + '" target="_blank" class="download-button generated-button">' + ai_buddy_image_generator.buttons.download + '</a><a class="details-button generated-button" href="' + response.images[i] + '">' + ai_buddy_image_generator.buttons.details + '</a></div></div>');
          }
          $('.result-number').html($('.result-wrapper').children().length + ' ');
          image_details();
          $('.button-images-abort').hide();
        },
        error: function error(xhr, status, _error2) {
          showErrorPopup(xhr.responseText);
          $button.removeClass('loading').prop('disabled', false);
        }
      });
    });
    $('#image-download-form .add-to-media').on('click', function (e) {
      e.preventDefault();
      var $add_to_media = $(this);
      $add_to_media.addClass('loading');
      var $image_title = $(this).parents().find('[name=image-title]').val();
      var $image_caption = $(this).parents().find('[name=image-caption]').val();
      var $image_descr = $(this).parents().find('[name=image-description]').val();
      var $image_alt = $(this).parents().find('[name=image-alt]').val();
      var $image_filename = $(this).parents().find('[name=image-file-name]').val();
      var $image_url = $(this).next().attr('href');
      var data = {
        title: $image_title,
        caption: $image_caption,
        alt: $image_alt,
        description: $image_descr,
        url: $image_url,
        filename: $image_filename
      };
      $.ajax({
        method: "POST",
        url: ai_buddy_create_attachment.api_url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', ai_buddy_create_attachment.nonce);
          $add_to_media.prop('disabled', true);
          $(".modal-close, .ai-buddy-modal-window-overlay, .button-model-params-close").off();
        },
        success: function success(response) {
          $add_to_media.prop('disabled', false);
          $(".modal-close, .ai-buddy-modal-window-overlay, .button-model-params-close").on("click", function (event) {
            event.preventDefault();
            $(".ai-buddy-modal-window").removeClass('active');
            $(".edit-media-wrapper").removeClass('media-downloaded');
          });
          var $edit_media = $('.edit-media-wrapper');
          $edit_media.addClass('media-downloaded');
          $edit_media.children().find('.attachment-id').html('#' + response.attachment_id + ' ');
          $('.edit-media-button').attr('href', '/wp-admin/post.php?post=' + response.attachment_id + '&action=edit');
          $add_to_media.removeClass('loading');
        }
      });
    });
    function image_details() {
      $('.details-button').on('click', function (event) {
        event.preventDefault();
        var $img_url = $(this).attr('href');
        var $image_title_media = $('#image-prompt').val();
        var $img_info = $(this).parents('.image-wrapper').find('.generated-img').attr('data-prompt');
        $('.images-group .popup-image').attr('src', $img_url);
        $('.image-info textarea').val($img_info);
        $('.image-info textarea[name="image-title"]').val($image_title_media);
        $('.image-info input').val($img_info.replace(/[, ]/g, '-') + '.png');
        $('.download.popup-button').attr('href', $img_url);
        $('.image-generator-popup').addClass('active');
      });
    }
  });
})(jQuery);