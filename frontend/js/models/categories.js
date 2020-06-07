class Categories {

	//CATEGORIES

    getTasksCategoriesList() {
    	return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('GET', 'http://localhost:9876/api/categories');

			xhr.onload = () => {
				try {
					resolve(JSON.parse(xhr.response));
				} catch(error) {
					throw new Error('Что-то пошло не так :(');
				}
			}

			xhr.send();
		});
    }

    addCategory(newCategory) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('POST', 'http://localhost:9876/api/category');
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve(JSON.parse(xhr.response));

			xhr.send(JSON.stringify(newCategory));
		});
	}

	removeCategory(id) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('DELETE', `http://localhost:9876/api/category/${id}`);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve();

			xhr.send();
		})
	}

	//TASKS

	addTask(newTask) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('POST', 'http://localhost:9876/api/category/task');
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve(JSON.parse(xhr.response));

			xhr.send(JSON.stringify(newTask));
		});
	}

	changeTaskStatus(id, categoryID) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('PUT', `http://localhost:9876/api/category/${categoryID}/${id}`, true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve();

			xhr.send();
		});
	}

	removeTask(id, categoryID) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('DELETE', `http://localhost:9876/api/category/${categoryID}/${id}`);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve();

			xhr.send();
		})
	}
}

export default Categories;