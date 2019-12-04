const worldMapSvg = d3.select('#worldMap');

const gMap = worldMapSvg.append('g'); // appended first so dots are drawn on top rather than behind
const gDots = worldMapSvg.append('g');
const tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

const projection = d3.geoMercator()
  .center([2, 47])
  .scale(100);

const playButton = document.getElementById('playbutton');
playButton.addEventListener('click', togglePlay);
const playIcons = document.getElementsByClassName('icon-controls');
const timeline = document.getElementById('timeline');
const yearDiv = document.getElementById('frame'); // Haven't added the div to display the year yet

/**
 * Initialize animation variables
 * */
let frame = 0;
const startYear = 1776;
let displayYear = startYear;
let interval;
const speed = 50; // ms TODO: Add variable speed to playback
let playing = false;
const thisYear = new Date().getFullYear();

timeline.oninput = function () {
  pause();
  clearAll();
  displayYear = this.value;
  frame = this.value - startYear;
  for (let i = 0; i < (this.value - startYear); i++) { updateDots(i + startYear); }
};


function drawMap() {
  d3.json('https://PersonofNote.github.io/d3-visualization-map-test/world-110m.geojson', (data) => {
    gMap.selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('class', 'landpath')
      .attr('d', d3.geoPath()
        .projection(projection))
      .on('mouseover', (d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(d.properties.name)
          .style('left', `${d3.event.pageX }px`)
          .style('top', `${d3.event.pageY - 28 }px`);
      })
      .on('mouseout', (d) => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
  });
  initializeDots();
}


const rows = [];
const events = []; // Placeholder for adding videos

function addEvents() {
  const eventData = 'world-events.csv';
  d3.csv(eventData, (d) => {}, (error, d) => {});
}


function initializeDots() {
  const dataSet = 'embassy-data.csv';
  d3.csv(dataSet, (d) => {
    rows.push(d);
    addTomap(d);
  }, (error, d) => {
    fillTimeline();
  });
}

function fillTimeline() {
  const years = document.getElementById('yearsList');
  for (let i = 0; i < ((thisYear - startYear) + 1); i++) {
    const value = i + startYear;
    const year = document.createElement('option');
    year.value = value;
    if (value == startYear || value == thisYear || value == (Math.floor((thisYear - startYear) / 2) + startYear)) {
      year.label = year.value;
      year.class = 'visible';
    }
    years.appendChild(year);
  }
}

function addTomap(d) {
  worldMapSvg.selectAll('circle')
    .data(rows).enter()
    .append('circle')
    .attr('class', `dot dot-${d.year} ${d.country}`)
    .attr('data-event', d.event)
    .attr('data-country', d.country)
    .attr('cx', (d) => projection([d.lon, d.lat])[0])
    .attr('cy', (d) => projection([d.lon, d.lat])[1])
    .attr('r', '2px')
    .attr('fill', 'blue')
    .attr('opacity', 0);
}


function updateDots(year) {
  const selectDots = worldMapSvg.selectAll(`.dot-${year}`);
  // Set all dots for the year to 0 opacity
  selectDots.each(function () {
    const targetDot = worldMapSvg.selectAll(`.${this.dataset.country}`);
    targetDot
      .transition()
      .attr('opacity', 0)
      .duration(500);
  });
  // Change bubble opacity to one if year matches
  selectDots
    .transition()
    .attr('r', (d) => {
      if (d.event.includes('legation')) {
        return '6px';
      } if (d.event.includes('embassy')) {
        return '8px';
      } if (d.event.includes('closure')) {
        return '1px';
      }
    })
    .attr('opacity', (d) => {
      if (d.event.includes('legation')) {
        return 0.5;
      } if (d.event.includes('embassy')) {
        return 1;
      } if (d.event.includes('closure')) {
        return 0;
      }
    });
}

function clearAll() {
  frame = 0;
  worldMapSvg.selectAll('circle')
    .transition()
    .attr('opacity', 0);
}

function swapIcons() {
  for (const icon of playIcons) {
    icon.classList.toggle('visible');
  }
}

function addVideo() {
  // Optionally append video to timeline
}


/**
 * Start/stop playback
 * */

function togglePlay() {
  if (playing == true) {
    // playButton.innerHTML = "Play";
    playing = false;
    clearInterval(interval);
    // addVideo();
  } else if (playing == false) {
    interval = setInterval(() => {
      frame++;
      updateDots(displayYear);
      displayYear = frame + startYear;
      timeline.value = displayYear;
      if (displayYear >= thisYear) {
        clearAll();
      }
    }, speed);
    // removeVideo();
    playing = true;
  }
  swapIcons();
}

function pause() {
  if (playing == true) {
    playing = false;
    clearInterval(interval);
    swapIcons();
    // TODO: add popup saying what year it is
  }
}


drawMap();
addEvents();
