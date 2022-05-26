// Gõ lệnh node index.js để bắt đầu chạy server nodejs

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

//initialize the MQTT client
var options = {
    host: 'localhost',
    port: 1883,
    protocol: 'mqtts',
}
var client = mqtt.connect('mqtt:localhost:1883', { clientId: "serverjs2" });

// declare topics

var topic4 = "lamp-topic";
var topic5 = "fan-topic";
var topic6 = "dehumi-topic";

var topic_list = ["temp-humi-co2-topic"];

client.on("connect", function () {
    console.log("connected mqtt " + client.connected);
});

client.on("error", function (error) {
    console.log("Can't connect" + error);
    process.exit(1)
});



// SQL--------Temporarily use PHPMyAdmin------------------------------
var con = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'ptit',
    password: 'Ninoizmylove2610',
    database: 'ptit_database'
});

//---------------------------------------------CREATE TABLE-------------------------------------------------
con.connect(function (err) {
    if (err) throw err;
    console.log("mysql connected");
    var sql = "CREATE TABLE IF NOT EXISTS sensors11(ID int(10) not null primary key auto_increment, Time datetime not null, Temperature int(3) not null, Humidity int(3) not null, BodyTemp int(5) not null, Eco2 int(5) not null)"
    con.query(sql, function (err) {
        if (err)
            throw err;
        console.log("Table created");
    });
})

client.subscribe("temp-humi-co2-topic");

var newTemp
var newHumi
var newBodyTemp
var newEco2

//--------------------------------------------------------------------
var cnt_check = 0;
client.on('message', function (topic, message) {
    console.log("message is " + message)
    console.log("topic is " + topic)
    const objData = JSON.parse(message)
    if (topic == "temp-humi-co2-topic") {
        cnt_check = cnt_check + 1;
        newTemp  = objData.Temperature;
        newHumi  = objData.Humidity;
        newBodyTemp = objData.BodyTemp;
        newEco2 = objData.Eco2;
    }

    if (cnt_check == 1) {
        cnt_check = 0

        console.log("ready to save")
        var n = new Date()
        var month = n.getMonth() + 1
        var Date_and_Time = n.getFullYear() + "-" + month + "-" + n.getDate() + " " + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds();

        var sql = "INSERT INTO sensors11 (Time, Temperature, Humidity, BodyTemp, Eco2) VALUES ('" + Date_and_Time.toString() + "', '" + newTemp + "', '" + newHumi + "', '" + newBodyTemp + "', '" + newEco2 + "')"
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table inserted");
            console.log(Date_and_Time + " " + newTemp + " " + newHumi + " " + newBodyTemp + " " + newEco2)
        });

        exportCharts(con, io);
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
            client.publish(topic4, 'lamp-on');
        }
        else {
            console.log('lamp-topic  OFF')
            client.publish(topic4, 'lamp-off');
        }
    })

    socket.on("fan-topic-change", function (data) {
        if (data == "on") {
            console.log('fan-topic ON')
            client.publish(topic5, 'fan-on');
        }
        else {
            console.log('fan-topic OFF')
            client.publish(topic5, 'fan-off');
        }
    })


    socket.on("dehumi-topic-change", function (data) {
        if (data == "on") {
            console.log('dehumi-topic ON')
            client.publish(topic6, 'dehumi-on');
        }
        else {
            console.log('dehumi-topic OFF')
            client.publish(topic6, 'dehumi-off');
        }
    })

    // Send data to History page
    var sql1 = "SELECT * FROM sensors11 ORDER BY ID"
    con.query(sql1, function (err, result, fields) {
        if (err) throw err;
        console.log("Full Data selected");
        var fullData = []
        result.forEach(function (value) {
            var m_time = value.Time.toString().slice(4, 24);
            fullData.push({ id: value.ID, time: m_time, temp: value.Temperature, humi: value.Humidity , bodytemp: value.BodyTemp , eco2: value.Eco2})
        })
        io.sockets.emit('send-full', fullData)
    })
})

