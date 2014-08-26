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

	credits.push({
		grade: '9',
		credits: '0.5',
		name: "marketing"
	});

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
			credits: 0.5,
			name: ''
		});
	};

	var isValid = function(credit) {
		var value = credit.grade !== undefined && credit.grade !== null;
		var inRange = credit.grade >= 0 && credit.grade <= 12;
		var creditsValid = ((credit.credits * 2) % 1 === 0.0);
		var creditsInRange = credit.credits > 0 && credit.credits <= 2;
		return value && inRange && creditsValid && creditsInRange;
	};

	$scope.addIsDisabled = function() {
		var lastCredit = credits[credits.length - 1];
		var enabled = (lastCredit === undefined) || isValid(lastCredit);
		return !enabled;
	};

	$scope.removeCredit = function(idx) {
		credits.splice(idx, 1);
	};

	var hoverIndex = -1;
	$scope.hover = function(idx) {
		return idx === hoverIndex;
	};
	$scope.enableHover = function(idx) {
		hoverIndex = idx;
	};
});


gpaCalc.directive('myNumber', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attr, ngModel) {
			ngModel.$parsers.push(function(value) {
				return parseFloat(value);
			});
		},
		replace: true,
		template: "<input class='my-number'></input>"
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
