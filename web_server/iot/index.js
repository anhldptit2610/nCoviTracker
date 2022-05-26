var express = require('express')  // Module xử lí chung
var mysql = require('mysql2')     // Module cho phép sử dụng cơ sở dữ liệu mySQL 
var mqtt = require('mqtt')        // Module cho phép sử dụng giao thức mqtt

var app = express()
var port = 6060                   // Port của localhost do mình chọn

var exportCharts = require('./export.js') // Require file export.js

app.use(express.static("public"))
app.set("views engine", "ejs")
app.set("views", "./views")

var server = require("http").Server(app)
var io = require('socket.io')(server)

app.get('/', function (req, res) {
    res.render('home.ejs')
})

app.get('/history', function (req, res) {
    res.render('history.ejs')
})

server.listen(port, function () {
    console.log('Server listening on port ' + port)
})

//---------------------- MQTT -------------------------

var client = mqtt.connect('mqtt://localhost:1883', { clientId: "doan_htn_jsserver" });

// declare topics

var topic4 = "lamp-topic";
var topic5 = "fan-topic";
var topic6 = "dehumi-topic";

var topic_list = ["temp-humi-bodytemp-co2-topic"];

//console.log("connected flag  " + client.connected);
client.on("connect", function () {
    console.log("connected mqtt " + client.connected);
});

client.on("error", function (error) {
    console.log("Can't connect" + error);
    process.exit(1)
});

client.subscribe("temp-humi-bodytemp-co2-topic");

// SQL--------Temporarily use PHPMyAdmin------------------------------
var con = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'anhld',
        password: 'Ninoizmylove2610',
        database: 'ptit_database'
    });

 //---------------------------------------------CREATE TABLE-------------------------------------------------
con.connect(function (err) {
    if (err) throw err;
    console.log("mysql connected");
    var sql = "CREATE TABLE IF NOT EXISTS sensors20(ID int(10) not null primary key auto_increment, Time datetime not null, Temperature int(3) not null, Humidity int(3) not null, eCO2 int(5) not null, bodytemp int(5) not null )"
    con.query(sql, function (err) {
        if (err)
            throw err;
        console.log("Table created");
    });
})

var newTemp
var newHumi
var newBodyTemp
var newEco2

//--------------------------------------------------------------------
var cnt_check = 0;
client.on('message', function (topic, message, packet) {
    console.log("message is " + message)
    console.log("topic is " + topic)
    const objData = JSON.parse(message)
    if (topic == "temp-humi-bodytemp-co2-topic") {
        cnt_check = cnt_check + 1
        newTemp  = objData.Temperature;
        newHumi  = objData.Humidity;
        newBodyTemp = objData.BodyTemp;
        newEco2 = objData.eCO2;
    }

    if (cnt_check == 1) {
        

        console.log("ready to save")
        var n = new Date()
        var month = n.getMonth() + 1
        var Date_and_Time = n.getFullYear() + "-" + month + "-" + n.getDate() + " " + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds();

        var sql = "INSERT INTO sensors20 (Time, Temperature, Humidity, eCO2, bodytemp) VALUES ('" + Date_and_Time.toString() + "', '" + newTemp + "', '" + newHumi + "', '" + newEco2 + "', '" + newBodyTemp + "')"
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table inserted");
            console.log(Date_and_Time + " " + newTemp + " " + newHumi + " " + newEco2 + " " + newBodyTemp)
        });

        exportCharts(con, io)
        cnt_check = 0
    }
})

//----Socket---------Control devices----------------------------

io.on('connection', function (socket) {
    console.log(socket.id + " connected")
    socket.on('disconnect', function () {
        console.log(socket.id + " disconnected")
    })
    
    socket.on("lamp-topic-change", function (data) {
        if (data == "on") {
            console.log('lamp-topic ON')
            client.publish(topic4, '1');
        }
        else {
            console.log('lamp-topic  OFF')
            client.publish(topic4, '0');
        }
    })

    socket.on("fan-topic-change", function (data) {
        if (data == "on") {
            console.log('fan-topic ON')
            client.publish(topic5, '1');
        }
        else {
            console.log('fan-topic OFF')
            client.publish(topic5, '0');
        }
    })


    socket.on("dehumi-topic-change", function (data) {
        if (data == "on") {
            console.log('dehumi-topic ON')
            client.publish(topic6, '1');
        }
        else {
            console.log('dehumi-topic OFF')
            client.publish(topic6, '0');
        }
    })

    // Send data to History page
    var sql1 = "SELECT * FROM sensors20 ORDER BY ID"
    con.query(sql1, function (err, result, fields) {
        if (err) throw err;
        console.log("Full Data selected");
        var fullData = []
        result.forEach(function (value) {
            var m_time = value.Time.toString().slice(4, 24);
            fullData.unshift({ id: value.ID, time: m_time, temp: value.Temperature, humi: value.Humidity , bodytemp: value.BodyTemp , eco2: value.Eco2})
        })
        io.sockets.emit('send-full', fullData)
    })
})
