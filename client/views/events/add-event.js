var subscribe = null;
Meteor.subscribe("categorias");

Template.addForm.created = function() {

  subscribe = Meteor.subscribe("places", { NM_ABREV_EQUI : { $exists : true, $ne : '' } });

  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('events', function(map) {
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
    return Places.find(gFilterAllPlaces).map(function(place){
      return {
        label : place.DS_SUBTIPO_EQUIPAMENTO + ": " + place.NM_ABREV_EQUI,
        value : place._id
      };
    }).sort(function(a,b) { a.label.localeCompare(b.label); });

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
  },
  
	'change .form-control': function(e) {
		console.log("form changed");
		if ($(e.target).prop('id') == "selectPlace") { //Place selector changed, center pin in the map 
			
		}
		var newValue = $(e.target).val();
		var id = $(e.target).prop('id');
	}
});
