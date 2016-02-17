var subscribe = null;

Template.places.created = function() {
  subscribe = Meteor.subscribe("places");

  GoogleMaps.ready('places', function(map) {
    var infowindow = new google.maps.InfoWindow();

    Places.find().forEach(function(doc) {
      var content =
        "<h4>" + doc.NM_ABREV_EQUI + "</h4>" +
        "<p><strong>" + doc.DS_TEMA + "</strong><p>" +
        "<p><em>" + doc.DS_SUBTIPO_EQUIPAMENTO + "</em><p>";

      if (doc.TELEFONE_EQUI) {
        content = content + "<p><b>Fone:</b> " + doc.TELEFONE_EQUI + "</p>"
      }

      lat = parseInt(doc.LAT_SIRGAS.replace(/\s/g, '').substr(0, 9), 10) / 1000000;
      lon = parseInt(doc.LON_SIRGAS.replace(/\s/g, '').substr(0, 9), 10) / 1000000;

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
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
