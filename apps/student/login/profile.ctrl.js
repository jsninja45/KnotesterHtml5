(function() {
    'use strict';
    angular.module('studentApp')
        .controller('ProfileCtrl', ProfileCtrl);
    ProfileCtrl.$inject = ['AuthService', '$rootScope', '$scope', '$location', '$timeout', '$http'];

    function ProfileCtrl(AuthService, $rootScope, $scope, $location, $timeout, $http) {
        var vm = this;
        vm.checkEdit = checkEdit;
        vm.saveProfile = saveProfile;
        initController();

        function initController() {
            AuthService.loadCurrentUser().then(function(data) {
                angular.extend($rootScope.currentUser, data);
                vm.firstName = $rootScope.currentUser.firstName;
                vm.lastName = $rootScope.currentUser.lastName;
                vm.phone = $rootScope.currentUser.phone;
            });
        }

        function checkEdit() {
            if (($rootScope.currentUser.firstName == vm.firstName) && ($rootScope.currentUser.lastName == vm.lastName) && ($rootScope.currentUser.phone == vm.phone)) {
                vm.edited = false;
                $('#profile-submit').val('OK');
            } else {
                vm.edited = true;
                $('#profile-submit').val('Update');
            }
        }

        function saveProfile() {
            var user = {};
            user.firstName = vm.firstName;
            user.lastName = vm.lastName;
            user.phone = vm.phone;
            user.userId = $rootScope.currentUser.userId;
            AuthService.SaveProfile(user).then(function(data) {
                $('#profile-submit').val('OK');
                angular.extend($rootScope.currentUser, data);
            }, function(error) {
                $('#profile-submit').val('Failed');
            });
        }
    }
})();
