var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var gMap = svg.append("g"); // appended first so dots are drawn on top rather than behind
var gDots = svg.append("g");

var projection = d3.geoMercator()
    .center([2, 47])                
    .scale(100)                       

const playButton = document.getElementById("playbutton");
playButton.addEventListener("click", togglePlay);

const timeline = document.getElementById('timeline');

timeline.addEventListener('mousedown', pause)
//timeline.addEventListener('mouseup', setYear)

function drawMap() {
/*TODO: Adjust svg viewport based on window size */ 
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
initializeDots();
}


var rows = [];


function initializeDots(){

/**
*
* Local csv test data
*/
/*
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

*/

//For testing locally without access to server
var dataSet = [{
  "id": 1,
  "first_name": "Jeanette",
  "last_name": "Penddreth",
  "date_": "2011",
  "longitude": "20.87",
  "latitude": "-100.18"
}, {
  "id": 2,
  "first_name": "Giavani",
  "last_name": "Frediani",
  "date_": "2015",
  "longitude": "11.40",
  "latitude": "92.46"
}, {
  "id": 3,
  "first_name": "Noell",
  "last_name": "Bea",
  "date_": "2017",
  "longitude": "45.25",
  "latitude": "75.41"
}, {
  "id": 4,
  "first_name": "Willard",
  "last_name": "Valek",
  "date_": "2005",
  "longitude": "31.55",
  "latitude": "131.35"
}];


for (let i=0;i<dataSet.length;i++) {
  addTomap(dataSet[i]);
  rows.push(dataSet[i]);
  console.log(dataSet[i].latitude);
}


function addTomap(d) {
  svg.selectAll("circle")
		.data(rows).enter()
        .append("circle")
        .attr("class", `dot dot-${d.date_}`)
        .attr("cx",function(d) { return projection([d.longitude,d.latitude])[0]})
		.attr("cy", function (d) { return projection([d.longitude,d.latitude])[1]})
    .attr("r", "1px")
    .attr("opacity", 1)
}


}


function addVideo() {
  //Optionally append video to timeline
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



/**
* Start/stop playback
**/

function togglePlay() {
  if ( playing==true ) {
    playing=false;
    clearInterval( interval );
    //addVideo();
    d3.selectAll('playbutton')
    .text("Play");
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
        .text("Pause");
     //Change bubble opacity to one if year matches
     d3.selectAll(`.dot-${displayYear}`)
      .transition()
      .attr("r", "8px")
      .attr('opacity', 1) //In theory you should just be able to make this a variable based on event type and it should just work
      .duration(500)
      
    }, speed);
    //removeVideo();
    playing=true;
  }
}

function pause() {
    if ( playing==true ) {
    playing=false;
    clearInterval( interval );
    d3.select('playbutton')
    .text("Pause");
  }
}


/*
function updateBubble() {
  if rows.map(x => x * 2) {
    
  }
}
*/


drawMap();