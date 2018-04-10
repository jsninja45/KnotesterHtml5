(function() {
    'use strict';
    angular.module('studentApp')
        .controller('LoginCtrl', LoginCtrl);
    LoginCtrl.$inject = ['AuthService', '$rootScope', '$scope', '$location', '$timeout', '$http'];

    function LoginCtrl(AuthService, $rootScope, $scope, $location, $timeout, $http) {
        var vm = this;
        vm.login = login;
        vm.signup = signup;

        initController();

        function initController() {}

        function login() {
            vm.dataLoading = true;
            AuthService.Login(vm.email, vm.password, function(result) {
                    $location.path('/');
                    $timeout(function() {}, 0);
                },
                function(error) {
                    vm.dataLoading = false;
                });
        };

        function signup() {
            if (vm.password != vm.password2 || vm.password.length < 6) {
                return;
            }
            var user = {
                firstName: vm.firstName,
                lastName: vm.lastName,
                email: vm.email,
                password: vm.password
            }
            AuthService.signUp(user, function(result) {
                    $location.path('/');
                    $timeout(function() {}, 0);
                },
                function(error) {
                    vm.dataLoading = false;
                });
        }
    }
})();
