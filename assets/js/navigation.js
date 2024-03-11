"use strict";

var menu_parent = document.querySelector('.ai-buddy-navigation-additions');
var menu_button = document.querySelector('.additions-menu');
var menu_dropdown = document.querySelector('.support-menu');
if (menu_parent && menu_button && menu_dropdown) {
  menu_button.addEventListener('click', function (event) {
    event.preventDefault();
    menu_parent.classList.toggle('support-menu-active');
    status_parent.classList.remove('ai-status-active');
  });
  document.addEventListener('click', function (event) {
    if (!menu_parent.contains(event.target) && !menu_dropdown.contains(event.target)) {
      menu_parent.classList.remove('support-menu-active');
    }
  });
}
var status_parent = document.querySelector('.ai-buddy-navigation-additions');
var status_button = document.querySelector('.notifications-status');
var status_dropdown = document.querySelector('.ai-status');
if (status_parent && status_button && status_dropdown) {
  status_button.addEventListener('click', function (event) {
    event.preventDefault();
    status_parent.classList.toggle('ai-status-active');
    menu_parent.classList.remove('support-menu-active');
  });
  document.addEventListener('click', function (event) {
    if (!status_parent.contains(event.target) && !status_dropdown.contains(event.target)) {
      status_parent.classList.remove('ai-status-active');
    }
  });
}