var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fs = require('fs');
const express = require('express')
var bodyParser = require('body-parser');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname));
app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//const ssl = !!process.env.DATABASE_URL;
const port = 5000;
let arrayOfColors = '';
let counter = 0;
let counter2 = 0;
let check = 0;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

process.env.NODE_ENV = 'production'
http.listen(port, () => {
    console.log('We are live on ' + port);
});

app.get("*", function(req, res){
    if(req.url=='/') {
        res.sendFile(__dirname + '/cotodom.html');
        return;
    }
    else if (req.url == '/secret'){
        res.redirect('/');
        console.log('Наш клиент');
        check = 1;
        return;
    }else if (req.url == '/favicon.ico'){
        return;
    }
    else {
        res.redirect('/');
        console.log('Wrong page')
        return;
    }
});



fs.readFile('./colors.txt','UTF-8',(err,data)=>{
    arrayOfColors = data.split('\n');
    console.log(arrayOfColors);
});

setInterval(function() {
    if(check === 0) {
        io.emit('gif_color', getRandColor())
    } else {
        if (counter < arrayOfColors.length){
            if (counter2 === 0){
                io.emit('gif_color', '#ff00ff');
                ++counter2;
                return;
            } else if (counter2 === 1){
                io.emit('gif_color', '#220022');
                ++counter2;
                return;
            } else if (counter2 === 2){
                io.emit('gif_color', '#77ff77');
                ++counter2;
                return;
            }
            if(arrayOfColors[counter].length !==7){                             // Очистка от символа переноса строки (он палится в Wireshark)
                io.emit('gif_color', arrayOfColors[counter].slice(0,-1));
                //console.log('Dodged!!')
            }else {
                io.emit('gif_color', arrayOfColors[counter]);
            }

            console.log(`!!!!!!!!!Передан цвет ${arrayOfColors[counter]}`)
            ++counter;
        } else {
            if (counter2 === 3){
                io.emit('gif_color', '#740074');
                ++counter2;
                return;
            } else if (counter2 === 4){
                io.emit('gif_color', '#550055');
                ++counter2;
                return;
            } else if (counter2 === 5){
                io.emit('gif_color', '#00ff00');
                ++counter2;
                return;
            }
            check = 0;
            counter = 0;
            counter2 = 0;
            console.log('Передача завершена');
            io.emit('gif_color', getRandColor());
        }
    }},100);

io.on('connection', function(socket){
    console.log('new connection');
});

function getRandColor() {
    var r=Math.floor(Math.random() * (256));
    3
    var g=Math.floor(Math.random() * (256));
    4
    var b=Math.floor(Math.random() * (256));
    5
    var c='#' + r.toString(16) + g.toString(16) + b.toString(16);
    return c;
}