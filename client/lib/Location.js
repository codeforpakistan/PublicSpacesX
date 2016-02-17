function _Location() {
  this.donelocation = false;
}

_Location.prototype.showPosition = function(position) {
  // Global variables for use in Google Maps constructor
  gLati = position.coords.latitude;
  gLongi = position.coords.longitude;
  gZoom = 15;

  $.each(GoogleMaps.maps, function(map) {
    $.each(GoogleMaps.maps, function(map) {
      map = GoogleMaps.get(map);
      map.instance.setCenter(new google.maps.LatLng(gLati, gLongi));
      map.instance.setZoom(gZoom);
    });

  });
};

_Location.prototype.getLocation = function() {
  // Get current latitude and longitudes
  if (!this.donelocation) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition, this.noLocation);
    }
    this.donelocation = true;
  }
};

_Location.prototype.noLocation = function () {
  console.log('no location');
};

Location = new _Location();
