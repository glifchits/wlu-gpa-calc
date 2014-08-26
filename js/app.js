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

	var gradeIsValid = function(credit) {
		if (credit === undefined || credit === null) { return false; }
		if (credit.grade === undefined || credit.grade === null) { return false; }
		if (credit.credits === undefined || credit.credits === null) { return false; }
		var gradeInRange = credit.grade >= 0 && credit.grade <= 12;
		var creditsAreMultipleOfHalf = ((credit.credits * 2) % 1 === 0.0);
		var creditsInRange = credit.credits > 0 && credit.credits <= 2;
		return gradeInRange && creditsAreMultipleOfHalf && creditsInRange;
	};

	// object holding computable values for new cumulative GPA
	$scope.cumu = cumu = {};
	cumu.gpa = function() {
		var result;
		var newGradePoints = 0, numCredits = start.credits;
		credits.forEach(function(credit) {
			if (gradeIsValid(credit)) {
				newGradePoints += credit.grade * credit.credits;
				numCredits += credit.credits;
			}
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
	
	$scope.addIsDisabled = function() {
		var lastCredit = credits[credits.length - 1];
		var enabled = (lastCredit === undefined) || gradeIsValid(lastCredit);
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

gpaCalc.directive('credit', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			scope.$watch(attrs.credit, function() {
				var newCredit = elem;
				newCredit.find('input.gpa').focus();
			}, true);
		}
	}
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
