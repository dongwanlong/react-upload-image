define(['angular',
        'src/apps/common/services/Utility',
        'angularMocks'],
    function(angular, Utility) {
        describe('Utility.test isInt', function() {
            var utility;
            beforeEach(module('common.service'));
            beforeEach(function() {
                module(function($provide) {
                    $provide.value('$window', {});
                    $provide.value('$document', {});
                    $provide.value('$cookies', {});
                });

                inject(function($injector) {
                    utility = $injector.get('Utility');
                });
            });
            it('input [200] should be true', function() {
                expect( utility.isInt(200) ).toEqual(true);
            });

            it('should ["dw"] should be false', function() {
                expect( utility.isInt("dw") ).toEqual(false);
            });
        });

    }
);