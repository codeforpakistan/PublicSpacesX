accountsUIBootstrap3.setLanguage('pt-BR');

Meteor.startup(function() {
  GoogleMaps.load();
});



//Use username instead of email for signup
/*
Accounts.ui.config({
passwordSignupFields: "USERNAME_ONLY"
});
*/
