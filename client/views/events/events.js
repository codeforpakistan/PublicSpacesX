var subscribe = null;

Template.events.created = function() {
  subscribe = Meteor.subscribe("events");

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

      // Exibe quantos usuários vão
      if (doc.commingUsers) {
        content += '<p><b>Quantos vão até agora?</b> ' + doc.commingUsers.length + '</p>';
      }

      // Eu vou
      content += '<button class="btn btn-block btn-default btn-eu-vou" data-id="' + doc._id + '">Eu vou!</button>';

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


Template.events.events({
  "click .btn-eu-vou": function(event, template){
    var _id = template.$(event.target).attr('data-id');

    var userId = Meteor.userId();
    if (userId) {
      Events.update(
        { _id : _id },
        { $addToSet : { commingUsers : userId } }
      , function(err, result){
        console.log(err, result);

      });
    }

  }
});
