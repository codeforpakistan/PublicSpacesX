Events = new Mongo.Collection('Events');
Places = new Mongo.Collection('Places');

var gLati = -25.441105;
var gLongi =-49.276855;
var gZoom = 12;

var donelocation = false;
function getLocation() {
  // Get current latitude and longitudes
  if (!donelocation) {
	  if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(showPosition,noLocation);
	  }
	  donelocation = true;
  }
}

function showPosition(position) {
    // Global variables for use in Google Maps constructor
    gLati = position.coords.latitude;
    gLongi = position.coords.longitude;
    gZoom = 15;
    
    $.each(GoogleMaps.maps,function(map){
	    $.each(GoogleMaps.maps,function(map){
	    	map = GoogleMaps.get(map);
	    	map.instance.setCenter(new google.maps.LatLng(gLati, gLongi));
	    	map.instance.setZoom(gZoom);
	    });
    	
    });
}

function noLocation() {
    console.log('no location');
}

if (Meteor.isClient) {

  accountsUIBootstrap3.setLanguage('pt-BR');

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
            zoom: gZoom
          }
        }
      }
    }});
  });

  Router.route("/events/old", function(){
    this.render("oldEvents");
  });

  Router.route("/places", function(){
    this.render("places", {data: {
      MapOptions: function() {
        getLocation();
        if (GoogleMaps.loaded()){
          return {
            center: new google.maps.LatLng(gLati, gLongi),
            zoom: gZoom
          }
        }
      }
    }});
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

  Template.places.created = function(){
    GoogleMaps.ready('places', function(map) {
      var infowindow = new google.maps.InfoWindow();

      Places.find().forEach(function (doc) {
        var content = 
        	"<h4>"+ doc.NM_ABREV_EQUI + "</h4>" +
        	"<p><strong>"+ doc.DS_TEMA + "</strong><p>" +
        	"<p><em>"+ doc.DS_SUBTIPO_EQUIPAMENTO + "</em><p>";
        	
        if (doc.TELEFONE_EQUI) {
        	content = content + "<p><b>Fone:</b> " + doc.TELEFONE_EQUI + "</p>"
        }

    	lat = parseInt(doc.LAT_SIRGAS.replace(/\s/g, '').substr(0,9), 10) / 1000000;
    	lon = parseInt(doc.LON_SIRGAS.replace(/\s/g, '').substr(0,9), 10) / 1000000;

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
  /*
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
*/
}

if (Meteor.isServer) {

	Meteor.methods({
	

	    reset_places: function() {

			console.log(">---------- Starting resetting places");
	    	
	    	console.log('Places to delete: ' + Places.find().fetch().length);
	    	Places.remove({});
	    	console.log('Places removed');
	    	
	    	Meteor.call('reload_places');
	    	
			console.log(">---------- Finished resetting places");
	    },


	    reload_places: function() {

			console.log(">---------- Starting reloading places");

			Papa.parse(Assets.getText("data/unidades.csv"), {
				download: true,
				header: true,
				skipEmptyLines: true,
				dynamicTyping: true,
//				preview: 100,
				encoding: "UTF8",
				step: function(results, parser) {
					if (results.errors && results.errors.length) {
						console.log("Parsing row errors:", results.errors);
					}
					
					if (results.data[0]) {
						
						data = results.data[0];
						data.imported_at = Date.now();
						
						if (data.DS_DEP_ADMINISTRATIVA != 'Particular') {
							
							console.log("Loading: ".data.NM_ABREV_EQUI);
							
							Places.upsert({
							    // Selector
							    source: "CD_EQUI",
							    currency: data.CD_EQUI
							}, {
							    // Modifier
							    $set: data
							});
						}
						
						
					}
					
				},
				complete: function(results) {
					if (results.errors && results.errors.length) {
						console.log("Parsing errors:", results.errors);
					}
					
					console.log(">---------- Finished reloading places");
				}
			});
			
			return true;
			
		}
	
	});

}
