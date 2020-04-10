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

    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap,
      "Satellite" : satelliteMap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Earthquakes": earthquakes,
      "Fault Lines" : faultLineLayer
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes, satelliteMap]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    
    var legend = L.control({ position: 'bottomright', background: "#F0FFFF" });

    legend.onAdd = function(myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5, 6, 7],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<b style="background:' + getColor(magnitudes[i] + 1) + '">&nbsp;&nbsp;&nbsp;&nbsp;</b> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

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
            radius: getRadius(feature.properties.mag),
            opacity: .75,
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

var faultLineLayer = new L.LayerGroup();

var faultLineUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
       d3.json(faultLineUrl, data => {
         // console.log(data)
         L.geoJson(data, {
           style: function() {
             return {color: "orange",
                     fillOpacity: 0.3,
           }}
         }).addTo(faultLineLayer)
       })

       function getColor(d) {
        return d > 5 ? '#ff3333' :
               d > 4  ? '#ff6633' :
               d > 3  ? '#ff9933' :
               d > 2  ? '#ffcc33' :
               d > 1   ? '#ffff33' :
                          'ccff33';
       }

      
    



