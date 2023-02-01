function addFarmacias() {

    //var url = 'datos/farmacias.geojson';
    var url = farmaciasGeoJSON;
    map.addSource('farmacias', {
        type: 'geojson',
        data: url
    });

    map.addLayer({
        'id': 'farmacias',
        'type': 'circle',
        'source': 'farmacias',
        'paint': {
            'circle-color': '#00ff00',
            'circle-radius': 5,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2
        }
    });


} // fin funcion


function buscarFarmacias(valor) {

    var resultadosFarmacias = [];

   // console.info(farmaciasGeoJSON);
    for (var i = 0; i < farmaciasGeoJSON.features.length; i++) {

        var feature = farmaciasGeoJSON.features[i];

        if (feature.properties.nombre && 
            feature.properties.nombre
            .toLowerCase()
            .includes(valor.toLowerCase())
        ) {

            feature['place_name'] = `💊 ${feature.properties.nombre}`;
            feature['center'] = feature.geometry.coordinates;
            feature['place_type'] = ['place'];
            resultadosFarmacias.push(feature);
        }
    }
    return resultadosFarmacias;
} // fin funcion
