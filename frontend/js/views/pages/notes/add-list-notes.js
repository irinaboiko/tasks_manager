import Component from '../../component.js';

import Notes from '../../../models/notes.js';

class AddAndListNotes extends Component {
    constructor() {
		super();
		
		this.model = new Notes();
    }

    getData() {
		return new Promise(resolve => this.model.getNotesList().then(notes => {
            this.notes = notes;
            resolve(notes);
        }));
	}
    
    render(notes) {
        return new Promise(resolve => {
            resolve(`
                <section>
                    <div class="add-notes-block">
                        <textarea class="add-note" placeholder="Что запишем?"></textarea>
                        <button class="button-add-note" disabled></button>
                    </div>
                    <div class="notes-block">
                        ${notes.map(note => this.getNoteHTML(note)).join('\n ')}
                    </div>
                </section>
            `);
        });
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const notesContainer = document.getElementsByClassName('notes-block')[0],
            addNoteBtn = document.getElementsByClassName('button-add-note')[0],
            addNoteText = document.getElementsByClassName('add-note')[0],
            removeNoteBtn = document.getElementsByClassName('remove-note')[0];

        document.addEventListener('mousemove', this.parallax);
                
        addNoteText.addEventListener('keyup', () => addNoteBtn.disabled = !addNoteText.value.trim());
        
        addNoteBtn.addEventListener('click', () => this.addNote(notesContainer, addNoteText, addNoteBtn));
        addNoteText.addEventListener('keypress', () => {
            (event.key === 'Enter') && this.addNote(notesContainer, addNoteText, addNoteBtn);
        });

        notesContainer.addEventListener('click', event => {
            const target = event.target,
                targetClassList = target.classList;

            switch(true) {
                case targetClassList.contains('remove-note'):
                    this.removeNote(target.parentNode);
                    break;
            }
        });
    }

    parallax(event) {
        const layers = [];
        layers.push.apply(layers, document.getElementsByClassName('layer'));

        layers.forEach(layer => {
            const speed = layer.getAttribute('data-speed');
            
            layer.style.transform = `translate(${event.clientX * speed / 900}px, ${event.clientY * speed / 900}px)`;
        });
    }

    addNote(notesContainer, addNoteText, addNoteBtn) {
        const newNote = {
            text: addNoteText.value.trim(),
        };

        this.model.addNote(newNote).then(note => {
            this.clearAddTask(addNoteText, addNoteBtn);
            notesContainer.insertAdjacentHTML('beforeEnd', this.getNoteHTML(note));
        });
    }

    getNoteHTML(note) {
        return `
            <div class="note-block" data-id="${note.id}">
                <a class="note edit-note-btn" href="#/note/${note.id}/edit" data-id="${note.id}">${note.text}</a>
                <button class="remove-note"></button>
                
            </div>
        `;
    }

    clearAddTask(addNoteText, addNoteBtn) {
		addNoteText.value = '';
        addNoteBtn.disabled = true;
    }
	
    removeNote(noteContainer) {
        if (confirm('Точно удалить?')) {
            this.model.removeNote(noteContainer.dataset.id).then(() => {
                noteContainer.remove();
            });
        }
    }
}

export default AddAndListNotes;
