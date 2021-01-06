Chart.defaults.global.defaultFontColor = 'black';
Chart.defaults.global.defaultFontFamily = "'Rubik', sans-serif";

var ctx = document.getElementById('hist');
var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        datasets: [{
            backgroundColor: 'rgba(25, 25, 112, 1)',
            hoverBackgroundColor: 'rgba(25, 25, 112, 1)',
            barPercentage: 1.03,
            categoryPercentage: 1
        }]
    },
    options: {
        title: {
            display: true,
            text: '1v1 Random Map',
            fontStyle: 'normal'
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Rating'
                },
                ticks: {
                    autoSkip: false
                },
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: '# of players'
                }
            }]
        },
        tooltips: {
            mode: 'index',
            intersect: false,
            displayColors: false,
            callbacks: {
                title: function(tooltipItem, data) {
                    return tooltipItem[0].label + ' - ' + (+tooltipItem[0].label + 99);
                },
                label: function(tooltipItem, data) {
                    return '# of players: ' + tooltipItem.value;
                }
            }
        }
    }
})

fetch('./../hist.txt')
    .then((response) => {
        return response.text();
    })
    .then((text) => {
        // slice accounts for trailing newline
        let arr = text.slice(0, -1).split('\n');

        let bins = [];
        let freqs = [];
        let ps = [];
        for (let i = 0; i < arr.length; i++) {
            let [b, f, p] = arr[i].split(' ');
            bins.push(b);
            freqs.push(f);
            ps.push(p);
        }
        return { x: bins, y: freqs, percentiles: ps };
    })
    .then((d) => {
        chart.data.labels = d.x;
        chart.data.datasets[0].data = d.y;
        // chart.options.scales.xAxes[0].labels = d.x.map(x => x == 0 || x % 100 ? '' : x);

        chart.options.tooltips.callbacks.afterLabel = function(tooltipItem, data) {
            return 'percentile: ' + (d.percentiles[tooltipItem.index] * 100).toFixed(2);
        }

        chart.update(0);
    })
