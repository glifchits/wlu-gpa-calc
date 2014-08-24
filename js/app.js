var gpaCalc = angular.module('gpaCalc', []);


gpaCalc.controller('CalculatorController', function($scope) {
	// scope object for each additionally entered credit
	$scope.credits = credits = [];

	// scope object for the starting information
	$scope.start = start = {};
	start.gpa = 0;
	start.credits = 0;

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
		return cumu.gpa() - start.gpa;
	};

	$scope.addCredit = function() {
		credits.push({
			grade: 0,
			credits: 0.5,
			name: ''
		});
	};
});
