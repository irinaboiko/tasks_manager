class Notes {
    getNotesList() {
    	return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('GET', 'http://localhost:9876/api/notes');

			xhr.onload = () => resolve(JSON.parse(xhr.response));

			xhr.send();
		});
    }

    addNote(newNote) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('POST', 'http://localhost:9876/api/note');
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve(JSON.parse(xhr.response));

			xhr.send(JSON.stringify(newNote));
		});
	}

	getNote(id) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('GET', `http://localhost:9876/api/note/${id}`, true);

			xhr.onload = () => resolve(JSON.parse(xhr.response));

			xhr.send();
		});
	}
	
	editNote(updatedNote) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('PUT', `http://localhost:9876/api/note/${updatedNote.id}`, true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve();

			xhr.send(JSON.stringify(updatedNote));
		});
	}

    removeNote(id) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('DELETE', `http://localhost:9876/api/note/${id}`);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve();

			xhr.send();
		})
	}
}

export default Notes;