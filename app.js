Events = new Mongo.Collection('Events');

function getLocation() {
  // Get current latitude and longitudes
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
    // Global variables for use in Google Maps constructor
    gLati = position.coords.latitude;
    gLongi = position.coords.longitude;
}

if (Meteor.isClient) {

  Meteor.startup(function(){
    GoogleMaps.load();
  });

  Router.route("/", function(){
    this.render("home");
  });

  Router.route("/events/now", function(){
    this.render("ongoingEvents", {data: {
      MapOptions: function() {
        getLocation();
        if (GoogleMaps.loaded()){
          return {
            center: new google.maps.LatLng(gLati, gLongi),
            zoom: 12
          }
        }
      }
    }});
  });

  Router.route("/events/old", function(){
    this.render("oldEvents");
  });

  Router.route("/about", function(){
    this.render("about");
  });

  Template.ongoingEvents.created = function(){
    GoogleMaps.ready('ongoing-events', function(map) {
      var infowindow = new google.maps.InfoWindow();

      Events.find().forEach(function (doc) {
        var name = "<h4>"+ doc.name + "</h4>";
        var date = "<p><b>Date:</b> " + doc.date + "</p>";
        var time = "<p><b>Time:</b> " + doc.time + "</p>";
        var host = "<p><b>Host:</b> " + doc.username + "</p>";
        var des = "<p>" + doc.description + "</p>";
        var details = "<p>" + doc.requirements + "</p>";

        var content = name + date + time + host + des + details;

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(doc.lat, doc.lng),
          animation: google.maps.Animation.BOUNCE,
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

  Template.addForm.created = function(){
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('events', function(map) {
      google.maps.event.addListener(map.instance, 'click', function(event){
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

  Router.route("/events/add", function(){
    this.render("addEvents", {data: {
      MapOptions: function() {
        getLocation();
        if (GoogleMaps.loaded()){
          return {
            center: new google.maps.LatLng(gLati, gLongi),
            zoom: 12
          }
        }
      }
    }});
  });

  Router.route("/leaderboards", function(){
    this.render("leaderboard");
  });

  Template.addForm.events({
    'submit form': function (e) {
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

  //Use username instead of email for signup
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
}
