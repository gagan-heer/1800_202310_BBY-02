// MAPBOX DISPLAY
function showEventsOnMap() {
    // Defines basic mapbox data
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ';
    const map = new mapboxgl.Map({
        container: 'map', // Container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Styling URL
        center: [-122.964274, 49.236082], // Starting position
        zoom: 8 // Starting zoom
    });

    // Add user controls to map
    map.addControl(new mapboxgl.NavigationControl());

    // Adds map features
    map.on('load', () => {
        const features = []; // Defines an empty array for information to be added to

        // Defines map pin icon
        map.loadImage(
            'https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png',
            (error, image) => {
                if (error) throw error;

                // Add the image to the map style.
                map.addImage('eventpin', image); // Pin Icon

                // READING information from "events" collection in Firestore
                db.collection("routes").get().then(allEvents => {
                    allEvents.forEach(doc => {
                        // get hike Coordinates
                        lat = doc.data().lat; 
                        long = doc.data().long;
                        console.log(lat,long);
                        coordinates = [long, lat];
                        console.log(coordinates);
                        //read name and the details of hike
                        event_name = doc.data().name; // Event Name
                        preview = doc.data().details; // Text Preview
         

                        // Pushes information into the features array
                        features.push({
                            'type': 'Feature',
                            'properties': {
                                'description': `<strong>${event_name}</strong><p>${preview}</p> <br> <a href="/eachRoute.html?docID=${doc.id}" target="_blank" title="Opens in a new window">View Details</a>`
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': coordinates
                            }
                        });
                    })

                    // Adds features as a source to the map
                    map.addSource('places', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': features
                        }
                    });

                    // Creates a layer above the map displaying the pins
                    map.addLayer({
                        'id': 'places',
                        'type': 'symbol',
                        'source': 'places',
                        'layout': {
                            'icon-image': 'eventpin', // Pin Icon
                            'icon-size': 0.1, // Pin Size
                            'icon-allow-overlap': true // Allows icons to overlap
                        }
                    });

                    // Map On Click function that creates a popup, displaying previously defined information from "events" collection in Firestore
                    map.on('click', 'places', (e) => {
                        // Copy coordinates array.
                        const coordinates = e.features[0].geometry.coordinates.slice();
                        const description = e.features[0].properties.description;

                        // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }

                        new mapboxgl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(description)
                            .addTo(map);
                    });

                    // Change the cursor to a pointer when the mouse is over the places layer.
                    map.on('mouseenter', 'places', () => {
                        map.getCanvas().style.cursor = 'pointer';
                    });

                    // Defaults cursor when not hovering over the places layer
                    map.on('mouseleave', 'places', () => {
                        map.getCanvas().style.cursor = '';
                    });
                })

            });
    })
}

showEventsOnMap()


