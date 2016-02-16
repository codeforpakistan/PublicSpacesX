Template.ongoingEvents.created = function() {
  GoogleMaps.ready('ongoing-events', function(map) {
    var infowindow = new google.maps.InfoWindow();

    Events.find().forEach(function(doc) {
      var name = "<h4>" + doc.name + "</h4>";
      var date = "<p><b>Date:</b> " + doc.date + "</p>";
      var time = "<p><b>Time:</b> " + doc.time + "</p>";
      var host = "<p><b>Host:</b> " + doc.username + "</p>";
      var des = "<p>" + doc.description + "</p>";
      var details = "<p>" + doc.requirements + "</p>";

      var content = name + date + time + host + des + details;

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(doc.lat, doc.lng),
        map: map.instance,
        title: content
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(this.title);
        infowindow.open(map.instance, this);
      });

    });
  });
}
