var date_graph = [];
var humi_graph = [];
var temp_graph = [];
var bodyTemp_graph = [];
var eco2_graph = [];

function exportChart(con, io) {
    var m_time
    var newTemp
    var newHumi
    var newBodyTemp
    var newEco2

    var sql1 = "SELECT * FROM sensors20 ORDER BY ID DESC limit 1"
    con.query(sql1, function (err, result, fields) {
        if (err) throw err;
        console.log("Data selected");
        result.forEach(function (value) {
            m_time = value.Time.toString().slice(4, 24);
            newTemp = value.Temperature
            newHumi = value.Humidity
            newBodyTemp = value.bodytemp
            newEco2 = value.eCO2
            console.log(m_time + " " + value.Temperature + " " + value.Humidity + " " + value.BodyTemp + " " + value.Eco2);

            io.sockets.emit('server-update-data',
                { id: value.ID, time: m_time, temp: value.Temperature, humi: value.Humidity, bodyTemp: value.bodytemp, eco2: value.eCO2})
        })
        if (humi_graph.length < 20) {
            humi_graph.push(newHumi);
        }
        else {
            for (i = 0; i < 19; i++) {
                humi_graph[i] = humi_graph[i + 1];
            }
            humi_graph[19] = newHumi;
        }

        if (temp_graph.length < 20) {
            temp_graph.push(newTemp);
        }
        else {
            for (u = 0; u < 19; u++) {
                temp_graph[u] = temp_graph[u + 1];
            }
            temp_graph[19] = newTemp;
        }

        if (date_graph.length < 20) {
            date_graph.push(m_time);
        }
        else {
            for (x = 0; x < 19; x++) {
                date_graph[x] = date_graph[x + 1];
            }
            date_graph[19] = m_time;
        }

        if (bodyTemp_graph.length < 20) {
            bodyTemp_graph.push(newBodyTemp);
        }
        else {
            for (x = 0; x < 19; x++) {
                bodyTemp_graph[x] = bodyTemp_graph[x + 1];
            }
            bodyTemp_graph[19] = newBodyTemp;
        }

        if (eco2_graph.length < 20) {
            eco2_graph.push(newEco2);
        }
        else {
            for (x = 0; x < 19; x++) {
                eco2_graph[x] = eco2_graph[x + 1];
            }
            eco2_graph[19] = newEco2;
        }

        io.sockets.emit("server-send-humi_graph", humi_graph);
        io.sockets.emit("server-send-temp_graph", temp_graph);
        io.sockets.emit("server-send-date_graph", date_graph);
        io.sockets.emit("server-send-bodyTemp_graph", bodyTemp_graph);
        io.sockets.emit("server-send-eco2_graph", eco2_graph);
    });

}

module.exports = exportChart