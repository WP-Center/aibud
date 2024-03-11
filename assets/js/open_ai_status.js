"use strict";

(function ($) {
  $(document).ready(function () {
    var cache_key = 'ai_buddy_openai_incidents';

    // Check for data in localStorage
    var incidents = localStorage.getItem(cache_key);
    if (incidents) {
      displayIncidents(JSON.parse(incidents));
    } else {
      $.ajax({
        method: "GET",
        url: ai_buddy_status.api_url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', ai_buddy_status.nonce);
        },
        success: function success(response) {
          localStorage.setItem(cache_key, JSON.stringify(response.incidents));
          displayIncidents(response.incidents);
        },
        error: function error(xhr, status, _error) {}
      });
    }

    // Function for displaying incidents
    function displayIncidents(incidents) {
      $('.ai-status-content-inside').empty();
      $.each(incidents, function (index, incident) {
        var timestamp = incident.date;
        var date = new Date(timestamp * 1000);
        var formattedDate = "".concat(date.getFullYear(), "/").concat((date.getMonth() + 1).toString().padStart(2, '0'), "/").concat(date.getDate().toString().padStart(2, '0'));
        var newClass = '';
        $('.ai-status-content-inside').append('<div class="ai-status-content' + newClass + '"><div class="ai-status-title-box"><div class="ai-status-title">' + incident.title + '</div><div class="ai-status-date">' + formattedDate + '</div></div><div class="ai-status-description">' + incident.description + '</div></div>');
      });
      $('.ai-status-content-inside').on('click', '.ai-status-content.new', function () {
        $(this).removeClass('new');
      });
    }
  });
})(jQuery);