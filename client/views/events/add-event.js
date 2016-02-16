Template.addForm.created = function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('events', function(map) {
    google.maps.event.addListener(map.instance, 'click', function(event) {
      Session.set("lat", event.latLng.lat());
      Session.set("lng", event.latLng.lng());

      var marker = new google.maps.Marker({
        position: event.latLng,
        animation: google.maps.Animation.DROP,
        map: map.instance
      });
    });
  });
};

Template.addForm.events({
  'submit form': function(e) {
    e.preventDefault();
    name = e.target.eventName.value;
    date = e.target.eventDate.value;
    time = e.target.eventTime.value;
    description = e.target.description.value;
    requirements = e.target.requirements.value;

    Events.insert({
      name: name,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      date: date,
      dateCreated: new Date(),
      time: time,
      description: description,
      requirements: requirements,
      lat: Session.get("lat"),
      lng: Session.get("lng")
    });

    e.target.eventName.value = "";
    e.target.eventDate.value = "";
    e.target.eventTime.value = "";
    e.target.description.value = "";
    e.target.requirements.value = "";
  }
});
