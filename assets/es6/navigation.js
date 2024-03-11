const menu_parent = document.querySelector('.ai-buddy-navigation-additions');
const menu_button = document.querySelector('.additions-menu');
const menu_dropdown = document.querySelector('.support-menu');

if (menu_parent && menu_button && menu_dropdown) {
    menu_button.addEventListener('click', (event) => {
        event.preventDefault();
        menu_parent.classList.toggle('support-menu-active');
        status_parent.classList.remove('ai-status-active');
    });

    document.addEventListener('click', (event) => {
        if (!menu_parent.contains(event.target) && !menu_dropdown.contains(event.target)) {
            menu_parent.classList.remove('support-menu-active');
        }
    });
}

const status_parent = document.querySelector('.ai-buddy-navigation-additions');
const status_button = document.querySelector('.notifications-status');
const status_dropdown = document.querySelector('.ai-status');

if (status_parent && status_button && status_dropdown) {
    status_button.addEventListener('click', (event) => {
        event.preventDefault();
        status_parent.classList.toggle('ai-status-active');
        menu_parent.classList.remove('support-menu-active');
    });

    document.addEventListener('click', (event) => {
        if (!status_parent.contains(event.target) && !status_dropdown.contains(event.target)) {
            status_parent.classList.remove('ai-status-active');
        }
    });
}
