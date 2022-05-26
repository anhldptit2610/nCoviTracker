/* SmtpJS.com - v3.0.0 */
var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

var socket = io("http://192.168.43.81:6060")

socket.on("server-update-data", function (data) {

    // Home page
    $("#currentTemp").html(data.temp)
    $("#currentHumi").html(data.humi)
    $("#currentBodyTemp").html(data.bodyTemp)
    $("#currentEco2").html(data.eco2)

    // Warning mode
    var warningSection = document.getElementById("warningSection")
    var warningSection1 = document.getElementById("warningSection1")
    var warningSection2 = document.getElementById("warningSection2")
    var warningSection3 = document.getElementById("warningSection3")
    var warningSection4 = document.getElementById("warningSection4")
    if (data.temp > 20){
        warningSection.classList.add("warning-mode-on")
        warningSection4.classList.add("warning-mode-on")
    }
    else{
        warningSection.classList.remove("warning-mode-on")
        warningSection4.classList.remove("warning-mode-on")
    }
    if (data.humi > 90 || data.humi < 50){
        warningSection1.classList.add("warning-mode-on")
        warningSection4.classList.add("warning-mode-on")
    }
    else{
        warningSection1.classList.remove("warning-mode-on")
        warningSection4.classList.remove("warning-mode-on")
    }

    if (data.bodyTemp > 38){
        warningSection2.classList.add("warning-mode-on")
        warningSection4.classList.add("warning-mode-on")
    }
    else{
        warningSection2.classList.remove("warning-mode-on")
        warningSection4.classList.remove("warning-mode-on")
    }

    if (data.eco2 > 2000){
        warningSection3.classList.add("warning-mode-on")
        warningSection4.classList.add("warning-mode-on")
    }
    else{
        warningSection3.classList.remove("warning-mode-on")
        warningSection4.classList.remove("warning-mode-on")
    }

    var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };


    function sendEmail(){
        if(data.temp > 35){
            Email.send({
            
                Host: "smtp.elasticemail.com", 
                Username: "nguyenvanhuan23062000hn@gmail.com",
                Password: "3E39866F95DDF6CA47A07027B6D44DE9017F",
                To: "huanaws088@gmail.com",
                From: "nguyenvanhuan23062000hn@gmail.com",
                Subject : "Cảnh báo Nhiệt Độ",
                Body :  `Nhiệt độ phòng: ${data.temp} <br>`,
              }).then((success) => {
               
                alert("message sent successfully. Please check the spam folder in your mail.");
              }).catch((error) => {
                  
                alert("error sending message");
            })
        }

        if(data.humi > 90 || data.humi < 50){
            Email.send({
            
                Host: "smtp.elasticemail.com", 
                Username: "nguyenvanhuan23062000hn@gmail.com",
                Password: "3E39866F95DDF6CA47A07027B6D44DE9017F",
                To: "huanaws088@gmail.com",
                From: "nguyenvanhuan23062000hn@gmail.com",
                Subject : "Cảnh báo Độ Ẩm",
                Body :  `Độ ẩm phòng: ${data.temp} <br>`,
              }).then((success) => {
               
                alert("message sent successfully. Please check the spam folder in your mail.");
              }).catch((error) => {
                  
                alert("error sending message");
            })
        }

        if(data.bodyTemp > 38){
            Email.send({
                Host: "smtp.elasticemail.com", 
                Username: "nguyenvanhuan23062000hn@gmail.com",
                Password: "3E39866F95DDF6CA47A07027B6D44DE9017F",
                To: "huanaws088@gmail.com",
                From: "nguyenvanhuan23062000hn@gmail.com",
                Subject : "Cảnh báo Thân Nhiệt",
                Body :  `Nhiệt độ cơ thể: ${data.bodyTemp} <br>`,
              }).then((success) => {
               
                alert("message sent successfully. Please check the spam folder in your mail.");
              }).catch((error) => {
                  
                alert("error sending message");
            })
        }

        if(data.eco2 > 2000){
            Email.send({
            
                Host: "smtp.elasticemail.com", 
                Username: "nguyenvanhuan23062000hn@gmail.com",
                Password: "3E39866F95DDF6CA47A07027B6D44DE9017F",
                To: "huanaws088@gmail.com",
                From: "nguyenvanhuan23062000hn@gmail.com",
                Subject : "Cảnh báo chất lượng không khí",
                Body :  `Chất lượng không khí: ${data.eco2} <br>`,
              }).then((success) => {
               
                alert("message sent successfully. Please check the spam folder in your mail.");
              }).catch((error) => {
                  
                alert("error sending message");
            })
        }
    }
    setInterval(sendEmail, 10000);


    //History page
    $("#id-content").append("<div class='h-para'>" + data.id + "</div>")
    $("#time-content").append("<div class='h-para'>" + data.time + "</div>")
    $("#temp-content").append("<div class='h-para'>" + data.temp + "</div>")
    $("#humi-content").append("<div class='h-para'>" + data.humi + "</div>")
    $("#bodyTemp-content").append("<div class='h-para'>" + data.bodyTemp + "</div>")
    $("#eco2-content").append("<div class='h-para'>" + data.eco2 + "</div>")
})

socket.on("send-full", function (data) {

    // History page
    $("#id-content").html("")
    $("#time-content").html("")
    $("#temp-content").html("")
    $("#humi-content").html("")
    $("#bodyTemp-content").html("")
    $("#eco2-content").html("")

    console.log(data)
    data.forEach(function (item) {
        $("#id-content").append("<div class='h-para'>" + item.id + "</div>")
        $("#time-content").append("<div class='h-para'>" + item.time + "</div>")
        $("#temp-content").append("<div class='h-para'>" + item.temp + "</div>")
        $("#humi-content").append("<div class='h-para'>" + item.humi + "</div>")
        $("#bodyTemp-content").append("<div class='h-para'>" + item.bodyTemp + "</div>")
        $("#eco2-content").append("<div class='h-para'>" + item.eco2 + "</div>")

    })
})

// ---- Control devices ----

function bedroomLight() {
    var checkBox = document.getElementById("bedroomLight");
    if (checkBox.checked == true) {
        //alert('LED On')
        socket.emit("lamp-topic-change", "on")
    } else {
        // alert('LED Off')
        socket.emit("lamp-topic-change", "off")
    }
}

function bedroomAirConditioner() {
    var checkBox = document.getElementById("bedroomAirConditioner");
    if (checkBox.checked == true) {
        //alert('LED On')
        socket.emit("fan-topic-change", "on")
    } else {
        // alert('LED Off')
        socket.emit("fan-topic-change", "off")
    }
}

function airVent() {
    var checkBox = document.getElementById("airVent");
    if (checkBox.checked == true) {
        //alert('LED On')
        socket.emit("dehumi-topic-change", "on")
    } else {
        // alert('LED Off')
        socket.emit("dehumi-topic-change", "off")
    }
}

// ---- RTC ----



