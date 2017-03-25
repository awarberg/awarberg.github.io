requirejs.config({
    paths: {
      'text': 'js/vendor/text.min',
      'ko': 'js/vendor/knockout-min'
    }
});

require(['ko'], function(ko) {
    ko.components.register('wishit-app', {
      require: 'components/wishit/wishit-app.js'
    });
    ko.applyBindings();
});
