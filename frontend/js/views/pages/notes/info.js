import Component from '../../component.js';

import Notes from '../../../models/notes.js';

class Info extends Component {
    constructor() {
		super();
		
		this.model = new Notes();
    }

    getData() {
		return new Promise(resolve => this.model.getNote(this.request.id).then(note => resolve(note)));
	}
    
    render(note) {
        return new Promise(resolve => {
            resolve(`
                <div class="note-info">
                    <p>
                        <b>Содержание заметки:</b>
                        <span>${note.text}</span>
                    </p>
            
                    <div class="info-buttons-block">
                        <a class="edit-note-btn button" href="#/note/${note.id}/edit">Изменить</a>
                        <a class="back-btn button" href="#/notes">Вернуться к заметкам</a>
                    </div>
                </div>
            `);
        });
    }
}

export default Info;
