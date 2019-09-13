const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

const gMap = svg.append("g"); // appended first so dots are drawn on top rather than behind
const gDots = svg.append("g");

var projection = d3.geoMercator()
    .center([2, 47])                
    .scale(100)                       

const playButton = document.getElementById("playbutton");
playButton.addEventListener("click", togglePlay);
const playIcons = document.getElementsByClassName("icon-controls");
const timeline = document.getElementById('timeline');
const yearDiv = document.getElementById('frame');

timeline.oninput = function() {
  console.log(this.value);
  pause();
  clearAll();
  displayYear = this.value;
  frame = this.value-startYear;
  for (i=0; i<(this.value-startYear); i++)
    updateDots(i+startYear);
}


function drawMap() {
d3.json("https://PersonofNote.github.io/d3-visualization-map-test/world-110m.geojson", function(data){
    gMap.selectAll("path")
        .data(data.features)
        .enter()
        .append("path") 
        .attr("class", `landpath`)      
          .attr("d", d3.geoPath()
              .projection(projection)
          )
})
initializeDots();
}


var rows = [];
var events = [];

function addEvents() {
  const eventData = "world-events.csv";
  d3.csv(eventData, function(d) {
    }, function(error, d) { 
    });
  }


function initializeDots(){

var dataSet = "embassy-data.csv";

d3.csv(dataSet, function(d) {
  rows.push(d);
  addTomap(d);
    }, function(error, d) { 
      function fillTimeline() {
        const years = document.getElementById("yearsList")
        for (let i=0; i < ((thisYear - startYear) + 1); i ++) {
          var value = i+startYear;
            var year = document.createElement('option');
            year.value = value;
            if (value == startYear || value == thisYear || value == (Math.floor((thisYear - startYear)/2) + startYear)) {
              year.label = year.value;
              year.class = "visible";
            }
            years.appendChild(year);
        }
    }
      fillTimeline();     
    });

function addTomap(d) {
  svg.selectAll("circle")
		.data(rows).enter()
        .append("circle")
        .attr("id", d.country)
        .attr("class", `dot dot-${d.year}`)
        .attr("event", d.event)
        .attr("cx",function(d) { return projection([d.lon,d.lat])[0]})
		    .attr("cy", function (d) { return projection([d.lon,d.lat])[1]})
        .attr("r", "2px")
        .attr("fill", "blue")
        .attr("opacity", 0) 
}


}

/**
 * MAJOR BUG. Right now it's appending multiple circles, one for each event.
 * Possible fixes: Only push and add class if the d.event contains "establish"? And make the id the country name?
 * Select all with that year class, and if ANY of them have the event "closure", adjust the opacity of all?
 */

  function updateDots(year) {
       //Change bubble opacity to one if year matches
       svg.selectAll(`.dot-${year}`)
       .transition()
       .attr("r", function(d) {
        if(d.event.includes("legation")) {
          console.log("legation");
          return "6px";
        }else if (d.event.includes("embassy")){
          console.log("embassy");
          return "8px";
        }else if (d.event.includes("closure")) {
          console.log("closure");
          return "1px";
        }else {
          return;
        }
       })
       .attr("opacity", function(d) {
         if(d.event.includes("legation")) {
           return 0.5;
         }else if (d.event.includes("embassy")){
           return 1;
         }else if (d.event.includes("closure")) {
           return 0.5;
         }else {
           return;
         }
       })
       .duration(500)
}

function clearAll() {
  frame = 0;
  svg.selectAll("circle")
    .transition()
    .attr("opacity", 0);
}

function swapIcons() {
  for (let icon of playIcons) {
    console.log(icon.className);
    icon.classList.toggle("visible");
  }
   
}

function addVideo() {
  //Optionally append video to timeline
}


/**
* Initialize animation variables
**/
var frame = 0;
var startYear = 1776;
var displayYear = startYear;
var interval;
var speed = 100; // ms TODO: Add variable speed to playback
var playing=false;
var thisYear = new Date().getFullYear();
console.log(thisYear);


/**
* Start/stop playback
**/

function togglePlay() {
  if ( playing==true ) {
    //playButton.innerHTML = "Play";
    playing=false;
    clearInterval( interval );
    //addVideo();
    
  }
  else if (playing == false) {
    interval = setInterval(function () {
      frame++;
      updateDots(displayYear);
      displayYear = frame+startYear;
      timeline.value = displayYear;
      if(displayYear >= thisYear){
        clearAll();
      }
      
    }, speed);
    //removeVideo();
    playing=true;
  }
  swapIcons();
}

function pause() {
    if ( playing==true ) {
    playing=false;
    clearInterval( interval );
    swapIcons();
    //TODO: add popup saying what year it is
  }
}



drawMap();
addEvents();