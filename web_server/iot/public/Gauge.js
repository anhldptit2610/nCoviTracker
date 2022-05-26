var chart = JSC.chart('chartDiv', {
    debug: true,
    type: 'gauge',
    animation_duration: 1000,
    legend_visible: false,
    xAxis: { spacingPercentage: 0.4 },
    yAxis: {
        defaultTick: {
            padding: 15,
            label_style_fontSize: '10px'
        },
        
        line: {
            width: 9,
            color: 'smartPalette',
            // breaks_gap: 0.06
        },
        
        scale_range: [0, 100]
    },
    palette: {
        pointValue: '{%value/100}',
        colors: ['green', 'yellow', 'red']
    },
    
    defaultTooltip_enabled: false,
    defaultSeries: {
        angle: { sweep: 180 },
        shape: {
            innerSize: '70%',

            label: {
                text:
                    `<span color="%color">{%sum:n1}</span>
                            <br/>
                            <span color="#696969" fontSize="20px">%</span>`,
                style_fontSize: '20px',
                verticalAlign: 'middle',
                // offset: '0,50'
            }
        }
    },
    series: [
        {
            type: 'column roundcaps',
            points: [{ id: '1', x: 'speed', y: 0 }]
        }
    ],
    toolbar_items: {
        text: `<img class="element-icon" src="drop.png" alt="">`
    }
});
var INTERVAL_ID;


function setGauge(y) {
    chart.series(0).options({
            points: [{ id: '1', x: 'speed', y: y }]
        });
    //chart.annotations('anVal').options({ label_text: JSC.formatNumber(y, 'n1') }); 
}


function update() {
    INTERVAL_ID = setInterval(function () {
        setGauge(Math.random() * 100);
    }, 1200);
}
update();
