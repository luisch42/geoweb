function initMap() {

  var polylinePath = [ 
    new google.maps.LatLng(8.998518072412182, -79.51641860906777), 
     new google.maps.LatLng( 8.997873070746152, -79.51534301634958),
     new google.maps.LatLng(8.997354539161549, -79.5150613134947),
     new google.maps.LatLng(8.997069978829188, -79.51270525325515)];

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
        lat: 8.997069978829188,
        lng: -79.51270525325515, 
        name: 'KIMCHI RESTAURANT', 
      };
      
      var point = new google.maps.LatLng(8.997069978829188, -79.51270525325515);
          var pOptions = {
              position: point, 
              map: map, 
              title: product.name 
          };
          var marker = new google.maps.Marker(pOptions);

}








    


    


  