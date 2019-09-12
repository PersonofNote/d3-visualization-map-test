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
d3.json("/world-110m.geojson", function(data){
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
  rows.push(d)
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
        .attr("class", `dot dot-${d.year}`)
        .attr("event", d.event)
        .attr("cx",function(d) { return projection([d.lon,d.lat])[0]})
		    .attr("cy", function (d) { return projection([d.lon,d.lat])[1]})
        .attr("r", "2px")
        .attr("fill", "blue")
        .attr("opacity", 0) 
}


}



function updateDots(year) {
       //Change bubble opacity to one if year matches
       d3.selectAll(`.dot-${year}`)
       .transition()
       .attr("r", "8px")
       .attr('opacity', function(d) {
         console.log(`${d.country} ${d.event} in ${d.year}`)
         if(d.event.includes("legation")) {
           return 0.5;
         }else if (d.event.includes("embassy")){
           return 1;
         }else {
           return 0;
  
         }
       })
       .attr('fill', function(d) {
        if (d.event.includes("closure")) {
          console.log('Closed');
          return "red";
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
var speed = 100; // ms
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
      //Set play button
      //playButton.innerHTML = "Pause";
      
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
   // playButton.innerHTML = "Play";
    //Also add a popup saying what year it is
  }
}

/**********************************************************
 * jQuery-less version of Chris Coyier's
 * Value Bubbles for Range Inputs
 * http://css-tricks.com/value-bubbles-for-range-inputs/ 
 **********************************************************/
/*
function modifyOffset() {
	var el, newPoint, newPlace, offset, siblings, k;
	width    = this.offsetWidth;
	newPoint = (this.value - this.getAttribute("min")) / (this.getAttribute("max") - this.getAttribute("min"));
	offset   = -1.3;
	if (newPoint < 0) { newPlace = 0;  }
	else if (newPoint > 1) { newPlace = width; }
	else { newPlace = width * newPoint + offset; offset -= newPoint;}
	siblings = this.parentNode.childNodes;
	for (var i = 0; i < siblings.length; i++) {
		sibling = siblings[i];
		if (sibling.id == this.id) { k = true; }
		if ((k == true) && (sibling.nodeName == "OUTPUT")) {
			outputTag = sibling;
		}
	}
	outputTag.style.left       = newPlace + "px";
	outputTag.style.marginLeft = offset + "%";
	outputTag.innerHTML        = this.value;
}

function modifyInputs() {
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].getAttribute("type") == "range") {
			inputs[i].onchange = modifyOffset;
			
			// the following taken from http://stackoverflow.com/questions/2856513/trigger-onchange-event-manually
			if ("fireEvent" in inputs[i]) {
			    inputs[i].fireEvent("onchange");
			} else {
			    var evt = document.createEvent("HTMLEvents");
			    evt.initEvent("change", false, true);
			    inputs[i].dispatchEvent(evt);
			}
		}
	}
}

window.onload = modifyInputs;
*/


drawMap();
addEvents();