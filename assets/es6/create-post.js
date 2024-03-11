"use strict";

(function ($) {
    $(document).ready(function () {
        $( '.button-create-post' ).on( "click", function( event ) {
            event.preventDefault();

            $.ajax({
                method: "POST",
                url: ai_buddy_create_post.api_url,
                data: JSON.stringify({
                    "title": $("#post-title").val(),
                    "content": $("#post-content").val(),
                    "excerpt": $("#post-excerpt").val(),
                    "keywords": $('#ai-buddy-content-keywords').val(),
                    "language": $("#select-language").val(),
                    "isYoastActive": $('#ai-buddy-yoast-integration').is(':checked'),
                    "isRankMathActive": $('#ai-buddy-rank-math-integration').is(':checked'),
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', ai_buddy_create_post.nonce );
                },
                success: function(response) {
                    $(".created-post-popup").addClass("active");
                    if ( response.post_edit_link ) {
                        $(".button-open-post").attr('href', response.post_permalink);
                        $(".button-edit-post").attr('href', response.post_edit_link);
                    }
                }
            });
        });
    });
})(jQuery);
