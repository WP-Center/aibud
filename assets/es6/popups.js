"use strict";

(function ($) {
    $(document).ready(function () {
        $(".button-model-params").on("click", function(event) {
            event.preventDefault();
            $(".model-params-popup").addClass('active');
        });
        $(".button-model-prompts").on("click", function(event) {
            event.preventDefault();
            $(".model-prompts").addClass('active');
        });
        $(".modal-close, .ai-buddy-modal-window-overlay, .button-model-params-close").on("click", function(event) {
            event.preventDefault();
            $(".ai-buddy-modal-window").removeClass('active');
        });
    });
})(jQuery);
