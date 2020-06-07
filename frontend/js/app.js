import {parseRequestURL} from './helpers/utils.js';

import Header from './views/partials/header.js';
import Footer from './views/partials/footer.js';

import Error404 from './views/pages/error404.js';

import AddAndListTasks from './views/pages/tasks/categories.js';

import AddAndListNotes from './views/pages/notes/add-list-notes.js';
import Info from './views/pages/notes/info.js';
import Edit from './views/pages/notes/edit.js';

const Routes = {
    '/': AddAndListTasks,
    '/notes': AddAndListNotes,
    '/note/:id': Info,
    '/note/:id/edit': Edit,
};

function router() {
    const headerContainer = document.getElementById('header-block'),
          contentContainer = document.getElementById('content-block'),
          footerContainer = document.getElementById('footer-container'),
          header = new Header(),
          footer = new Footer();

    header.render().then(html => headerContainer.innerHTML = html);

    const request = parseRequestURL(),
        parsedURL = `/${request.resource || ''}${request.id ? '/:id' : ''}${request.action ? `/${request.action}` : ''}`,
        page = Routes[parsedURL] ? new Routes[parsedURL]() : new Error404();

    page.getData().then(data => {
        page.render(data).then(html => {
            contentContainer.innerHTML = html;
            page.afterRender();
        });
    });

    footer.render().then(html => footerContainer.innerHTML = html);
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);