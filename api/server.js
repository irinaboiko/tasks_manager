const express = require('express'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
	  fs = require('file-system'),
	  shortId = require('shortid'),
	  dbNotePath = 'notes.json',
	  dbTaskPath = 'tasks.json',
      app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

//CATEGORIES

app.get('/api/categories', (req, res) => {
	res.send(getTasksCategoriesFromDB());
});

app.post('/api/category', (req, res) => {
	const tasksCategoriesData = getTasksCategoriesFromDB(),
		category = req.body;

	category.id = shortId.generate();
	category.caption = category.caption;
	category.tasks = [];

    tasksCategoriesData.push(category);
    setTasksCategoriesToDB(tasksCategoriesData);

	res.send(category);
});

app.delete('/api/category/:id', (req, res) => {
	const tasksCategoriesData = getTasksCategoriesFromDB(),
		categories = tasksCategoriesData.filter(category => category.id != req.params.id);

	setTasksCategoriesToDB(categories);
	res.sendStatus(204);
});

//TASKS

app.post('/api/category/task', (req, res) => {
	const tasksCategoriesData = getTasksCategoriesFromDB(),
		newTask = req.body,
		category = tasksCategoriesData.find(category => category.id === newTask.categoryID);

	newTask.id = shortId.generate();
	newTask.description = newTask.description;
	newTask.status = 'in progress';

	category.tasks.push(newTask);
    setTasksCategoriesToDB(tasksCategoriesData);

	res.send(newTask);
});

app.put('/api/category/:categoryID/:id', (req, res) => {
	const tasksCategoriesData = getTasksCategoriesFromDB(),
		category = tasksCategoriesData.find(category => category.id === req.params.categoryID);

	task = category.tasks.find(task => task.id === req.params.id);

	task.status = `${task.status === 'in progress' ? 'done' : 'in progress'}`;

	setTasksCategoriesToDB(tasksCategoriesData);

	res.sendStatus(204);
});

app.delete('/api/category/:categoryID/:id', (req, res) => {
	const tasksCategoriesData = getTasksCategoriesFromDB(),
		category = tasksCategoriesData.find(category => category.id === req.params.categoryID);
		
	category.tasks = category.tasks.filter(task => task.id != req.params.id);

	setTasksCategoriesToDB(tasksCategoriesData);

	res.sendStatus(204);
});

//NOTES

app.get('/api/notes', (req, res) => {
	res.send(getNotesFromDB());
});

app.post('/api/note', (req, res) => {
	const notesData = getNotesFromDB(),
		note = req.body;

	note.id = shortId.generate();
	note.text = note.text;

    notesData.push(note);
    setNotesToDB(notesData);

	res.send(note);
});

app.get('/api/note/:id', (req, res) => {
	const notesData = getNotesFromDB(),
		note = notesData.find(note => note.id === req.params.id);

	note ? res.send(note) : res.send({});
});

app.put('/api/note/:id', (req, res) => {
	const notesData = getNotesFromDB(),
		note = notesData.find(note => note.id === req.params.id),
		updatedNote = req.body;

	note.text = updatedNote.text;

    setNotesToDB(notesData);

	res.sendStatus(204);
});

app.delete('/api/note/:id', (req, res) => {
	const notesData = getNotesFromDB(),
		notes = notesData.filter(note => note.id != req.params.id);

	setNotesToDB(notes);
	res.sendStatus(204);
});

function getNotesFromDB() {
    return JSON.parse(fs.readFileSync(dbNotePath, 'utf8'));
}

function setNotesToDB(notesData) {
    fs.writeFileSync(dbNotePath, JSON.stringify(notesData));
}

function getTasksCategoriesFromDB() {
    return JSON.parse(fs.readFileSync(dbTaskPath, 'utf8'));
}

function setTasksCategoriesToDB(tasksCategoriesData) {
    fs.writeFileSync(dbTaskPath, JSON.stringify(tasksCategoriesData));
}

app.listen(9876, () => console.log('Server has been started...'));