function refreshMenus() {
    const buttons = document.querySelectorAll('.other-actions');
    for (const button of buttons) {
        button.replaceWith(button.cloneNode(true));
    }

    const actionButtons = document.querySelectorAll('.other-actions');
    const actionMenus = document.querySelectorAll('.actions-container');

    for (const actionButton of actionButtons) {
        console.log('adding event listener');
        const menu = actionButton.querySelector('.actions-container');

        actionButton.addEventListener('click', (e) => {
            console.log('help');
            e.stopPropagation();

            for (const actionMenu of actionMenus) {
                if (actionMenu === menu) {
                    continue;
                }

                actionMenu.style.display = 'none';
            }

            if (menu.style.display === 'none') {
                menu.style.display = '';
            } else {
                menu.style.display = 'none';
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.actions.container')) {
            for (const actionMenu of actionMenus) {
                actionMenu.style.display = 'none';
            }
        }
    });
}

refreshMenus();