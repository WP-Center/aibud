"use strict";

(function ($) {
    $(document).ready(function () {

        $('#playground-temperature').on('change', function() {
            if ($(this).val() > 1) {
                $(this).val(1);
            } else if($(this).val() < 0) {
                $(this).val(0);
            }
        });

        $('#playground-max-tokens').on('change', function() {
            if($(this).val() > 2048) {
                $(this).val(2048);
            } else if($(this).val() < 1) {
                $(this).val(1)
            }
        });
        function disableButton(input, button) {
            if (input.val() === '') {
                button.prop('disabled', true);
            } else {
                button.prop('disabled', false);
            }
        }
        $('.playground-section #playground-query').on('keyup', function() {
            disableButton($(this), $('.playground-section .submit-button'));
        });

        $('.playground-section .submit-button').on( 'click', function() {
            let $prompt = $('#playground-query').val();
            let $max_tokens = $('#playground-max-tokens').val();
            let $temperature = $('#playground-temperature').val();
            let $language_model = $("#playground-model").val();
            let $button = $(this);
            $button.addClass('loading');

            let data = {
                messages: [{
                    "role": "user",
                    "content": $prompt,
                }],
                model: $language_model,
                max_tokens: $max_tokens,
                temperature: $temperature,
            };
            $.ajax({
                method: "POST",
                url: ai_buddy_playground.api_url,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', ai_buddy_playground.nonce );
                },
                success: function(response) {
                    $button.removeClass('loading');
                    $('#playground-answer').val(response.completions.trim());
                },
                error: function(xhr, status, error) {
                    $('.server-error').addClass('active');
                    $button.removeClass('loading').prop('disabled', false);
                }
            });
        });
    });
})(jQuery);
