// JS 
//         var chart = JSC.chart('chartDiv', {
//             debug: true,
//             type: 'gauge',
//             animation_duration: 1000,
//             legend_visible: false,
//             xAxis: { spacingPercentage: 0.25 },
//             yAxis: {
//                 defaultTick: {
//                     padding: 10,
//                     label_style_fontSize: '10px'
//                 },
//                 customTicks: [0, 20, 40, 60, 80, 100],
//                 line: {
//                     width: 9,
//                     color: 'smartPalette',
//                     // breaks_gap: 0.06
//                 },
//                 scale_range: [0, 100]
//             },
//             palette: {
//                 pointValue: '{%value/100}',
//                 colors: ['green', 'yellow', 'red']
//             },
//             defaultTooltip_enabled: false,
//             defaultSeries: {
//                 angle: { sweep: 180 },
//                 shape: {
//                     innerSize: '80%',

//                     label: {
//                         text:
//                             `<span color="%color">{%sum:n1}</span>
//                             <br/>
//                             <span color="#696969" fontSize="10px">Ppm</span>`,
//                         style_fontSize: '20px',
//                         verticalAlign: 'middle',
//                         offset: '0,50'
//                     }
//                 }
//             },
//             series: [
//                 {
//                     type: 'column roundcaps',
//                     points: [{ id: '1', x: 'speed', y: 0 }]
//                 }
//             ],
//             toolbar_items: {
//                 Stop: {
//                     type: 'option',
//                     icon_name: 'system/default/pause',
//                     margin: 10,
//                     boxVisible: true,
//                     label_text: 'Pause',
//                     events: { change: playPause },
//                     states_select: {
//                         icon_name: 'system/default/play',
//                         label_text: 'Play'
//                     }
//                 }
//             }
//         });
//         var INTERVAL_ID;

//         playPause();

//         function setGauge(max, y) {
//             chart
//                 .series(0)
//                 .options({
//                     points: [{ id: '1', x: 'speed', y: y }]
//                 });
//             //chart.annotations('anVal').options({ label_text: JSC.formatNumber(y, 'n1') }); 
//         }

//         function playPause(val) {
//             if (val) {
//                 clearInterval(INTERVAL_ID);
//             } else {
//                 update();
//             }
//         }

//         function update() {
//             INTERVAL_ID = setInterval(function () {
//                 setGauge(100, Math.random() * 100);
//             }, 1200);

//         }


//         var chart = JSC.chart('chartDiv', { 
//         debug: true, 
//         legend_visible: false, 
//         defaultTooltip_enabled: false, 
//         xAxis_spacingPercentage: 0.4, 
//         yAxis: [ 
//             { 
//             id: 'ax1', 
//             defaultTick: { 
//                 padding: 10, 
//                 enabled: false
//             }, 
//             customTicks: [350, 600, 700, 800, 850], 
//             line: { 
//                 width: 10, 

//                 /*Defining the option will enable it.*/
//                 breaks: {}, 

//                 /*Palette is defined at series level with an ID referenced here.*/
//                 color: 'smartPalette:pal1'
//             }, 
//             scale_range: [350, 850] 
//             }, 
//             { 
//             id: 'ax2', 
//             scale_range: [0, 850], 
//             defaultTick: { 
//                 padding: 10, 
//                 enabled: false
//             }, 
//             customTicks: [0, 300, 600, 700, 800, 850], 
//             line: { 
//                 width: 10, 
//                 color: 'smartPalette:pal2'
//             } 
//             } 
//         ], 
//         defaultSeries: { 
//             type: 'gauge column roundcaps', 
//             shape: { 
//             label: { 
//                 text: '%max', 
//                 align: 'center', 
//                 verticalAlign: 'middle', 
//                 style_fontSize: 28 
//             } 
//             } 
//         }, 
//         series: [ 
//             { 
//             type: 'column roundcaps', 
//             name: 'Temperatures', 
//             yAxis: 'ax1', 
//             palette: { 
//                 id: 'pal1', 
//                 pointValue: '%yValue', 
//                 ranges: [ 
//                 { value: 350, color: '#FF5353' }, 
//                 { value: 600, color: '#FFD221' }, 
//                 { value: 700, color: '#77E6B4' }, 
//                 { value: [800, 850], color: '#21D683' } 
//                 ] 
//             }, 
//             points: [['x', [350, 720]]] 
//             }, 
//             { 
//             yAxis: 'ax2', 
//             name: 'Temperatures', 
//             palette: { 
//                 id: 'pal2', 
//                 pointValue: '{%yValue/850}', 
//                 colors: [ 
//                 '#ffffd9', 
//                 '#edf8b0', 
//                 '#c7e9b4', 
//                 '#7fcdbb', 
//                 '#41b6c3', 
//                 '#1d91c0', 
//                 '#225ea8', 
//                 '#253494', 
//                 '#081d58'
//                 ] 
//             }, 
//             points: [['x', 320]] 
//             } 
//         ] 
//         }); 

//         var data = [
//             {
//                 type: "indicator",
//                 mode: "gauge+number+delta",
//                 value: 420,
//                 title: { text: "Độ ẩm", font: { size: 24 } },
//                 delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
//                 gauge: {
//                 axis: { range: [null, 500], tickwidth: 1, tickcolor: "darkblue" },
//                 bar: { color: "darkblue" },
//                 bgcolor: "white",
//                 borderwidth: 2,
//                 bordercolor: "gray",
//                 steps: [
//                     { range: [0, 250], color: "cyan" },
//                     { range: [250, 400], color: "royalblue" }
//                 ],
//                 threshold: {
//                     line: { color: "red", width: 4 },
//                     thickness: 0.75,
//                     value: 490
//                 }
//                 }
//             }
//         ];

//         var data1 = [
//             {
//                 type: "indicator",
//                 mode: "gauge+number+delta",
//                 value: 420,
//                 title: { text: "Nhiệt độ", font: { size: 24 } },
//                 delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
//                 gauge: {
//                 axis: { range: [null, 500], tickwidth: 1, tickcolor: "darkblue" },
//                 bar: { color: "darkblue" },
//                 bgcolor: "white",
//                 borderwidth: 2,
//                 bordercolor: "gray",
//                 steps: [
//                     { range: [0, 250], color: "cyan" },
//                     { range: [250, 400], color: "royalblue" }
//                 ],
//                 threshold: {
//                     line: { color: "red", width: 4 },
//                     thickness: 0.75,
//                     value: 490
//                 }
//                 }
//             }
//         ];

//         var layout = {
//             width: 250,
//             height: 200,
//             margin: { t: 25, r: 25, l: 25, b: 25 },
//             paper_bgcolor: "lavender",
//             font: { color: "darkblue", family: "Arial" }
//         };
//         Plotly.newPlot('container', data, layout);
//         Plotly.newPlot('container1', data1, layout);


///////////////////////////////////////////////////////////

//         <!-- Provided template, uncomment to compare -->
//         <!-- <script type="text/javascript">
    
//             var chart = Highcharts.chart('container', {
//                 chart: {
//                     zoomType: 'xy'
//                 },
//                 title: {
//                     text: 'Đồ thị nhiệt độ - độ ẩm'
//                 },
    
//                 xAxis: [{
//                     categories: [],
//                     tickWidth: 1,
//                     tickLength: 20
//                 }],
//                 yAxis: [{ // Primary yAxis
//                     labels: {
//                         // format: '{value}',
//                         style: {
//                             color: Highcharts.getOptions().colors[1]
//                         }
//                     },
//                     title: {
//                         text: 'Nhiệt độ (°C)',
//                         style: {
//                             color: Highcharts.getOptions().colors[1]
//                         }
//                     },
//                 }, { // Secondary yAxis
//                     title: {
//                         text: 'Độ ẩm(%)',
//                         style: {
//                             color: Highcharts.getOptions().colors[0]
//                         }
//                     },
//                     labels: {
//                         // format: '{value}',
//                         style: {
//                             color: Highcharts.getOptions().colors[0]
//                         }
//                     },
//                     opposite: true
//                 }],
//                 tooltip: {
//                     shared: true
//                 },
//                 legend: {
//                     layout: 'vertical',
//                     align: 'left',
//                     x: 120,
//                     verticalAlign: 'top',
//                     y: 100,
//                     floating: true,
//                     backgroundColor:
//                         Highcharts.defaultOptions.legend.backgroundColor || // theme
//                         'rgba(255,255,255,0.25)'
//                 },
//                 series: [{
//                     name: 'Độ ẩm',
//                     type: 'column',
//                     yAxis: 1,
//                     dat: [],
//                     tooltip: {
//                         valueSuffix: '%'
//                     }
    
//                 }, {
//                     name: 'Nhiệt độ',
//                     type: 'spline',
//                     dat: [],
//                     tooltip: {
//                         valueSuffix: '°C'
//                     },
//                     zones: [{
//                         value: 10,
//                         color: '#ff0015'
//                     }, {
//                         value: 30,
//                         color: '#141107'
//                     }, {
//                         color: '#ff0015'
//                     }],
//                 }],
//             });
    
//             socket.on("server-send-humi_graph", function (data) {
//                 chart.series[0].setData(data);
//             });
    
//             // socket.on("server-send-temp_graph", function (data) {
//             //     chart.series[1].setData(data);
//             // });
    
//             // socket.on("server-send-date_graph", function (data) {
//             //     chart.xAxis[0].setCategories(data);
//             // });
    
//             // ------------- RTC ------------
//             var timeDisplay = document.getElementById("time");
    
//             function refreshTime() {
//                 var dateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
//                 var formattedString = dateString.replace(", ", " - ");
//                 timeDisplay.innerHTML = formattedString;
//             }
    
//             setInterval(refreshTime, 1000);
//             // ------------------------------
                
    
//         </script> -->
//         <script>
//             var INTERVAL_ID,
//                 animationDuration = 420,
//                 updateInterval = 1500;
//             var chart = JSC.chart(
//                 'chartDiv',
//                 {
//                     debug: true,
//                     type: 'gauge ',
//                     legend_visible: false,
//                     animation_duration: animationDuration,
//                     xAxis: {
//                         scale: {
//                             // Helps position the marker on top of the y Axis. 
//                             range: [0, 1]
//                         }
//                     },
//                     palette: {
//                         pointValue: '%yValue',
//                         ranges: [
//                             { value: [0, 30], color: '#FF5353' },
//                             { value: [30, 70], color: '#FFD221' },
//                             { value: [70, 100], color: '#77E6B4' }
//                         ]
//                     },
//                     yAxis: {
//                         defaultTick: {
//                             // Pads around the gauge 
//                             padding: 10,
//                             label_visible: false
//                         },
//                         line: {
//                             width: 10,
//                             // Gaps occur at tick intervals defined below. 
//                             breaks_gap: 0.05,
//                             color: 'smartPalette'
//                         },
//                         scale: { range: [0, 100], interval: 10 }
//                     },
    
//                     defaultSeries: {
//                         opacity: 1,
//                         mouseTracking_enabled: false,
//                         shape: {
//                             label: {
//                                 text: labelText(50),
//                                 style: { fontSize: 20 },
//                                 align: 'center',
//                                 verticalAlign: 'middle'
//                             }
//                         }
//                     },
//                     series: [
//                         {
//                             type: 'marker',
//                             defaultPoint: {
//                                 marker: {
//                                     outline: {
//                                         width: 5,
//                                         color: 'currentColor'
//                                     },
//                                     fill: 'white',
//                                     type: 'circle',
//                                     size: 15
//                                 }
//                             },
//                             points: [{ y: 50 }]
//                         }
//                     ],
//                     toolbar_items: {
//                         text: `<img class="element-icon" src="drop.png" alt="">`
//                     }
//                 },
//                 function () {
//                     playPause();
//                 }
//             );
    
//             /** 
//              * Updates the chart with a random value. 
//              * @param chrt 
//              */
//             function updateChart(chrt) {
//                 chrt = chart || chrt;
    
//                 var series = chrt.series(0),
//                     rValue = Math.round(Math.random() * 100);
    
//                 series.options({
//                     shape_label_text: labelText(rValue)
//                 });
//                 series.points(0).options({ y: rValue });
//             }
    
//             function playPause(val) {
//                 if (val) {
//                     clearInterval(INTERVAL_ID);
//                 } else {
//                     INTERVAL_ID = setInterval(function () {
//                         updateChart(chart);
//                     }, updateInterval);
//                 }
//             }
    
//             function labelText(value) {
//                 var fgg =
//                     value >= 70
//                         ? 'Great!'
//                         : value >= 30
//                             ? 'Good'
//                             : 'Fair';
//                 return (
//                     value +
//                     '%<br/><span style="fontSize: 20px">' +
//                     fgg +
//                     '</span>'
//                 );
//             }
    
//             //////////////////////////////////////////
    
    
//             socket.on("server-send-humi_graph", function (y) {
//                 chart.series(0).options({
//                     points: [{ id: '1', x: 'speed', y: y }]
//                 });
//             });
        
//             socket.on("server-send-temp_graph", function (data) {
//                 console.log(char)
//                 chart.series[1].setData(data);
//             });
    
//             socket.on("server-send-date_graph", function (data) {
//                 chart.xAxis[0].setCategories(data);
//             });
