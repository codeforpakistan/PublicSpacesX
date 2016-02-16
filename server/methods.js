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
