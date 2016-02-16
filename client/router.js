Router.route("/", function() {
  this.render("home");
});

Router.route("/events/now", function() {
  this.render("ongoingEvents", {
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

Router.route("/events/old", function() {
  this.render("oldEvents");
});

Router.route("/places", function() {
  this.render("places", {
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

Router.route("/events/add", function(){
  this.render("addEvents", {data: {
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

Router.route("/leaderboards", function(){
  this.render("leaderboard");
});
