
var worldMap = new Datamap({
  element: document.getElementById('map-container'),
  scope: 'world',
  geographyConfig: {
      borderWidth: 0,
      popupOnHover: false,
      highlightOnHover: false
  },

});

//Simplest dataset
var testData = [{
      name: 'Waldo',
      latitude: 36.16,
      longitude: 115.1398,
      radius: 10
    },{
      name: 'Carmen San Diego',
      latitude: 50.07,
      longitude: 78.43,
      radius: 10
    }
  ];

testArr = Array.from(testData);

//Dataset obtained from data.gov
var dataSet = "landslide-test-data.csv";
var landslides = d3.csv(dataSet, function(d) {
      return {
        Latitude: d.Latitude, Longitude: d.Longitude, Casualties: d.Casualties, Date: d.Date
     };
  
    }, function(error, rows) {
        d3.select("#output")
            .text(
                rows[0].Latitude + " " +
                rows[0].Longitude + " " +
                "had " + rows[0].Casualties + " casualties")
    });


//Datamaps library bubble function
  worldMap.bubbles(testData, {
      popupTemplate: function (geo, data) {
              return ['<div class="hoverinfo">' +  data.name +
              '</div>'].join('');
      }
  });


//d3 add text

for (var i = 0; i < testArr.length; i++) {
  d3.select("body").append("p").text(testArr[i].name);
  console.log(testArr[i]);
}


  