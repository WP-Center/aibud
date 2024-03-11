"use strict";

(function ($) {
    $(document).ready(function () {
        let total_images_data = $('#total-images-data').val();
        let total_images_price = total_images_data * 0.02;
        let total_tokens_data = $('#total-tokens-data').val();
        let total_tokens_price = total_tokens_data / 1000 * 0.02;
        let total_tokens_images = total_images_price + total_tokens_price;
        let total_price = (Math.round(total_tokens_images * 100) / 100).toFixed(2);
        $('.total-requests-price').text('('+total_price+'$)');

        $('input[type="number"]').on('change input', function() {
            var minVal = parseFloat($(this).attr('min'));
            var maxVal = parseFloat($(this).attr('max'));
            var inputVal = parseFloat($(this).val());
            if (inputVal < minVal) {
                $(this).val(minVal);
            }
            else if (inputVal > maxVal) {
                $(this).val(maxVal);
            }
        });

        $('.button-skip-api-key').on('click', function (event) {
            event.preventDefault();
            $('.ai-buddy-first-screen').remove();
            $('body').removeClass('ai-buddy-api-screen');
        });

        $('.update-plugin-setting').on('click', function (event) {
            event.preventDefault();

            let options = {};
            $('#plugin-settings input[type="checkbox"]').each(function () {
                let id = $(this).attr('id');
                let value = $(this).prop('checked') ? 1 : '';
                options[id] = value;
            });

            let title_suggestions = options['post-title-suggestions'] || '';
            let excerpt_suggestions = options['post-excerpt-suggestions'] || '';
            let image_suggestions = options['post-image-suggestions'] || '';
            let product_generator = options['post-product-generator'] || '';

            const modules = {
                modules: {
                    titles: title_suggestions,
                    excerpts: excerpt_suggestions,
                    images: image_suggestions,
                    woocommerce: product_generator,
                },
                openai: {
                    apikey: $('#ai_buddy-api-key').val(),
                },
                googleai: {
                    apikey: $('#ai_buddy-google-api-key').val(),
                },
            };

            let settings_notice = $('.plugin-settings-request');

            function makeAjaxRequest(url, data, method = 'POST') {
                return $.ajax({
                    method: method,
                    url: url,
                    data: JSON.stringify(data),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-WP-Nonce', ai_buddy_settings.nonce);
                    }
                });
            }

            makeAjaxRequest(ai_buddy_settings.api_url, modules)
            .then(function (response) {
                settings_notice.fadeIn().addClass('active');
                setTimeout(function () {
                    settings_notice.fadeOut().removeClass('active');
                }, 1500);

                return makeAjaxRequest(ai_buddy_files.api_url, {
                    data: '',
                    filename: '',
                }, 'GET');
            })
            .then(function (response) {
                $('.api-key-settings').removeClass('invalid').addClass('valid');
                $('.api-key-validation').removeClass('invalid').addClass('valid').text('OpenAI API Success: Correct API key');
                const modules = {
                    openai: {
                        apikey: $('#ai_buddy-api-key').val(),
                    },
                    googleai: {
                        apikey: $('#ai_buddy-google-api-key').val(),
                    },
                    api_key_validation: 'valid',
                };
                return makeAjaxRequest(ai_buddy_settings.api_url, modules, 'POST');
            })
            .catch(function (error) {
                settings_notice.fadeIn().addClass('active');
                setTimeout(function () {
                    settings_notice.fadeOut().removeClass('active request-error');
                }, 1500);

                if (error.responseJSON) {
                    $('.api-key-settings').removeClass('valid').addClass('invalid');
                    $('.api-key-validation').removeClass('valid').addClass('invalid').text('OpenAI API Error: Invalid authorization');
                    $('.ai-buddy-api-key-validator').addClass('invalid').text('OpenAI API Error: Invalid authorization');
                    const modules = {
                        api_key_validation: 'invalid',
                    };
                    makeAjaxRequest(ai_buddy_settings.api_url, modules);
                }
            });
        });

        $('.button-send-api-key').on('click', function (event) {
            event.preventDefault();

            const modules = {
                openai: {
                    apikey: $('#ai_buddy-api-key').val(),
                },
            };

            function makeFirstAjaxRequest(url, data, method = 'POST') {
                return $.ajax({
                    method: method,
                    url: url,
                    data: JSON.stringify(data),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-WP-Nonce', ai_buddy_settings.nonce);
                    },
                    success: function(response) {
                    }
                });
            }

            makeFirstAjaxRequest(ai_buddy_settings.api_url, modules)
            .then(function (response) {
                return makeFirstAjaxRequest(ai_buddy_files.api_url, {
                    data: '',
                    filename: '',
                }, 'GET');
            })
            .then(function (response) {
                $('.ai-buddy-first-screen').remove();
                $('body').removeClass('ai-buddy-api-screen');
                $('.api-key-settings').removeClass('invalid').addClass('valid');
                const modules = {
                    openai: {
                        apikey: $('#ai_buddy-api-key').val(),
                    },
                    api_key_validation: 'valid',
                };
                return makeFirstAjaxRequest(ai_buddy_settings.api_url, modules, 'POST');
            })
            .catch(function (error) {
                if (error.responseJSON) {
                    $('.api-key-settings').removeClass('valid').addClass('invalid');
                    $('.api-key-validation').removeClass('valid').addClass('invalid').text('OpenAI API Error: Invalid authorization');
                    $('.ai-buddy-api-key-validator').addClass('invalid').text('OpenAI API Error: Invalid authorization');
                    const modules = {
                        api_key_validation: 'invalid',
                    };
                    makeFirstAjaxRequest(ai_buddy_settings.api_url, modules);
                }
            });
        });
    });
})(jQuery);
