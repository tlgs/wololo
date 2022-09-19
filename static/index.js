fetch('https://api.github.com/gists/ab54bc15dfc0f41b6825546d8aa38edf')
.then((response) => response.json())
.then((raw) => {
  document.getElementById('hist').src = raw.files['hist.svg'].raw_url;

  const d = JSON.parse(raw.files['stats.json'].content);
  document.getElementById('player-count').innerHTML = d.stats.count;
  document.getElementById('median-rating').innerHTML = d.stats.median;
  document.getElementById('latest').innerHTML = d.date;
});
