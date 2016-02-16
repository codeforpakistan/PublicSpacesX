Router.route("/", function() {
  this.render("home");
});

Router.route("/events/now", function() {
  this.render("events", {
    waitOn : function(){
      Meteor.subscribe("events");
    },
    data: {
      MapOptions: function() {
        Location.getLocation(); // Look at /client/lib/Location.js
        if (GoogleMaps.loaded()) {
          return {
            center: new google.maps.LatLng(gLati, gLongi),
            zoom: gZoom
          }
        }
      }
    }
  });
});

Router.route("/events/add", function(){
  this.render("addEvents", {data: {
    waitOn : function(){
      Meteor.subscribe("categorias");
      Meteor.subscribe("events");
    },
    MapOptions: function() {
      Location.getLocation();
      if (GoogleMaps.loaded()){
        return {
          center: new google.maps.LatLng(gLati, gLongi),
          zoom: 12
        }
      }
    }
  }});
});

Router.route("/events/old", function() {
  this.render("oldEvents");
});

Router.route("/places", function() {
  this.render("places", {
    waitOn : function(){
      Meteor.subscribe("places");
    },
    data: {
      MapOptions: function() {
        Location.getLocation();
        if (GoogleMaps.loaded()) {
          return {
            center: new google.maps.LatLng(gLati, gLongi),
            zoom: gZoom
          }
        }
      }
    }
  });
});

Router.route("/about", function() {
  this.render("about");
});

Router.route("/leaderboards", function(){
  this.render("leaderboard");
});
