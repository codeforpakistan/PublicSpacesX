var subscribe = null;
var markers = null;
var globalMap = null;

Template.events.created = function() {
  subscribe = Meteor.subscribe("events");

  GoogleMaps.ready('ongoing-events', function(map) {
    var infowindow = new google.maps.InfoWindow();

    markers = {};
    Events.find().forEach(function(doc) {
      var name = "<h4>" + doc.name + "</h4>";
      var category = "<h5>" + doc.category + "</h5>";
      var date = "<p><b>Data:</b> " + doc.date + "</p>";
      var time = "<p><b>Hora:</b> " + doc.time + "</p>";
      var host = "<p><b>Organizador:</b> " + doc.username + "</p>";
      var des = "<p>" + doc.description + "</p>";
      var details = "<p>" + doc.requirements + "</p>";

      var content = name + category + date + time + host + des + details;

      // Exibe quantos usuários vão
      if (doc.commingUsers) {
        content += '<p><b>Quantos vão até agora?</b> ' + doc.commingUsers.length + '</p>';
      }

      // Eu vou
      content += '<button class="btn btn-block btn-default btn-eu-vou" data-id="' + doc._id + '">Eu vou!</button>';

      if (Meteor.userId() && doc.owner == Meteor.userId()) {
    	  content += '<button class="btn btn-block btn-default btn-edit" data-id="' + doc._id + '">Editar</button>';
      }
      
      content += '<button class="btn btn-block btn-default btn-share" data-id="' + doc._id + '">Compartilhe</button>';
      
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(doc.lat, doc.lng),
        map: map.instance,
        title: content
      });
      
      markers[doc._id] = marker;

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(this.title);
        infowindow.open(map.instance, this);
      });

    });
   
    if (Router.current().params.event_id && markers) {
    	marker = markers[Router.current().params.event_id];
    	map.instance.setCenter(marker.getPosition());
    	google.maps.event.trigger(marker, 'click');
    }
    	
  });
}


Template.events.events({
  "click .btn-eu-vou": function(event, template){
    var _id = template.$(event.target).attr('data-id');

    var userId = Meteor.userId();
    if (userId) {
      Events.update(
        { _id : _id },
        { $addToSet : { commingUsers : userId } }
      , function(err, result){
        console.log(err, result);

      });
    }
  },

  "click .btn-edit": function(event, template){
    var event_id = template.$(event.target).attr('data-id');

    var userId = Meteor.userId();
    if (userId) {
    	Router.go('/events/' + event_id);
    }
  },
  
  "click .btn-share": function(event, template){
	  	window.open("https://www.facebook.com/dialog/share?app_id=1697753030496457&display=popup&href="+ encodeURIComponent(window.location) +"&redirect_uri=" + encodeURIComponent(window.location));
  }
});
