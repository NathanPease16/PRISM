// Import needed modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const constants = require('./server/global/constants');
const jsonData = require('./server/scripts/jsonData');

jsonData();

/*
// If data files don't exist, generate them
if (!fs.existsSync(constants.JSON_DATA)) {
    fs.mkdirSync(constants.JSON_DATA);
    const templates = fs.readdirSync(constants.JSON_TEMPLATES);
    
    for (const template of templates) {
        const templateName = template.split('.')[0];
        const templateContent = fs.readFileSync(path.join(constants.JSON_TEMPLATES, template));

        fs.writeFileSync(path.join(constants.JSON_DATA, templateName + '.json'), templateContent);
    }
}
*/

const app = express();
const PORT = 8080;

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static('public/css'));
app.use('/img', express.static('public/img'));

app.use(bodyParser.json());

app.use(require('./server/routes/router.js'));
app.use(require('./server/routes/internal.js'));

io.on('connection', (socket) => {
    socket.on('timer', (msg) => {
        io.emit('timer', msg);
    })

    socket.on('disconnect', () => {
    });
});

server.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server running at http://localhost:${PORT}`);
    } else {
        console.log(`Server startup failed:\n${error}`);
    }
});

module.exports = app;