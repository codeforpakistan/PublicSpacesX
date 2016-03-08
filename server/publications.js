Meteor.publish("categorias", function(){
  return Categorias.find({});
});

Meteor.publish("events", function(){
  return Events.find({});
});

Meteor.publish("places", function(find, sort){
  find = find || {};
  sort = sort || {};

  return Places.find(find, sort);
});
