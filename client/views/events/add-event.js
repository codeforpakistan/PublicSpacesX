var subscribe = null;
Meteor.subscribe("categorias");
var globalMap = null;
var markers = {};
var currentMarker = null;
var infoWindow = null;
var saved_event = null;
var event_Id = null;

Template.addForm.created = function() {
	event_Id = getEventId();
	subscribe = Meteor.subscribe("places", { NM_ABREV_EQUI : { $exists : true, $ne : '' } });
	// We can use the `ready` callback to interact with the map API once the map is ready.
	GoogleMaps.ready('events', function(map) {
		var MARKER_DEFAULT = {
				url: "/default_marker.png",
				scaledSize: new google.maps.Size(30, 55),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(15, 58)
		};

		//Reset global vars
		infoWindow = new google.maps.InfoWindow();
		globalMap = map.instance;
		markers = {};

		Places.find(gFilterAllPlaces).forEach(function(place) {
			var content =
				"<h4>" + place.NM_ABREV_EQUI + "</h4>" +
				"<p><strong>" + place.DS_TEMA + "</strong><p>" +
				"<p><em>" + place.DS_SUBTIPO_EQUIPAMENTO + "</em><p>";

			if (place.TELEFONE_EQUI) {
				content = content + "<p><b>Fone:</b> " + place.TELEFONE_EQUI + "</p>"
			}

			lat = parseInt(place.LAT_SIRGAS.replace(/\s/g, '').substr(0, 9), 10) / 1000000;
			lon = parseInt(place.LON_SIRGAS.replace(/\s/g, '').substr(0, 9), 10) / 1000000;

			image = 'place_default.png';
			if (gPlaceIcons[place.DS_SUBTIPO_EQUIPAMENTO]) {
				image = gPlaceIcons[place.DS_SUBTIPO_EQUIPAMENTO];
			} else {
				if (gPlaceIcons[gCategoryByPlaceTypes[place.DS_SUBTIPO_EQUIPAMENTO]]) {
					image = gPlaceIcons[gCategoryByPlaceTypes[place.DS_SUBTIPO_EQUIPAMENTO]];
				}
			}

			image = new google.maps.MarkerImage('/icons/' + image, null, null, null, new google.maps.Size(64 * 0.4, 64 * 0.4));

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lon),
				map: map.instance,
				title: content,
				icon: image,
				draggable: true
			});

			markers[place._id] = marker;
			marker.place_id = place._id;

			google.maps.event.addListener(marker, 'click', function() {
				moveToLocation(globalMap, this)
			});

			bindDragEvents(marker);

		});

		google.maps.event.addListener(map.instance, 'click', function(event) {
			Session.set("lat", event.latLng.lat());
			Session.set("lng", event.latLng.lng());

			var marker = new google.maps.Marker({
				position: event.latLng,
				draggable: true,
				animation: google.maps.Animation.DROP,
				icon: MARKER_DEFAULT,
				map: map.instance
			});

			moveToLocation(globalMap, marker)
			google.maps.event.addListener(marker, 'click', function() {
				moveToLocation(globalMap, this)
			});
		});
		
		edit_event = getEvent()
		if (edit_event) {
			console.log("Creating marker for event");
			console.log(edit_event);
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(edit_event.lat, edit_event.lng),
				draggable: true,
				animation: google.maps.Animation.DROP,
				icon: MARKER_DEFAULT,
				map: map.instance
			});
			moveToLocation(globalMap, marker);	
		}
	});
};

Template.registerHelper('selectedIf', function(val,place) {
	  return val == place ? 'selected' : '';
});

Template.addForm.helpers({
	categorias: function(){
		var ret = [];
		for (i in gEventTypes) {
			ret.push({
				label : gEventTypes[i],
				value : gEventTypes[i]
			});
		}
		return ret;
	}
	,
	places : function(){
		return Places.find(gFilterAllPlaces).map(function(place){
			return {
				label : place.DS_SUBTIPO_EQUIPAMENTO + ": " + place.NM_ABREV_EQUI,
				value : place._id
			};
		}).sort(function(a,b) { a.label.localeCompare(b.label); });
	}
	,
	saved_event : function(){
		//I'm not sure this is the right place to load the collection data, but it works
		if (event_Id && !saved_event) {
			saved_event = getEvent();
		}
		if (event_Id && saved_event) {
			if (saved_event.owner !== Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			return saved_event;
		}
	},
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

		saved_event = getEvent();
		if (saved_event) {
			Events.update({
				_id: saved_event._id},
				{$set: {
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
				}
			});
			event_id = saved_event._id;
			//Reloading the page is creating problems so I had to reset the global variable
			saved_event = null;
		}
		else {
			event_id = Events.insert({
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
		}
		
		Router.go('/events/now/' + event_id);

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
			console.log("place selected [" + $(e.target).val() + "]");
			marker = markers[$(e.target).val()];
			moveToLocation(globalMap, marker)
			startBounce(marker);
		}
	}
});

function getEventId() {
	if (Router.current().params.event_id) {
		return Router.current().params.event_id;
	}
}
function getEvent() {
	var event_id = getEventId();
	if (event_id) {
		console.log("Editing event_id[" + event_id + "]");
		saved_event = Events.findOne({_id: event_id});
		if (saved_event) {
			console.log(saved_event);
			if (saved_event.owner !== Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			return saved_event;
		}
	}
}

function moveToLocation(map, marker){
	console.log("Moving to marker");
	console.log(marker);
	map.setCenter(marker.getPosition());
	getPosition(marker);
//	resetMarkers(marker);
	$("#selectPlace").val(marker.place_id); //set option to current marker or unselect it if not in the list
	if (marker.title) {
		infoWindow.setContent(marker.title);
		infoWindow.open(globalMap, marker);
	}
}

function toggleBounce(marker) {
	if (marker.getAnimation()) {
		stopBounce(marker);
	} else {
		startBounce(marker);
	}
}

function stopBounce(marker) {
	marker.setAnimation(null);
}

function startBounce(marker) {
	marker.setAnimation(google.maps.Animation.BOUNCE);
}

function getPosition(marker) {
	Session.set("lat", marker.getPosition().lat());
	Session.set("lng", marker.getPosition().lng());
}

function resetMarkers(marker) {
	var MARKER_SELECTED = {
			url: "/selected_marker.png", // url
			scaledSize: new google.maps.Size(30, 55),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(15, 58)
	};
	marker.setIcon(MARKER_SELECTED);
	stopBounce(marker);

	if (currentMarker && currentMarker != marker) {
		reset(currentMarker);
		currentMarker = marker;
	}
	else
		currentMarker = marker;
}

function reset(marker) {
	var MARKER_DEFAULT = {
			url: "/default_marker.png",
			scaledSize: new google.maps.Size(30, 55),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(15, 58)
	};
	marker.setIcon(MARKER_DEFAULT);
	stopBounce(marker);

	if (infoWindow)
		infoWindow.close();
}

function bindDragEvents(marker) {
	google.maps.event.addListener(marker, 'dragend', function () {
		getPosition(this);
	});
	google.maps.event.addListener(marker, 'dragstart', function () {
		stopBounce(this);
//		resetMarkers(marker)
	});
}


