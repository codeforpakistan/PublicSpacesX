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

Template.addForm.helpers({
  categorias: function(){
    return Categorias.find({ name : { $exists : true } }).map(function(cat){
      return {
        label : cat.name,
        value : cat._id,
      }
    })
  },
  places : function(){
    return Places.find({}).map(function(place){
      return {
        label : place.NM_EQUI,
        value : place._id
      };
    });

  }
});

Template.addForm.events({
  'submit form': function(e) {
    e.preventDefault();

    var name = e.target.eventName.value;
    var category = e.target.eventCategory.value;
    var place = e.target.eventPlace.value;
    var date = e.target.eventDate.value;
    var time = e.target.eventTime.value;
    var description = e.target.description.value;
    var requirements = e.target.requirements.value;

    Events.insert({
      name: name,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      category : category,
      place : place,
      date: date,
      dateCreated: new Date(),
      time: time,
      description: description,
      requirements: requirements,
      lat: Session.get("lat"),
      lng: Session.get("lng")
    });

    e.target.eventName.value = "";
    e.target.eventCategory.value = "";
    e.target.eventPlace.value = "";
    e.target.eventDate.value = "";
    e.target.eventTime.value = "";
    e.target.description.value = "";
    e.target.requirements.value = "";
  }
});
