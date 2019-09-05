var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");


var projection = d3.geoMercator()
    .center([2, 47])                
    .scale(100)                       
    .translate([ width/2, height/2 ]) //Center

// 
d3.json("http://enjalot.github.io/wwsd/data/world/world-110m.geojson", function(data){  
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
          .attr("fill", "grey")
          .attr("d", d3.geoPath()
              .projection(projection)
          )
        .style("stroke", "grey")
})

var rows = [];
var dataSet = "landslide-test-data-truncated.csv";
var landslides = d3.csv(dataSet, function(d) {
  //console.log(d.date_);
  //console.log(d.latitude)
  addTomap(d);
  rows.push(d)
    }, function(error, d) {
        console.log(rows[2].latitude);
        //addTomap(rows[2]);
    });


function addTomap(d) {
  svg.selectAll("circle")
		.data(rows).enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx",function(d) { return projection([d.longitude,d.latitude])[0]})
		.attr("cy", function (d) { return projection([d.longitude,d.latitude])[1]})
		.attr("r", "8px")
}



  