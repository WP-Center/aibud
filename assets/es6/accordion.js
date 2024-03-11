"use strict";

(function ($) {
    $(document).ready(function () {
        $('.ai-buddy-accordion-section .section-title').on('click', function () {
            if ($(this).hasClass('active')) {
                $('.ai-buddy-accordion-section .section-title').removeClass('active');
            } else {
                $('.ai-buddy-accordion-section .section-title').removeClass('active');

                $(this).addClass('active');
            }
        });
    });
})(jQuery);
