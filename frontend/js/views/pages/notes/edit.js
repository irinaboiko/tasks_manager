import Component from '../../component.js';

import Notes from '../../../models/notes.js';

class Edit extends Component {
    constructor() {
		super();
		
		this.model = new Notes();
    }

    getData() {
		return new Promise(resolve => this.model.getNote(this.request.id).then(note => {
			this.note = note;
			resolve(note);
		}));
	}
    
    render(note) {
        return new Promise(resolve => {
            resolve(`
                <div class="note-edit">
                    <p>
                        <b>Содержание заметки:</b>
                        <textarea class="edit-note-text">${note.text}</textarea>
                    </p>
            
                    <div class="edit-buttons-block">
                        <button class="edit-note-btn button">Сохранить</button>
                        <a class="back-btn button" href="#/note/${note.id}">Отменить</a>
                    </div>
                </div>
            `);
        });
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const editNoteText = document.getElementsByClassName('edit-note-text')[0],
            editBtn = document.getElementsByClassName('edit-note-btn')[0];
        
        editBtn.addEventListener('click', () => this.editNote(editNoteText));

        editNoteText.addEventListener('keypress', () => {
            (event.key === 'Enter') && this.editNote(editNoteText);
        });
    }

    editNote(editNoteText) {
        this.note.text = editNoteText.value.trim();

        this.model.editNote(this.note).then(() => this.redirectToNoteInfo());
    }

    redirectToNoteInfo() {
		location.hash = `#/note/${this.note.id}`;
	}
}

export default Edit;
