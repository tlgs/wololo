var ctx = document.getElementById('hist');
fetch('./../hist.txt')
    .then((response) => {
        return response.text();
    })
    .then((text) => {
        let bins = [];
        let freqs = [];
        let ps = [];

        let arr = text.split('\n');
        arr.pop();  // trailing newline

        for (let i = 0; i < arr.length; i++) {
            let [b, f, p] = arr[i].split(' ');
            bins.push(b);
            freqs.push(f);
            ps.push(p);
        }
        return { x: bins, y: freqs, p: ps };
    })
    .then((hist) => {
        Chart.defaults.global.defaultFontColor = 'black';
        Chart.defaults.global.defaultFontFamily = "'Rubik', sans-serif";

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: hist.x,
                datasets: [{
                    data: hist.y,
                    backgroundColor: 'rgba(0, 0, 255, 0.6)'
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
                        },
                        afterLabel: function(tooltipItem, data) {
                            return 'percentile: ' + (hist.p[tooltipItem.index] * 100).toFixed(2);
                        }
                    }
                }
            }
        })
    })
