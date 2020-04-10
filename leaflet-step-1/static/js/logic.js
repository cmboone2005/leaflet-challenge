//get templates and create map function
function createMap(earthquakes) {
 
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }


//  Store API query endpoint
var queryURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

//GET request
d3.json(queryURL, function(data) {
    createFeatures(data.features);
});

//function to set radius
function getRadius(value) {
    return value * 6
}

//function to break up features

function createFeatures(earthquakeData) {
    //style and color
    function styleFun(feature) {
        return {
            opacity: .75,
            radius: getRadius(feature.properties.mag),
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: '#000000',
            stroke: true,
            weight: .5
        };
    }
        function getColor(d) {
            return d > 5  ? '#BD0026' :
                d > 4  ? '#E31A1C' :
                d > 3  ? '#FC4E2A' :
                d > 2  ? '#FD8D3C' :
                d > 1  ? '#FEB24C' :
                d > 0  ? '#FED976' :
                            '#FFEDA0';
    }

    //add popup and bind to feature
    function onEachFeature(feature, layer) {
        layer.bindPopup('<h3>' + feature.properties.place + '</h3><h3><p>' + new Date(feature.properties.time) + '</p>');
    }
    //earthquake layer
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature : onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleFun
    });

    //send layer and create map
    createMap(earthquakes);
}