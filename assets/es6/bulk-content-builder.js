"use strict";

(function ($) {
    $(document).ready(function () {
        const checkBulkContent = $('#check-bulk-content');
        const topicForm = $('#content-builder');
        const bulkTopicForm = $('#bulk-content-builder');
        const createPost = $('.button-create-post');
        const seoDetails = $('.ai-buddy-seo-details');

        function handleEvent(event) {
            if (event.type === 'click') {
                if (checkBulkContent.is(':checked')) {
                    topicForm.hide();
                    seoDetails.hide();
                    bulkTopicForm.show();
                    createPost.hide();
                } else {
                    topicForm.show();
                    seoDetails.show()
                    bulkTopicForm.hide();
                    createPost.show();
                }
            }
        }

        checkBulkContent.on('click', handleEvent);

        //Get params for generate post
        let isAborted = null;
        let responseDataSection;
        let countdown;
        let request;

        $(".button-abort").on("click", function(event) {
            event.preventDefault();
            if (isAborted != null) {
                isAborted.abort();
                isAborted = null;
            }
            $('.server-error').removeClass('active');
            clearInterval(countdown);
            $(".running-generation-count").text("00:00");
            $(".progress-bar").css("width", "0%");
        });

        $(".button-post-sample").on("click", function(event) {
            event.preventDefault();
            let sample = $(this).data("sample");
            $("#topic-bulk-message").val(sample);
            if ($("#topic-bulk-message").val()) {
                $(".button-post-reset").removeAttr("disabled");
                $(".button-bulk-post-message").removeAttr("disabled");
            } else {
                $(".button-post-reset").attr("disabled", true);
                $(".button-bulk-post-message").attr("disabled", true);
            }
        });

        $('.button-bulk-post-message').on('click', function(event) {
            event.preventDefault();
            if (isAborted != null) {
                isAborted.abort();
                isAborted = null;
            }

            let button = $(this);
            let message = $("#topic-bulk-message").val();
            let message_keys = message.split("\n");
            let totalRequests = message_keys.length * 4;
            let responsesReceived = 0;
            let promises = [];

            $(button).closest(".section-content").find(".drop-down-box-wrapper").hide();
            $(button).closest(".section-content").find(".running-generation").show();

            let count = 0;
            $(button).closest(".section-content").find(".running-generation-count").text("00:00");
            countdown = setInterval(function() {
                count++;
                let minutes = Math.floor(count / 60);
                let seconds = count % 60;
                $(button).closest(".section-content").find(".running-generation-count").text((minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds));
                if (count === 0) {
                    clearInterval(countdown);
                }
            }, 1000);

            function sendRequest(index) {
                if (index >= message_keys.length) {
                    Promise.all(promises).then(function() {
                        clearInterval(countdown);
                        count = 0;
                        $(".running-generation").hide();
                        $(".running-generation-count").text("00:00");
                        $(".progress-bar").css("width", "0");
                        $(".drop-down-box-wrapper").show();
                    });
                    return;
                }

                let title_key = message_keys[index];
                if (title_key.trim() !== "") {
                    let post_language = $("#select-language").val();
                    let post_style = $("#select-style").val();
                    let post_tone = $("#select-tone").val();
                    let model_temperature = $("#model-temperature").val();
                    let section_count = $(".count-post-section").val();
                    let content_count = $(".count-post-content").val();
                    let keywords = $('#ai-buddy-content-keywords').val();
                    let keywordsBold = $('#ai-buddy-make-keywords-bold');

                    function requestData(requestType) {
                        let prompt = "";
                        let max_tokens = $('.model-max-tokens').val();
                        let model = $("#language-model-select").val();
                        switch (requestType) {
                            case "title":
                                let prompt_title_template = $("#prompt-title-template").val();
                                let prompt_title_text = prompt_title_template.replace('{TOPIC}', title_key)
                                .replace('{LANGUAGE}', post_language)
                                .replace('{WRITING_STYLE}', post_style)
                                .replace('{WRITING_TONE}', post_tone);
                                if(keywords) {
                                    prompt_title_text = prompt_title_text + ' keywords of the content will be: ' + keywords;
                                }

                                prompt = prompt_title_text;
                                max_tokens = 512;
                                break;
                            case "section":
                                let prompt_section_template = $("#prompt-section-template").val();
                                let prompt_section_text = prompt_section_template.replace('{SECTIONS_COUNT}', section_count)
                                .replace('{TITLE}', title_key)
                                .replace('{LANGUAGE}', post_language)
                                .replace('{WRITING_STYLE}', post_style)
                                .replace('{WRITING_TONE}', post_tone);
                                if(keywords) {
                                    prompt_section_text = prompt_section_text + ' keywords of the content will be: ' + keywords;
                                }

                                prompt = prompt_section_text;
                                max_tokens = 512;
                                break;
                            case "content":
                                let prompt_content_template = $("#prompt-content-template").val();
                                let prompt_content_text = prompt_content_template.replace('{PARAGRAPHS_COUNT}', content_count)
                                .replace('{TITLE}', title_key)
                                .replace('{LANGUAGE}', post_language)
                                .replace('{SECTIONS}', responseDataSection)
                                .replace('{WRITING_STYLE}', post_style)
                                .replace('{WRITING_TONE}', post_tone);
                                if(keywords) {
                                    prompt_content_text = prompt_content_text + ' keywords of the content will be: ' + keywords;
                                }
                                
                                max_tokens = parseInt(max_tokens);
                                prompt = prompt_content_text;
                                break;
                            case "excerpt":
                                let prompt_excerpt_template = $("#prompt-excerpt-template").val();
                                let prompt_excerpt_text = prompt_excerpt_template.replace('{TITLE}', title_key)
                                .replace('{LANGUAGE}', post_language)
                                .replace('{WRITING_STYLE}', post_style)
                                .replace('{WRITING_TONE}', post_tone);
                                if(keywords) {
                                    prompt_excerpt_text = prompt_excerpt_text + ' keywords of the content will be: ' + keywords;
                                }

                                prompt = prompt_excerpt_text;
                                max_tokens = 512;
                                break;
                        }
                        

                        let data = {
                            model: model,
                            messages: [{
                                "role": "user",
                                "content": prompt,
                            }],
                            max_tokens: max_tokens,
                            temperature: model_temperature
                        };
                        return isAborted = $.ajax({
                            method: "POST",
                            url: ai_buddy_content_builder.api_url,
                            data: JSON.stringify(data),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('X-WP-Nonce', ai_buddy_content_builder.nonce);
                            },
                        }).always(function() {
                            responsesReceived++;
                            let percentComplete = responsesReceived * 100 / totalRequests;
                            $(".progress-bar").css("width", percentComplete + "%");
                        });
                    }

                    requestData("title").done(function (response) {
                        let generated_post_title = response.completions;
                        requestData("section").done(function (response) {
                            responseDataSection = response.completions;
                            requestData("content").done(function (response) {
                                var response_completions = response.completions;
                                response_completions = response_completions.replace(/===INTRO:|===OUTRO:/gi, "").trim();
                                response_completions = response_completions.replace(/\n===|===/gi, "").trim();
                                if(keywords) {
                                    if (keywordsBold.is(':checked')) {
                                        keywords.split(",").sort((a, b) => a.length - b.length).forEach(function (keyword) {
                                            keyword = keyword.trim();
                                            response_completions = response_completions.replace(new RegExp(keyword, 'gi'), function(match) {
                                                return "**" + match + "**";
                                            });
                                        });
                                    }
                                }
                                let post_content = response_completions;
                                requestData("excerpt").done(function (response) {
                                    let post_excerpt = response.completions;
                                    if ($("#post-title-option").prop("checked")) {
                                        var post_title = title_key;
                                    } else {
                                        var post_title = generated_post_title;
                                    }
                                    let newPostData = {
                                        title: post_title,
                                        content: post_content,
                                        excerpt: post_excerpt,
                                    };
                                    $.ajax({
                                        method: "POST",
                                        url: ai_buddy_create_post.api_url,
                                        data: JSON.stringify(newPostData),
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        beforeSend: function (xhr) {
                                            xhr.setRequestHeader('X-WP-Nonce', ai_buddy_create_post.nonce);
                                        },
                                    }).done(function (response) {
                                        sendRequest(index + 1);
                                        let postTitle = $('<div class="generated-post-title">').html(response.post_title);
                                        let postPermalink = $('<a href="'+ response.post_permalink +'" target="_blank" class="ai-buddy-button">View</a>');
                                        let postEditLink = $('<a href="'+ response.post_edit_link +'" target="_blank" class="ai-buddy-button outline">Edit</a>');

                                        let generatedPost = $('<div class="generated-post"></div>').append(postTitle).append(postPermalink).append(postEditLink);
                                        generatedPost.appendTo('.generated-posts');
                                    });
                                    promises.push(request);
                                });
                            });
                        });
                    });
                } else {
                    clearInterval(countdown);
                    count = 0;
                    $(".running-generation").hide();
                    $(".running-generation-count").text("00:00");
                    $(".progress-bar").css("width", "0");
                    $(".drop-down-box-wrapper").show();
                }
            }
            sendRequest(0);
        });
    });
})(jQuery);
