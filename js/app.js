var gpaCalc = angular.module('gpaCalc', []);


gpaCalc.controller('CalculatorController', function($scope) {
	// scope object for each additionally entered credit
	$scope.credits = credits = [{
		grade: 0,
		credits: 0,
		name: ''
	}];

	// scope object for the starting information
	$scope.start = start = {};
	start.gpa = 0;
	start.credits = 0;

	// object holding computable values for new cumulative GPA
	$scope.cumu = cumu = {};
	cumu.gpa = function() {
		var result;
		result = start.gpa;
		return result || 0;
	};
	cumu.credits = function() {
		var result, newCredits = 0;
		credits.forEach(function(credit) {
			newCredits += credit.credits;
		});
		result = parseFloat(start.credits) + newCredits;
		return result || 0;
	};

	$scope.deltaGPA = function() {
		return cumu.gpa() - start.gpa;
	};
});
