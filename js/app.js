var app = angular.module('app', ['ngRoute'])

//define routes for the app, each route defines a template and a controller
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/population.html',
      controller: 'BrastlewarkViewController'
    })
    .when('/population', {
      templateUrl: 'views/population.html',
      controller: 'BrastlewarkViewController'
    })

    .when('/population/intro', {
      templateUrl: 'views/intro.html',
      controller: 'BrastlewarkViewController'
    })
    .when('/population/touring', {
      templateUrl: 'views/touring.html',
      controller: 'BrastlewarkViewController'
    })
    .when('/population/profile/:id', {
      templateUrl: 'views/profile.html',
      controller: 'PopulationViewController'
    })

    .otherwise({
      redirectTo: '/'
    });
}]);

app.factory('summons', function ($http) {
  var service = {};

  service.entries = [];

  $http.get('https://raw.githubusercontent.com/rrafols/mobile_test/master/data.json').
    success(function (data) {
      service.entries = data.Brastlewark;
      //".Brastlewark" Here the call to the data of the json structure

      //convert date strings to Date objects
      service.entries.forEach(function (element) {
        element.date = myHelpers.stringToDateObj(element.date);
      });
    })
    .error(function (data, status) {
      alert('error!');
    });


  //get an entry by id, using underscore.js
  service.getById = function (id) {

    //find retrieves the first entry that passes the condition.
    return _.find(service.entries, function (entry) { return entry.id == id });
  };

  //remove an entry
  service.remove = function (entry) {
    service.entries = _.reject(service.entries, function (element) { return element.id == entry.id });
  };

  return service;
});

//listing of all declaration
app.controller('BrastlewarkViewController', ['$scope', 'summons', function ($scope, summons) {
  $scope.declaration = summons.entries;

  $scope.remove = function (call) {
    summons.remove(call);
  };

  //we need to watch the list of declaration more closely to have it always updated
  $scope.$watch(function () { return summons.entries; }, function (entries) {
    $scope.declaration = entries;
  });
}]);

//create or edit an expense
app.controller('PopulationViewController', ['$scope', '$routeParams', '$location', 'summons', function ($scope, $routeParams, $location, summons) {


  //the appeal will either be a new one or existing one if we are editing
  if (!$routeParams.id) {
    $scope.appeal = { date: new Date() }
  }
  else {
    //clone makes a copy of an object
    $scope.appeal = _.clone(summons.getById($routeParams.id));
  }

  //push the appeal to the array of declaration. Duplicate entries will thow error unless adding  "track by $index" to the ng-repeat directive
  $scope.save = function () {
    summons.save($scope.appeal);
    $location.path('/');
  };
}]);

//we create a custom directive so we can use the tag <expense>
app.directive('zvaExpense', function () {
  return {
    restrict: 'E',  //it means it's for elements (custom html tags)
    templateUrl: 'views/totalpopulation.html',
  };
});