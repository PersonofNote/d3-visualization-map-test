
var loaded = false;

//Use library to create map
var worldMap = new Datamap({
  element: document.getElementById('map-container'),
  scope: 'world',
  geographyConfig: {
      borderWidth: 0,
      popupOnHover: false,
      highlightOnHover: false
  },

});


var rows = [];
//Dataset obtained from data.gov
var dataSet = "landslide-test-data-truncated.csv";
var landslides = d3.csv(dataSet, function(d) {
  console.log(d.date_);
  rows.push(d)
  addTomap(d);
    }, function(error, d) {
        //Error
    });


function addTomap(d) {
  d3.select("body").append("p").text(d.date_);
}






  