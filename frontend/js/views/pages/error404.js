import Component from '../../views/component.js';

class Error404 extends Component {
    render() {
        return new Promise(resolve => {
            resolve(`                
                <h2 class="page-404">Хьюстон, у нас 404 - Страница не найдена</h2>              
            `);
        });
    }
}

export default Error404;