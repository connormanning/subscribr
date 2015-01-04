(function() {
    angular.module('demoApp', ['firebase'])
    .controller('demoController',
    function($scope, $firebase) {
        var ref = new Firebase("https://subscribr.firebaseio.com/demo");
        var sync = $firebase(ref);
        $scope.entries = sync.$asObject();
    });
}());

