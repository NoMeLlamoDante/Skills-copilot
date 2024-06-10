//Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;

//Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Set up body parser
app.use(bodyParser.urlencoded({extended: false}));

//Set up static files
app.use(express.static(path.join(__dirname, 'public')));

//Set up comments array
let comments = [];

//Set up file path
const filePath = path.join(__dirname, 'data', 'comments.json');

//Read comments from file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log('Error reading file:', err);
    } else {
        comments = JSON.parse(data);
    }
});

//GET route to /comments
app.get('/comments', (req, res) => {
    res.render('comments', {comments});
});

//POST route to /comments
app.post('/comments', (req, res) => {
    const newComment = req.body.comment;
    comments.push(newComment);
    fs.writeFile(filePath, JSON.stringify(comments), (err) => {
        if (err) {
            console.log('Error writing file:', err);
        }
    });
    res.redirect('/comments');
});

//Start server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});