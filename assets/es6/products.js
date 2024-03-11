"use strict";

(function ($) {
    $(document).ready(function () {
        let request = null;

        $(".button-abort-product-generate").on("click", function(event) {
            event.preventDefault();
            if (request != null) {
                request.abort();
                request = null;
            }
            $(".button-product-generator").removeClass('loading');
            $(".ai-buddy-modal-window").removeClass('active');
        });
        $( '.button-product-popup' ).on( "click", function( event ) {
            event.preventDefault();

            let parent_element = $(this).closest('#post-body');
            let product_title = parent_element.find('#title').val();

            $('#product-new-content-generator').val(product_title);
            $('.product-generate-popup').addClass('active').removeClass('server-error');
            $('.button-product-generator').removeClass('loading');
            $('.section.product-image, .product-title-image').hide();
            $('.section.product-fields, .product-title-fields').show();
            $('#product-new-content-generator').on('input', function() {
                if ($(this).val().trim() !== '') {
                    $('.button-product-generator').prop('disabled', false);
                } else {
                    $('.button-product-generator').prop('disabled', true);
                }
            });
            if ($('#product-new-content-generator').val() !== '') {
                $('.button-product-generator').prop('disabled', false);
            }
        });
        $( '.button-product-generator' ).on( "click", function( event ) {
            event.preventDefault();
            if (request !== null) {
                request.abort();
                request = null;
            }

            $(this).addClass('loading');
            let post_title = $('#product-new-content-generator').val();
            let prompt = "Here is the product: "+ post_title +". Based on the product, write a description of this product (between 120 and 240 words), a short description (between 20-49 words), a SEO-friendly title (between 3-6 words), and tags, separated by commas. Use this format:{Description}{Excerpt}{Title}{Tags}";

            request = $.ajax({
                method: "POST",
                url: ai_buddy_content_builder.api_url,
                data: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "prompt":  [{"role": "user",
                                "content": prompt}],
                    "temperature": 0.8,
                    "max_tokens": 512,
                    "top_p": 1,
                    "frequency_penalty": 0,
                    "presence_penalty": 0
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', ai_buddy_content_builder.nonce );
                },
                success: function(response) {
                    let completionLines = response.completions.split('\n');
                    $( '.button-product-generator:visible' ).removeClass('loading');
                    $('.button-product-generate').prop('disabled', false);

                    let completionValues = {};
                    for (let i = 0; i < completionLines.length; i++) {
                        let line = completionLines[i];
                        if (line.trim() === "") {
                            continue;
                        }
                        let lineParts = line.split(':');
                        if (lineParts.length !== 2) {
                            continue;
                        }
                        let key = lineParts[0].trim();
                        let value = lineParts[1].trim();
                        completionValues[key] = value;
                    }

                    $('#new-product-title').val(completionValues['Title']).prop('disabled', false);
                    $('.button-product-title').prop('disabled', false);
                    $('#new-product-description').val(completionValues['Description']).prop('disabled', false);
                    $('.button-product-description').prop('disabled', false);
                    $('#new-product-excerpt').val(completionValues['Excerpt']).prop('disabled', false);
                    $('.button-product-excerpt').prop('disabled', false);
                    $('#new-product-tags').val(completionValues['Tags']).prop('disabled', false);
                    $('.button-product-tags').prop('disabled', false);

                    $('.button-product-title').on( "click", function(event) {
                        event.preventDefault();
                        var new_product_title = $('#new-product-title').val();
                        $('#title-prompt-text').remove();
                        $('#title').removeAttr('placeholder').val(new_product_title);
                        $(this).text($(this).data("done"));
                    });
                    $('.button-product-description').on( "click", function(event) {
                        event.preventDefault();
                        var new_product_description = $('#new-product-description').val();
                        var editor = tinyMCE.get('content');
                        editor.setContent('');
                        editor.setContent(new_product_description);
                        $(this).text($(this).data("done"));
                    });
                    $('.button-product-excerpt').on( "click", function(event) {
                        event.preventDefault();
                        var new_product_excerpt = $('#new-product-excerpt').val();
                        var editor = tinyMCE.get('excerpt');
                        editor.setContent('');
                        editor.setContent(new_product_excerpt);
                        $(this).text($(this).data("done"));
                    });
                    $('.button-product-tags').on( "click", function(event) {
                        event.preventDefault();
                        var new_product_tags = $('#new-product-tags').val();
                        $('#new-tag-product_tag').val(new_product_tags);
                        $(this).text($(this).data("done"));
                    });

                    $('.button-product-generate').on( "click", function(event) {
                        event.preventDefault();
                        $('.button-product-title, .button-product-description, .button-product-excerpt, .button-product-tags').trigger('click');
                        $(".ai-buddy-modal-window").removeClass('active');
                    });
                },
                error: function(xhr, status, error) {
                    $(".product-generate-popup").addClass('server-error');
                }
            });
        });
    });
})(jQuery);