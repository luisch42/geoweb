function initMap() {

  var polylinePath = [ 
    new google.maps.LatLng(8.998518072412182, -79.51641860906777), 
     new google.maps.LatLng( 8.997710432850354, -79.515177524718),
     new google.maps.LatLng(8.997318026231156, -79.51507014761351),
     new google.maps.LatLng(8.997254392685747,  -79.51393195030695),
     new google.maps.LatLng( 8.99633170501555, -79.51146227690688 ),
     new google.maps.LatLng(8.995907480010658,  -79.51299776949895)];


    var polylineOpt = {
      path: polylinePath,
      map: map,
      strokeColor: '#257896',
      strokeOpacity: 1,
      strokeWeight: 4,
      
  };

   
  var polyline = new google.maps.Polyline(polylineOpt);

  var product = { 
    lat: 8.998518072412182,
    lng: -79.51641860906777, 
    name: 'Inicio', 
  };
  
  var point = new google.maps.LatLng(8.998518072412182, -79.51641860906777);
      var pOptions = {
          position: point, 
          map: map, 
          title: product.name 
      };
      var marker = new google.maps.Marker(pOptions);

      var product = { 
    lat: 8.995875,
    lng: -79.512998, 
    name: 'KIMCHI RESTAURANT', 
  };
  
  var point = new google.maps.LatLng(8.995875, -79.512998);
      var pOptions = {
          position: point, 
          map: map, 
          title: product.name 
      };
      var marker = new google.maps.Marker(pOptions);  

      var product = { 
        lat: 8.995907480010658,
        lng: -79.512998, 
        name: 'Dulce Tentacion', 
      };
      
      var point = new google.maps.LatLng(8.995875, -79.512998);
          var pOptions = {
              position: point, 
              map: map, 
              title: product.name 
          };
          var marker = new google.maps.Marker(pOptions);

}
    


    


  