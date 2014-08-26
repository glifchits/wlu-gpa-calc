var gpaCalc = angular.module('gpaCalc', ['ngRoute']);


gpaCalc.config(function($routeProvider, $locationProvider) {
	var PAGES = {
		first: 'templates/first.html',
		second: 'templates/second.html',
		credits: 'templates/credits.html'
	};

	$locationProvider.html5Mode(true);
	$routeProvider
		.when('/', {
			templateUrl: PAGES.first
		})
		.when('/2', {
			templateUrl: PAGES.second
		})
		.when('/credits', {
			templateUrl: PAGES.credits
		})
		.otherwise({
			redirectTo: '/credits'
		});
});


gpaCalc.controller('CalculatorController', function($scope) {
	// scope object for each additionally entered credit
	$scope.credits = credits = [];

	// scope object for the starting information
	$scope.start = start = {};
	start.gpa = 9.26;//0;
	start.credits = 19.5;//0;

	// object holding computable values for new cumulative GPA
	$scope.cumu = cumu = {};
	cumu.gpa = function() {
		var result;
		var newGradePoints = 0, numCredits = start.credits;
		credits.forEach(function(credit) {
			newGradePoints += credit.grade * credit.credits;
			numCredits += credit.credits;
		});
		var startGradePoints = start.gpa * start.credits;
		result = (startGradePoints + newGradePoints) / numCredits;
		return result || 0;
	};
	cumu.credits = function() {
		var result, newCredits = 0;
		credits.forEach(function(credit) {
			newCredits += credit.credits;
		});
		result = start.credits + newCredits;
		return result || 0;
	};

	$scope.deltaGPA = function() {
		var result = cumu.gpa() - start.gpa;
		return cumu.gpa() > 0 ? result : 0;
	};

	$scope.addCredit = function() {
		credits.push({
			grade: 0,
			credits: 0.5,
			name: ''
		});
	};

	$scope.removeCredit = function(idx) {
		credits.splice(idx, 1);
	};
});


gpaCalc.filter('change', function() {
	return function(input) {
		input = input.toFixed(3);
		if (input > 0) {
			return "+" + input;
		} else if (input < 0) {
			return "(" + -input + ")";
		} else {
			return "0";
		}
	};
});
