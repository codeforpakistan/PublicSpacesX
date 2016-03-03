var subscribe = null;

Template.places.events({
  'change input.filter': function (e, template) {
   var list = [];
   $('input.filter').each(function(){
   	if (this.checked) list.push(this.value);
   });
   drawMarkers(mymap,Places.find({ 
	"DS_SUBTIPO_EQUIPAMENTO" : { $in: list }, 
	"DS_DEP_ADMINISTRATIVA" : { $ne: "Particular" } 
	}));
    
  }
});

Template.places.helpers({
  placeCategories: function() {
    return gPlaceTypesByCategory;
  },
  placeTypes: function(category) {
    return gPlaceTypes;
  },
  
});

var mymap;

Template.places.created = function() {
  subscribe = Meteor.subscribe("places");

  GoogleMaps.ready('places', function(map) {
	drawMarkers(map,Places.find(gFilterAllPlaces));
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
