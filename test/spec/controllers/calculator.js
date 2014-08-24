describe('Unit: CalculatorController', function() {
	// Load the module with CalculatorController
	beforeEach(module('gpaCalc'));

	var ctrl, scope;
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		ctrl = $controller('CalculatorController', {
			$scope: scope
		});
	}));

	it('should have cumu == starting if no credits are entered', function() {
		expect(scope.cumu.gpa()).toEqual(0);
		expect(scope.credits.length).toEqual(0);
		scope.start.gpa = 9.4;
		scope.start.credits = 20.5;
		expect(scope.cumu.gpa()).toEqual(9.4);
		expect(scope.cumu.credits()).toEqual(20.5);
	});

	it('should update cumu as credits are entered', function() {
		expect(scope.cumu.gpa()).toEqual(0);
		scope.credits.push({
			grade: 10,
			credits: 0.5
		});
		expect(scope.cumu.gpa()).toEqual(10);
		expect(scope.cumu.credits()).toEqual(0.5);
		scope.credits.push({
			grade: 8,
			credits: 0.5
		});
		expect(scope.cumu.gpa()).toEqual(9);
		expect(scope.cumu.credits()).toEqual(1);
		scope.credits.push({
			grade: 12,
			credits: 1.0 
		});
		expect(scope.cumu.gpa()).toEqual(10.5);
		expect(scope.cumu.credits()).toEqual(2);
	});

	it('should consider starting GPA when calculating cumu.gpa()', function() {
		expect(scope.cumu.gpa()).toEqual(0);
		scope.start.gpa = 10;
		scope.start.credits = 0.5;
		expect(scope.cumu.gpa()).toEqual(10);
		scope.credits.push({
			grade: 8,
			credits: 0.5
		});
		expect(scope.cumu.gpa()).toEqual(9);
		expect(scope.cumu.credits()).toEqual(1);
	});
});
