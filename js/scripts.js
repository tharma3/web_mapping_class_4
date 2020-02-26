// this is my mapboxGL token
// the base style includes data provided by mapbox, this links the requests to my account
mapboxgl.accessToken = 'pk.eyJ1IjoidGhhcm1hMyIsImEiOiJjamkzazRtd3AyNWFyM2twZGpmNWp5Znh3In0.t0f4CwdP5o0wMM6adrU4Cg';

// we want to return to this point and zoom level after the user interacts
// with the map, so store them in variables
var initialCenterPoint = [-73.996117,40.678636]
var initialZoom = 15

// create an object to hold the initialization options for a mapboxGL map
var initOptions = {
  container: 'map-container', // put the map in this container
  style: 'mapbox://styles/mapbox/bright-v10', // use this basemap
  center: initialCenterPoint, // initial view center
  zoom: initialZoom, // initial view zoom level (0-18)
}

var TreeHealth - (code) => {
  switch (code) {
    case 'Fair':
      return {
        color: '72a2c0'
        description: 'Fair'
      };
    case 'Poor':
      return {
        color: 'f2a104'
        description: 'Poor'
      };
    case 'Good':
      return {
        color: '192e5b'
        description: 'Good'
      };
  }
};

// create the new map
var map = new mapboxgl.Map(initOptions);

// add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

/ wait for the initial style to Load
map.on('style.load', function() {

  // add a geojson source to the map using our external geojson file
  map.addSource('bk_nta_trees', {
    type: 'geojson',
    data: './data/bk_nta_trees.geojson',
  });
