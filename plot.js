var ctx = document.getElementById('hist');
fetch('./hist.txt')
    .then((response) => {
        return response.text();
    })
    .then((text) => {
        let m = new Map();
        let arr = text.split('\n');
        arr.pop();  // trailing newline

        for (let i = 0; i < arr.length; i++) {
            let [k, v] = arr[i].split(' ');
            m.set(+k, +v);
        }
        return { x: [...m.keys()], y: [...m.values()] };
    })
    .then((hist) => {
        // console.log(data);
        
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
                    text: "1v1 Random Map Ladder",
                    fontSize: 16
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
                        labels: hist.x.map(x => x == 0 || x % 100 ? '' : x),
                        ticks: {
                            autoSkip: false
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: '# of players'
                        }
                    }]
                }
            }
        })
    })
