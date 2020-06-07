import Component from '../../component.js';

import Categories from '../../../models/categories.js';

class AddAndListTasks extends Component {
    constructor() {
		super();
		
		this.model = new Categories();
    }

    getData() {
		return new Promise(resolve => this.model.getTasksCategoriesList().then(categories => {
            this.categories = categories;
            resolve(categories);
        }));
	}

    render(categories) {
        return new Promise(resolve => {
            resolve(`
                <section class="tasks-block">
                    <div class="categories-block">
                        ${categories.map(category => this.getCategoryAndTasksHTML(category)).join('\n ')}
                    </div>
                    <button class="button-add-category"><img src="./img/btn-add.png" alt="btn-icon"> Добавить категорию</button>
                </section>
            `);
        });
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const addCategoryBtn = document.getElementsByClassName('button-add-category')[0],
            categoriesContainer = document.getElementsByClassName('categories-block')[0];

        document.addEventListener('mousemove', this.parallax);
        
        addCategoryBtn.addEventListener('click', () => this.showInputForCategory(categoriesContainer, addCategoryBtn));

        categoriesContainer.addEventListener('click', event => {
            const target = event.target,
                targetClassList = target.classList;

            switch(true) {
                case targetClassList.contains('category-name'):
                    this.accordionToggle(target, target.parentNode);
                    break;

                case targetClassList.contains('button-add-task'):
                    this.showInputForTask(target.parentNode.parentNode, target.parentNode);
                    break;
                
                case targetClassList.contains('remove-category'):
                    this.removeCategory(target.parentNode);
                    break;
                
                case targetClassList.contains('task'):
                    this.changeTaskStatus(target, target.parentNode.parentNode.parentNode.parentNode);
                    break;
                case targetClassList.contains('check-mark'):
                    this.changeTaskStatus(target.parentNode, target.parentNode.parentNode.parentNode.parentNode.parentNode);
                        break;

                case targetClassList.contains('remove-task'):
                    this.removeTask(target.parentNode, target.parentNode.parentNode.parentNode.parentNode, target.parentNode.parentNode.parentNode);
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

    accordionToggle(categoryName, categoryBlock) {
        const accordionBlock = categoryBlock.getElementsByClassName('accordion-block')[0];

        accordionBlock.style.maxHeight = accordionBlock.style.maxHeight ? null : `${accordionBlock.scrollHeight}px`;

        categoryName.classList.toggle('active');
    }

    showInputForCategory(categoriesContainer, addCategoryBtn) {
        categoriesContainer.insertAdjacentHTML('beforeEnd', '<input class="add-categoty-name"></input>');
        const inputForCategoryName = document.getElementsByClassName('add-categoty-name')[0];
        
        inputForCategoryName.focus();

        inputForCategoryName.addEventListener('keypress', () => {
            (event.key === 'Enter') && inputForCategoryName.blur();
        });

        inputForCategoryName.addEventListener('blur', () => {
            if (inputForCategoryName.value.trim()) {
                this.addCategory(categoriesContainer, inputForCategoryName);
            } else {
                inputForCategoryName.remove();
            }
        });
    }

    showInputForTask(taskBlock, accordionBlock) {
        const tasksContainer = taskBlock.getElementsByClassName('tasks-container')[0];
        tasksContainer.insertAdjacentHTML('beforeEnd', '<input class="add-task-description"></input>');
        accordionBlock.style.maxHeight = `${accordionBlock.scrollHeight}px`;
        
        const inputForTaskDescription = taskBlock.getElementsByClassName('add-task-description')[0];
        inputForTaskDescription.focus();

        inputForTaskDescription.addEventListener('keypress', () => {
            (event.key === 'Enter') && inputForTaskDescription.blur();
        });

        inputForTaskDescription.addEventListener('blur', () => {
            if (inputForTaskDescription.value.trim()) {
                this.addTask(taskBlock, tasksContainer, inputForTaskDescription, accordionBlock);
            } else {
                inputForTaskDescription.remove();
                accordionBlock.style.maxHeight = `${accordionBlock.scrollHeight}px`;
            }
        });
    }

    addCategory(categoriesContainer, inputForCategoryName) {
        const newCategory = {
            caption: inputForCategoryName.value.trim(),
        };

        this.model.addCategory(newCategory).then(category => {
            categoriesContainer.insertAdjacentHTML('beforeEnd', this.getCategoryHTML(category));
            inputForCategoryName.remove();
        }); 
    }

    addTask(taskBlock, tasksContainer, inputForTaskDescription, accordionBlock) {
        const newTask = {
            categoryID: taskBlock.dataset.id,
            description: inputForTaskDescription.value.trim(),
        };

        this.model.addTask(newTask).then(task => {
            tasksContainer.insertAdjacentHTML('beforeEnd', this.getTaskHTML(task));
            inputForTaskDescription.remove();
            accordionBlock.style.maxHeight = `${accordionBlock.scrollHeight}px`;
        });
    }

    getCategoryAndTasksHTML(category) {
        return `
            <div class="category-block" data-id="${category.id}">
                <div class="category-name" data-id="${category.id}">${category.caption}</div>
                <div class="accordion-block">
                    <div class="tasks-container">
                        ${category.tasks.map(task => this.getTaskHTML(task)).join('\n ')}
                    </div>
                    <button class="button-add-task"></button>
                </div>
                <button class="remove-category"></button>
            </div>
        `;
    }

    getCategoryHTML(category) {
        return `
            <div class="category-block" data-id="${category.id}">
                <div class="category-name" data-id="${category.id}">${category.caption}</div>
                <div class="accordion-block">
                    <div class="tasks-container"></div>
                    <button class="button-add-task"></button>
                </div>
                <button class="remove-category"></button>
            </div>
        `;
    }

    getTaskHTML(task) {
        return `
            <div class="task-container" data-id="${task.id}">
                <div class="task ${task.status === 'done' ? 'task-done' : ''}" data-id="${task.id}"><span class="check-mark"></span>${task.description}</div>
                <button class="remove-task"></button>
            </div>
        `;
    }

    changeTaskStatus(currentTask, allTasksContainer) {
        this.model.changeTaskStatus(currentTask.dataset.id, allTasksContainer.dataset.id).then(() => {
            currentTask.classList.toggle('task-done');
        });
    }

    removeCategory(categoryContainer) {
        if (confirm('Точно удалить?')) {
            this.model.removeCategory(categoryContainer.dataset.id).then(() => {
                categoryContainer.remove();
            });
        }
    }

    removeTask(taskContainer, allTasksContainer, accordionBlock) {
        if (confirm('Точно удалить?')) {
            this.model.removeTask(taskContainer.dataset.id, allTasksContainer.dataset.id).then(() => {
                taskContainer.remove();
                accordionBlock.style.maxHeight = `${accordionBlock.scrollHeight}px`;
            });
        }
    }
}

export default AddAndListTasks;
