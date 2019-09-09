var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var gMap = svg.append("g"); // appended first
var gDots = svg.append("g");

var projection = d3.geoMercator()
    .center([2, 47])                
    .scale(100)                       

const playButton = document.getElementById("playbutton");
playButton.addEventListener("click", togglePlay);

const timeline = document.getElementById('timeline');

function drawMap() { 
d3.json("http://enjalot.github.io/wwsd/data/world/world-110m.geojson", function(data){
    gMap.selectAll("path")
        .data(data.features)
        .enter()
        .append("path") 
        .attr("class", `landpath`)      
          .attr("d", d3.geoPath()
              .projection(projection)
          )
})
//Consider making an animation function to make the map load prettily, and initialize dots as a callback to that.
initializeDots();
}

var countries = document.getElementsByClassName('landpath');
console.log(countries.length);

var rows = [];

function initializeDots(){

var dataSet = "landslide-test-data-truncated.csv";
d3.csv(dataSet, function(d) {
  rows.push(d)
  //Slightly convoluted way of getting just the year from the dataset
  var eventDate = d.date_.split(' ');
  var eventYearArr = eventDate[0].split('/');
  var eventYear = eventYearArr[2];
  addTomap(d, eventYear);
    }, function(error, d) { 
      //Make timeline       
    });


function addTomap(d, eventYear) {
  svg.selectAll("circle")
		.data(rows).enter()
        .append("circle")
        .attr("class", `dot dot-${eventYear}`)
        .attr("cx",function(d) { return projection([d.longitude,d.latitude])[0]})
		.attr("cy", function (d) { return projection([d.longitude,d.latitude])[1]})
    .attr("r", "1px")
    .attr("opacity", 0)
}
}


function addVideo() {
  //Optionally append video to timeline
}

function makeTimeline() {
  //Create draggable timeline
}

/**
* Initialize animation variables
**/
var frame = 0;
var startYear = 2004;
var displayYear = startYear;
var interval;
var speed = 300; // ms
var playing=false;
var thisYear = 2019;

/*
* Reimplementing features, not ready yet
*/ 
//const timeline = document.getElementById('timeline');

//timeline.addEventListener('mousedown', pause)
//timeline.addEventListener('mouseup', setYear)

/**
* Start/stop playback
**/

function togglePlay() {
  if ( playing==true ) {
    playing=false;
    clearInterval( interval );
    //addVideo();
    d3.selectAll('playbutton')
    .text("Pause");
  }
  else if (playing == false) {
    interval = setInterval(function () {
      frame++;
      displayYear = frame+startYear;
      timeline.value = displayYear;
      console.log(displayYear);
      if(displayYear >= thisYear){
        frame = 0;
        svg.selectAll("circle")
          .transition()
          .attr("opacity", 0);
      }
      //Set play button
      d3.selectAll('playbutton')
        .text("Play");
     //Change bubble opacity to one if year matches
     d3.selectAll(`.dot-${displayYear}`)
      .transition()
      .attr("r", "8px")
      .attr('opacity', 1)
      .duration(500)
      
    }, speed);
    //removeVideo();
    playing=true;
  }
}

//makeTickmarks();


/*
function updateBubble() {
  if rows.map(x => x * 2) {
    
  }
}
*/


drawMap();