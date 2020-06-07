import Component from '../../views/component.js';

class Footer extends Component {
    render() {
        return new Promise(resolve => {
            resolve(`
                <span>the best tasks manager ever</span>
                <span>&#169; Все права защищены. 2020</span>
            `);
        });
    }
}

export default Footer;