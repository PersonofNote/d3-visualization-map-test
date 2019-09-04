
var worldMap = new Datamap({
    element: document.getElementById('map-container'),
    scope: 'world',
    geographyConfig: {
        borderWidth: 0,
        popupOnHover: false,
        highlightOnHover: false
    },

});

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

    worldMap.bubbles(testData, {
        popupTemplate: function (geo, data) {
                return ['<div class="hoverinfo">' +  data.name +
                '</div>'].join('');
        }
    });


    var dataSet = "landslide-test-data.csv";
    var landslides = d3.csv(dataSet, function(d) {
        //console.log(d);
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
    
      console.log(landslides);
    

 
    