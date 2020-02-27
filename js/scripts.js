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
  style: 'mapbox://styles/mapbox/light-v10', // use this basemap
  center: initialCenterPoint, // initial view center
  zoom: initialZoom, // initial view zoom level (0-18)
}

// var FindTreeHealth - (code) => {
//   switch (code) {
//     case 'Fair':
//       return {
//         color: '72a2c0'
//         description: 'Fair'
//       };
//     case 'Poor':
//       return {
//         color: 'f2a104'
//         description: 'Poor'
//       };
//     case 'Good':
//       return {
//         color: '192e5b'
//         description: 'Good'
//       };
//   }
// };

// create the new map
var map = new mapboxgl.Map(initOptions);

// add zoom and rotation controls to the map.
// map.addControl(new mapboxgl.NavigationControl());

  // wait for the initial style to Load
  map.on('style.load', function() {

    // add a geojson source to the map using our external geojson file
    map.addSource('bk_nta_trees', {
      type: 'geojson',
      data: './data/bk_nta_trees.geojson',
    });

    // let's make sure the source got added by logging the current map state to the console
    console.log(map.getStyle().sources)

    // add a layer for our custom source
    map.addLayer({
      id: 'bk-nta-trees',
      type: 'circle',
      source: 'bk_nta_trees',
      paint: {
        'circle-color': [
            'match',
            ['get', 'health'],
            'Fair',
            '#72a2c0',
            'Poor',
            '#f2a104',
            'Good',
            '#192e5b',
            /* other */ '#ccc'
            ]
        }
      })


    // add an empty data source, which we will use to highlight the lot the user is hovering over
    map.addSource('highlight-feature', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    // add a layer for the highlighted lot
    map.addLayer({
      id: 'highlight-line',
      type: 'circle',
      source: 'highlight-feature',
      paint: {
        'circle-stroke-width': 0.1,
        'circle-stroke-color': 'white',
      }
    });

    // listen for the mouse moving over the map and react when the cursor is over our data

    map.on('mousemove', function (e) {
      // query for the features under the mouse, but only in the lots layer
      var features = map.queryRenderedFeatures(e.point, {
          layers: ['point-bk-nta-trees'],
      });

      // if the mouse pointer is over a feature on our layer of interest
      // take the data for that feature and display it in the sidebar
      if (features.length > 0) {
        map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

        var hoveredFeature = features[0]
        var featureInfo = `
          <h4>Tree ID: ${hoveredFeature.properties.tree_id}</h4>
          <p><strong>Species:</strong> $${hoveredFeature.properties.spc_common}</p>
          <p><strong>Health:</strong> ${hoveredFeature.properties.health}</p>
        `
        $('#feature-info').html(featureInfo)

        // set this lot's polygon feature as the data for the highlight source
        map.getSource('highlight-feature').setData(hoveredFeature.geometry);
      } else {
        // if there is no feature under the mouse, reset things:
        map.getCanvas().style.cursor = 'default'; // make the cursor default

        // reset the highlight source to an empty featurecollection
        map.getSource('highlight-feature').setData({
          type: 'FeatureCollection',
          features: []
        });

        // reset the default message
        $('#feature-info').html(defaultText)
      }
    })

  })
