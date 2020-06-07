import Component from '../../views/component.js';

class Header extends Component {
    render() {
        const resource = this.request.resource;

        return new Promise(resolve => {
            resolve(`
                <section class="main-buttons">
                    <a class="main-button tasks-btn ${!resource ? 'active' : ''}" href="/#/">
                        <img src="./img/icon-task.png" alt="icon-task">
                        <span>Задачи</span>
                    </a>
                    <a class="main-button notes-btn ${resource === 'notes' ? 'active' : ''}" href="/#/notes">
                        <img src="./img/icon-note.png" alt="icon-note">
                        <span>Заметки</span>
                    </a>
                </section>
            `);
        });
    }
}

export default Header;