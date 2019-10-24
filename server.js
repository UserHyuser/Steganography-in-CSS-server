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
let change = 0;

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
        //console.log('Wrong page')
        return;
    }
});

fs.readFile('./colors.txt','UTF-8',(err,data)=>{
    arrayOfColors = data.split('\n');
    console.log(arrayOfColors);
});
let date = '';
let dateGlob = 0;
let changeTMP = 0;
let help1,help2,help3,help5,help6,help7;
setInterval(function() {
    if(check === 1) {
        if (counter < arrayOfColors.length){
            if (dateGlob === 0) {
                date = new Date;
                let tmpDate = date.getSeconds().toString();
                date = date.getMinutes().toString();
                if(date === '59' || date === '00' || tmpDate > '56' || tmpDate < '4'){
                    date = '38';
                } else if (date < 10){
                    date = '0' + date;
                }
                //console.log(date);
                dateGlob = 1;
                letHelp();
            }
            if (counter2 === 0){
                io.emit('gif_color', getRandColor(help1));
                ++counter2;
                return;
            } else if (counter2 === 1){
                io.emit('gif_color', getRandColor(help2));
                ++counter2;
                return;
            } else if (counter2 === 2){
                io.emit('gif_color', getRandColor(help3));
                ++counter2;
                return;
            }
            if(arrayOfColors[counter].length !==3){                             
                io.emit('gif_color', getRandColor(arrayOfColors[counter].slice(0,-1)));
                //console.log('Dodged!!')
            }else {
                io.emit('gif_color', getRandColor(arrayOfColors[counter]));
            }
            console.log(`Передан цвет ${arrayOfColors[counter]}`)
            ++counter;
        } else {
            if (counter2 === 3){
                io.emit('gif_color', getRandColor(help5));
                ++counter2;
                return;
            } else if (counter2 === 4){
                io.emit('gif_color', getRandColor(help6));
                ++counter2;
                return;
            } else if (counter2 === 5){
                io.emit('gif_color', getRandColor(help7));
                ++counter2;
                return;
            }
            check = 0;
            counter = 0;
            counter2 = 0;
            dateGlob = 0;
            console.log('Передача завершена');
            io.emit('gif_color', getRandColor());
        }
    } else {
        io.emit('gif_color', getRandColor())
    }},1000);

io.on('connection', function(socket){
    console.log('new connection');
});

setInterval(function () {
    io.emit('time', )
},60000)




function letHelp() {
    help1 = (((date[0])*10)%16).toString(16) +
        (((date[1]))%16).toString(16) +
        (((date[0])+8)%16).toString(16);
    help2 = (((date[1])*10)%16).toString(16) +
        (((date[1])*9)%16).toString(16) +
        (((date[1])*4)%16).toString(16);
    help3 = (((date[0])**3)%16).toString(16) +
        (((date[1]))%16).toString(16) +
        (((date[1])**4)%16).toString(16);
    help5 = (((date[1])+6)%16).toString(16) +
        (((date[1])+8)%16).toString(16) +
        (((date[0])+3)%16).toString(16);
    help6 = (((date[1])+9)%16).toString(16) +
        (((date[0])+7)%16).toString(16) +
        (((date[1])**3)%16).toString(16);
    help7 = (((date[1])+1)%16).toString(16) +
        (((date[0])+5)%16).toString(16) +
        (((date[0])*7)%16).toString(16);
}

function getRandColor(str) {
    let pudge = str || '';
    var r=Math.floor(Math.random() * (16));
    3
    var g=Math.floor(Math.random() * (16));
    4
    var b=Math.floor(Math.random() * (16));
    5

    if (change === 0){
        var c='#' +'f' + r.toString(16) +'0'+ g.toString(16) + '0' + b.toString(16);
        if(pudge !== ''){
            c = '#f' + pudge[0] + '0' + pudge[1] + '0' + pudge[2];
        }
    } else if (change === 1){
        var c='#' + "f" + r.toString(16) + "5" + g.toString(16) + "0" + b.toString(16);
        if(pudge !== ''){
            c = '#f' + pudge[0] + '5' + pudge[1] + '0' + pudge[2];
        }
    }else if (change === 2){
        var c='#' + "f" + r.toString(16) + "f" + g.toString(16)+ "0" + b.toString(16);
        if(pudge !== ''){
            c = '#f' + pudge[0] + 'f' + pudge[1] + '0' + pudge[2];
        }
    }else if (change === 3){
        var c='#' + "0" + r.toString(16) + "f" + g.toString(16) + "0" + b.toString(16);
        if(pudge !== ''){
            c = '#0' + pudge[0] + 'f' + pudge[1] + '0' + pudge[2];
        }
    }else if (change === 4){
        var c='#' + "0" + r.toString(16) + "f" + g.toString(16) + "f" + b.toString(16);
        if(pudge !== ''){
            c = '#0' + pudge[0] + 'f' + pudge[1] + 'f' + pudge[2];
        }
    }else if (change === 5){
        var c='#' + "0" + r.toString(16) + "0" + g.toString(16) + "f" + b.toString(16);
        if(pudge !== ''){
            c = '#0' + pudge[0] + '0' + pudge[1] + 'f' + pudge[2];
        }
    }else if (change === 6){
        var c='#' + "8" + r.toString(16) + "0" + g.toString(16) + "8" + b.toString(16);
        if(pudge !== ''){
            c = '#8' + pudge[0] + '0' + pudge[1] + '8' + pudge[2];
        }
        change = 0;
        return c;
    }
    change++;
    //console.log(c);
    return c;
}