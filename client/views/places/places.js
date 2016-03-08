var subscribe = null;

function filteredPlaces () {
	   var list = [];
	   $('input.filter').each(function(){
	   	if (this.checked) list.push(this.value);
	   });
	   if (list.length) {
		   return Places.find({ 
			"DS_SUBTIPO_EQUIPAMENTO" : { $in: list }, 
			"DS_DEP_ADMINISTRATIVA" : { $ne: "Particular" } 
			});
	   } else {
		   return Places.find(gFilterAllPlaces);
	   }
}

Template.places.events({
  	'change input.filter': function (e, template) {  		
	    drawMarkers(mymap,filteredPlaces());
  	},
	'click .login-btn': function(e){
	    e.stopPropagation();
	    Template._loginButtons.toggleDropdown();
	},
	"click #export": function() {
		MyAppExporter.exportJson(filteredPlaces().fetch());
	}
});

Template.places.helpers({
  placeCategories: function() {
    return gPlaceTypesByCategory;
  },
  placeTypes: function() {
    return gPlaceTypes;
  },
  placeIcon: function(type) {
      image = 'place_default.png';
      if (gPlaceIcons[type]) {
        image = gPlaceIcons[type];
      } else {
        if (gPlaceIcons[gCategoryByPlaceTypes[type]]) {
          image = gPlaceIcons[gCategoryByPlaceTypes[type]];
        }
      }

  	return '<img src="icons/' + image + '" title="' + type + '" class="icon"/>';
  },
  
});

var mymap;

Template.places.created = function() {
  subscribe = Meteor.subscribe("places");

  GoogleMaps.ready('places', function(map) {
	drawMarkers(map,filteredPlaces());
	mymap = map;
  });

}

var markers = [];

function drawMarkers(map,places) {
    var infowindow = new google.maps.InfoWindow();

	while(markers.length){
    	markers.pop().setMap(null);
    }
        
    places.forEach(function(doc) {
      var content =
        "<h4>" + doc.NM_ABREV_EQUI + "</h4>" +
        "<p><strong>" + doc.DS_TEMA + "</strong><p>" +
        "<p><em>" + doc.DS_SUBTIPO_EQUIPAMENTO + "</em><p>";

      if (doc.TELEFONE_EQUI) {
        content = content + "<p><b>Fone:</b> " + doc.TELEFONE_EQUI + "</p>"
      }
      if (doc.EMAIL_EQUI) {
        content = content + "<p><b>Email:</b> " + doc.EMAIL_EQUI + "</p>"
      }
      if (doc.SITE_EQUI) {
        content = content + "<p><b>Website:</b> " + doc.SITE_EQUI + "</p>"
      }
      
      if (Meteor.userId) {
	      content = content + '<a href="/events/add" class="btn btn-block btn-default btn-eu-vou">Novo encontro</a>';
      } else {
	      content = content + '<a href="" class="btn btn-block btn-default btn-eu-vou login-btn">Novo encontro</a>';
      }

      lat = parseInt(doc.LAT_SIRGAS.replace(/\s/g, '').substr(0, 9), 10) / 1000000;
      lon = parseInt(doc.LON_SIRGAS.replace(/\s/g, '').substr(0, 9), 10) / 1000000;


      image = 'place_default.png';
      if (gPlaceIcons[doc.DS_SUBTIPO_EQUIPAMENTO]) {
        image = gPlaceIcons[doc.DS_SUBTIPO_EQUIPAMENTO];
      } else {
        if (gPlaceIcons[gCategoryByPlaceTypes[doc.DS_SUBTIPO_EQUIPAMENTO]]) {
          image = gPlaceIcons[gCategoryByPlaceTypes[doc.DS_SUBTIPO_EQUIPAMENTO]];
        }
      }

      image = new google.maps.MarkerImage('icons/' + image, null, null, null, new google.maps.Size(64 * 0.4, 64 * 0.4));

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: map.instance,
        title: content,
        icon: image,
      });
      
      markers[markers.length] = marker;

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(this.title);
        infowindow.open(map.instance, this);
      });

    });
	
}
