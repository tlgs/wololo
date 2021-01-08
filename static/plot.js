/*
 * TODO: Document this.
 *
 */

Chart.defaults.global.defaultFontColor = 'black';
Chart.defaults.global.defaultFontFamily = `'Rubik', sans-serif`;

const ctx = document.getElementById('hist');
const histogram = new Chart(ctx, {
    type: 'bar',
    data: {
        datasets: [{
            backgroundColor: 'MidnightBlue',
            hoverBackgroundColor: 'SlateBlue',
            barPercentage: 1,
            categoryPercentage: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
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
                gridLines: {
                    display: false
                },
                ticks :{
                    autoSkip: false
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
            titleFontSize: 14,
            bodyFontSize: 13,
            callbacks: {
                label: function(tooltipItem, data) {
                    return `# of players: ${tooltipItem.value}`;
                }
            }
        },
        hover: {
            mode: 'index',
            intersect: false,
            animationDuration: 0
        }
    }
});

fetch('./random-map.json')
    .then(response => response.json())
    .then(d => {
        const h = d.histogram;
        histogram.data.labels = [...Array(h.freqs.length).keys()].map(x => x * h.binSize);
        histogram.data.datasets[0].data = h.freqs;

        histogram.options.scales.xAxes[0].labels = histogram.data.labels.map(x => (x === 0 || x % 100) ? '' : x);

        histogram.options.tooltips.callbacks.title = function(tooltipItem, data) {
            return `${tooltipItem[0].index * h.binSize}-${(tooltipItem[0].index + 1) * h.binSize - 1}`;
        };
        histogram.options.tooltips.callbacks.afterLabel = function(tooltipItem, data) {
            const x = data.datasets[tooltipItem.datasetIndex].data;
            const p = x.slice(0, tooltipItem.index).reduce((a, b) => a + b, 0) / x.reduce((a, b) => a + b, 0);

            return `percentile ≈ ${(p * 100).toFixed(2)}`;
        };

        histogram.update(0);

        const t = h.freqs.reduce((a, b) => a + b, 0);
        const playerCount = document.getElementById('player-count');
        playerCount.innerHTML = t;

        // see <https://stackoverflow.com/a/44081700> for cumsum magic
        const cumulative = h.freqs.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []);
        const b = cumulative.findIndex(x => (x / t) > 0.5) * h.binSize;
        const median = document.getElementById('median-rating');
        median.innerHTML = `${b}-${b + h.binSize - 1}`;

        const latest = document.getElementById('latest');
        latest.innerHTML = d.date;
    });
