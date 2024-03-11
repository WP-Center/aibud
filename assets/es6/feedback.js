(function ($) {
    $(document).ready(function () {
        let body = 'body';
        let feedback_modal = '#ai-buddy-feedback-modal';

        /**
         * Feedback Modal
         */
        $(body).on('click', '.ai-buddy-feedback-button', function (e) {
            set_stars()
            e.preventDefault();
            $(feedback_modal).fadeIn(200);
        });

        $(body).on('click', '.feedback-modal-close', function (e) {
            e.preventDefault();
            $(feedback_modal).fadeOut(200);
        });

        $(body).on('click', function (e) {
            if (e.target.id === 'ai-buddy-feedback-modal') {
                $(feedback_modal).fadeOut(200);
            }
        });

        /**
         * Feedback Review
         */
        $(body).on('click', '#feedback-stars li', function (e) {
            var rating = parseInt($(this).data('value'), 10),
                stars = $(this).parent().children('li.star');

            stars.removeClass('selected');

            for (let i = 0; i < rating; i++) {
                $(stars[i]).addClass('selected');
            }

            set_stars();
            $('.feedback-rating-stars span.rating-text').text($(this).attr('title'));
            $('.feedback-extra').toggle(rating < 4);
            $('.feedback-submit img').toggle(rating > 3);
        });

        $(body).on('click', '.feedback-submit', function (e) {
            var rating = parseInt($('ul#feedback-stars li.selected').last().data('value'), 10),
                review = $('#feedback-review').val();

            /** Send Feedback */
            if (rating < 4) {
                e.preventDefault();
                $.ajax({
                    url: 'https://panel.stylemixthemes.com/api/item-review',
                    dataType: 'json',
                    method: 'POST',
                    data: {
                        'item': 'aibuddy-openai-chatgpt',
                        'type': 'plugin',
                        rating,
                        review
                    },
                    success: function (response) {}
                });
            }

            /** Thank You */
            $('ul#feedback-stars li').addClass('disabled').prop('disabled', true);
            $('#ai-buddy-feedback-modal h2').text('Thank You for Feedback');
            $('.feedback-review-text').text(review);
            $('.feedback-review-text, .feedback-thank-you').show();
            $('.feedback-extra, .feedback-submit').hide();

            /** Remove Feedback Button */
            $.ajax({
                url: ajaxurl,
                type: 'GET',
                data: 'action=ai_buddy_ajax_add_feedback',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', ai_buddy_feedback.nonce);
                },
                success: function (data) {
                    $('.ai-buddy-feedback-button').remove();
                }
            });
        });
    });

    function set_stars() {
        $('ul#feedback-stars li i').css('background-image', 'url(' + ai_buddy_feedback.plugin_url + '/assets/images/feedback-star.svg)');
        $('ul#feedback-stars li.selected i').css('background-image', 'url(' + ai_buddy_feedback.plugin_url + '/assets/images/feedback-star-filled.svg)');
    }
})(jQuery);
