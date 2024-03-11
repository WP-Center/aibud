"use strict";

(function ($) {
    $(document).ready(function () {
        let request = null;

        function showErrorPopup(errorMessage) {
            if (!errorMessage) {
                errorMessage = "There may be issues with the server or internet connection, or it's possible that an incorrect API Key has ben specified"
            } else {
                errorMessage = $.parseJSON( errorMessage ).message
            }
            $('.server-error').addClass('active');
            $('.server-error .response-message .section-description').html(errorMessage)
        }

        $(".button-images-abort").on("click", function(event) {
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
        $('#image-prompt').on('keyup', function() {
            disableButton($(this), $('.image-generate-button'));
        });

        $('#image-count').on( 'change', function() {
            let $estimated_price = $(this).val() * 0.02;
            $('.estimated-price-wrapper .estimated-price').html(' $' + $estimated_price);
        });

        $('.save-images-settings').on('click', function (event) {
            let image_artist = $('#images-artist-options').val();
            let image_style = $('#images-style-options').val();
            let image_photography = $('#images-photography-options').val();
            let image_lighting = $('#images-lighting-options').val();
            let image_subject = $('#images-subject-options').val();
            let image_camera = $('#images-camera-options').val();
            let image_composition = $('#images-composition-options').val();
            let image_resolution = $('#images-resolution-options').val();
            let image_color = $('#images-color-options').val();
            let image_special_effects = $('#images-special-effects-options').val();
            let image_size = $('#images-size-options').val();

            const data = {
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
            let settings_notice = $('.plugin-settings-request');

            $.ajax({
                method: "POST",
                url: ai_buddy_settings.api_url,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', ai_buddy_settings.nonce);
                },
                success: function (response) {
                    settings_notice.fadeIn().addClass('active');
                    setTimeout(function () {
                        settings_notice.fadeOut().removeClass('active');
                    }, 1500);
                },
                error: function(xhr, status, error) {
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

            let $button = $(this);
            let image_key = $('#image-prompt').val();
            let image_size = $('#images-size-options').val();

            let selections = {
                'Artist': $('#images-artist-options').val(),
                'Style': $('#images-style-options').val(),
                'Photography': $('#images-photography-options').val(),
                'Lighting': $('#images-lighting-options').val(),
                'Subject': $('#images-subject-options').val(),
                'Camera': $('#images-camera-options').val(),
                'Composition': $('#images-composition-options').val(),
                'Resolution': $('#images-resolution-options').val(),
                'Color': $('#images-color-options').val(),
                'Special Effects': $('#images-special-effects-options').val(),
            };
            
            let parts = ['Generate an image ' + image_key + ' with the following settings:'];
            for (let key in selections) {
                if (selections[key] && selections[key] !== 'None') {
                    parts.push(key + ': ' + selections[key]);
                }
            }

            let image_prompt = parts.join(', ') + '.';
            
            let image_count = $('#image-count').val();
            let $result_wrapper = $('.result-wrapper');
            
            $button.addClass('loading');
            let data = {
                prompt: image_prompt,
                max_results: image_count,
                model: 'dall-e',
                size: image_size,
            };
            
            request = $.ajax({
                method: "POST",
                url: ai_buddy_image_generator.api_url,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', ai_buddy_image_generator.nonce);
                    $button.prop('disabled', true);
                    $('.button-images-abort').show();
                },
                success: function (response) {
                    $('.result-section').show(500);
                    $button.removeClass('loading');
                    $button.prop('disabled', false);
                    for (let i = 0; i < response.images.length; i++) {
                        $result_wrapper.append('<div class="image-wrapper"><img src="' + response.images[i] + '" class="generated-img" data-prompt="' + image_prompt + '"><div class="image-buttons-wrapper"><a href="' + response.images[i] + '" target="_blank" class="download-button generated-button">' + ai_buddy_image_generator.buttons.download + '</a><a class="details-button generated-button" href="' + response.images[i] + '">' + ai_buddy_image_generator.buttons.details + '</a></div></div>');
                    }
                    $('.result-number').html($('.result-wrapper').children().length + ' ');
                    image_details();
                    $('.button-images-abort').hide();
                },
                error: function(xhr, status, error) {
                    showErrorPopup(xhr.responseText);
                    $button.removeClass('loading').prop('disabled', false);
                }
            });
        });

        $('#image-download-form .add-to-media').on('click', function (e) {
            e.preventDefault();
            let $add_to_media = $(this);
            $add_to_media.addClass('loading');
            let $image_title = $(this).parents().find('[name=image-title]').val();
            let $image_caption = $(this).parents().find('[name=image-caption]').val();
            let $image_descr = $(this).parents().find('[name=image-description]').val();
            let $image_alt = $(this).parents().find('[name=image-alt]').val();
            let $image_filename = $(this).parents().find('[name=image-file-name]').val();
            let $image_url = $(this).next().attr('href');

            let data = {
                title: $image_title,
                caption: $image_caption,
                alt: $image_alt,
                description: $image_descr,
                url: $image_url,
                filename: $image_filename,
            };

            $.ajax({
                method: "POST",
                url: ai_buddy_create_attachment.api_url,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', ai_buddy_create_attachment.nonce);
                    $add_to_media.prop('disabled', true);
                    $(".modal-close, .ai-buddy-modal-window-overlay, .button-model-params-close").off();
                },
                success: function (response) {
                    $add_to_media.prop('disabled', false);
                    $(".modal-close, .ai-buddy-modal-window-overlay, .button-model-params-close").on("click", function(event) {
                        event.preventDefault();
                        $(".ai-buddy-modal-window").removeClass('active');
                        $(".edit-media-wrapper").removeClass('media-downloaded');
                    });
                    let $edit_media = $('.edit-media-wrapper');
                    $edit_media.addClass('media-downloaded');
                    $edit_media.children().find('.attachment-id').html('#' + response.attachment_id + ' ');
                    $('.edit-media-button').attr('href', '/wp-admin/post.php?post='+ response.attachment_id + '&action=edit');
                    $add_to_media.removeClass('loading');
                }
            });
        });

        function image_details() {
            $('.details-button').on('click', function (event) {
                event.preventDefault();
                let $img_url = $(this).attr('href');
                let $image_title_media = $('#image-prompt').val();
                let $img_info = $(this).parents('.image-wrapper').find('.generated-img').attr('data-prompt');
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
