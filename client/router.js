Router.route("/", {
  name: "home",
  template: 'home',
  onBeforeAction: function() {
    this.next();
  }
});

Router.route("/events/now", {
  name: "events",
  template: "events",
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
  },
  onBeforeAction: function() {
    $('body').addClass('page-events');
    this.next();
  },
  onStop: function() {
    $('body').removeClass('page-events');
  }, 
});

Router.route("/events/add", {
  name: "addEvents",
  template: "addEvents",
  waitOn : function(){
    Meteor.subscribe("categorias");
    Meteor.subscribe("events");
  },
  data: {
    MapOptions: function() {
      Location.getLocation();
      if (GoogleMaps.loaded()){
        return {
          center: new google.maps.LatLng(gLati, gLongi),
          zoom: 12
        }
      }
    }
  },
  onBeforeAction: function() {
    $('body').addClass('page-events');
    this.next();
  },
  onStop: function() {
    $('body').removeClass('page-events');
  },
});

Router.route("/events/old", {
  name: "oldEvents",
  template: "oldEvents",
  onBeforeAction: function() {
    $('body').addClass('page-events');
    this.next();
  },
  onStop: function() {
    $('body').removeClass('page-events');
  }
});

Router.route("/places", {
  name: "places",
  template: "places",

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
  },

  onBeforeAction: function() {
    $('body').addClass('page-places');
    this.next();
  },

  onStop: function() {
    $('body').removeClass('page-places');
  }, 
});

