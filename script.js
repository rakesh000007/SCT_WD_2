let startTime, updatedTime, difference, tInterval;
let running = false;
let lapCounter = 1;

const timeDisplay = document.getElementById('time');
const startPauseBtn = document.getElementById('startPauseBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('laps');

startPauseBtn.addEventListener('click', () => {
  if (!running) {
    startTime = new Date().getTime() - (difference || 0);
    tInterval = setInterval(updateTime, 1);
    startPauseBtn.textContent = 'Pause';
    running = true;
  } else {
    clearInterval(tInterval);
    difference = new Date().getTime() - startTime;
    startPauseBtn.textContent = 'Start';
    running = false;
  }
});





function updateTime() {
  updatedTime = new Date().getTime() - startTime;
  
  const ms = updatedTime % 1000;
  const totalSec = Math.floor(updatedTime / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  timeDisplay.textContent = 
    `${pad(hrs)}:${pad(mins)}:${pad(secs)}.${pad(ms, 3)}`;
}

function pad(num, size = 2) {
  let s = "000" + num;
  return s.substr(s.length - size);
}
// Dark Mode JS
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

function saveLapsToLocal() {
    const laps = [];
    document.querySelectorAll('#laps li').forEach(li => {
      laps.push(li.textContent);
    });
    localStorage.setItem('laps', JSON.stringify(laps));
  }
  
  function loadLapsFromLocal() {
    const savedLaps = JSON.parse(localStorage.getItem('laps') || '[]');
    savedLaps.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      lapsList.appendChild(li);
    });
    lapCounter = savedLaps.length + 1;
  }

  
  resetBtn.addEventListener('click', () => {
    clearInterval(tInterval);
    timeDisplay.textContent = '00:00:00.000';
    difference = 0;
    running = false;
    startPauseBtn.textContent = 'Start';
    lapsList.innerHTML = '';
    localStorage.removeItem('laps');
    lapCounter = 1;
  });
  
  
  function updateFastestLap() {
    const laps = Array.from(document.querySelectorAll('#laps li')).map(li => {
      const timeText = li.textContent.split(': ')[1];
      return { li, ms: timeStringToMs(timeText) };
    });
  
    const fastest = laps.reduce((min, lap) => lap.ms < min.ms ? lap : min, laps[0]);
  
    laps.forEach(l => l.li.classList.remove('fastest-lap'));
    fastest.li.classList.add('fastest-lap');
  }
  
  function timeStringToMs(timeString) {
    const [h, m, s] = timeString.split(':');
    const [sec, ms] = s.split('.');
    return (+h * 3600000) + (+m * 60000) + (+sec * 1000) + (+ms);
  }
  self.addEventListener('install', e => {
    e.waitUntil(
      caches.open('stopwatch-cache').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/style.css',
          '/script.js',
          '/manifest.json',
          '/icon-192.png',
          '/icon-512.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', e => {
    e.respondWith(
      caches.match(e.request).then(response => {
        return response || fetch(e.request);
      })
    );
  });
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }
  
  lapBtn.addEventListener('click', () => {
    if (running) {
      const li = document.createElement('li');
      li.textContent = `Lap ${lapCounter}: ${timeDisplay.textContent}`;
      lapsList.appendChild(li);
      saveLapsToLocal();
      updateFastestLap();
  
      // Trigger confetti on 10th lap 🎉
      if (lapCounter === 10) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
  
      lapCounter++; // Increment lap counter after the check
    }
  });
  function updateFastestAndSlowestLap() {
    const laps = Array.from(document.querySelectorAll('#laps li')).map(li => {
      const timeText = li.textContent.split(': ')[1];
      return { li, ms: timeStringToMs(timeText) };
    });
  
    const fastest = laps.reduce((min, lap) => lap.ms < min.ms ? lap : min, laps[0]);
    const slowest = laps.reduce((max, lap) => lap.ms > max.ms ? lap : max, laps[0]);
  
    // Remove any previous highlights
    laps.forEach(l => {
      l.li.classList.remove('fastest-lap', 'slowest-lap');
    });
  
    // Highlight the fastest and slowest laps
    fastest.li.classList.add('fastest-lap');
    slowest.li.classList.add('slowest-lap');
  }
  
  function timeStringToMs(timeString) {
    const [h, m, s] = timeString.split(':');
    const [sec, ms] = s.split('.');
    return (+h * 3600000) + (+m * 60000) + (+sec * 1000) + (+ms);
  }
  