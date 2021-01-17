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
    datasets: [
      {
        label: 'histogram',
        backgroundColor: 'midnightblue',
        hoverBackgroundColor: 'slateblue',
        barPercentage: 1,
        categoryPercentage: 1,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    title: {
      display: true,
      text: '1v1 Random Map',
      fontStyle: 'normal',
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Rating',
          },
          gridLines: {
            display: false,
          },
          ticks: {
            autoSkip: false,
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: '# of players',
          },
        },
      ],
    },
    tooltips: {
      mode: 'index',
      intersect: false,
      displayColors: false,
      titleFontSize: 14,
      bodyFontSize: 13,
      filter: function (tooltipItem) {
        return tooltipItem.datasetIndex === 0;
      },
      callbacks: {
        label: function (tooltipItem) {
          return `# of players: ${tooltipItem.value}`;
        },
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
      animationDuration: 0,
    },
  },
});

fetch('./random-map.json')
  .then((response) => response.json())
  .then((d) => {
    const h = d.histogram;
    histogram.data.labels = [...Array(h.freqs.length).keys()].map((x) => x * h.binSize);
    histogram.data.datasets[0].data = h.freqs;

    histogram.options.scales.xAxes[0].labels = histogram.data.labels.map((x) =>
      x === 0 || x % 100 ? '' : x
    );

    histogram.options.tooltips.callbacks.title = function (tooltipItem) {
      const i = tooltipItem[0].index;

      return `${i * h.binSize}-${(i + 1) * h.binSize - 1}`;
    };
    histogram.options.tooltips.callbacks.afterLabel = function (tooltipItem, data) {
      const x = data.datasets[tooltipItem.datasetIndex].data;
      const s = x.slice(0, tooltipItem.index).reduce((a, b) => a + b, 0);
      const t = x.reduce((a, b) => a + b, 0);

      return `percentile ≈ ${((s / t) * 100).toFixed(2)}`;
    };

    histogram.update(0);

    const t = h.freqs.reduce((a, b) => a + b, 0);
    const playerCount = document.getElementById('player-count');
    playerCount.innerHTML = t;

    // see <https://stackoverflow.com/a/44081700> for cumsum magic
    const cumulative = h.freqs.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []);
    const b = cumulative.findIndex((x) => x / t > 0.5) * h.binSize;
    const median = document.getElementById('median-rating');
    median.innerHTML = `${b}-${b + h.binSize - 1}`;

    /*
    const mean = document.getElementById('mean-rating');
    mean.innerHTML = d.statistics.mean.toFixed(2);

    const stdev = document.getElementById('stdev');
    stdev.innerHTML = Math.sqrt(d.statistics.variance).toFixed(2);
    */

    const latest = document.getElementById('latest');
    latest.innerHTML = d.date;
  });
