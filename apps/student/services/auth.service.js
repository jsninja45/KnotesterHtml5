(function() {
    'use strict';
    angular.module('studentApp')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$http', '$rootScope', '$localStorage','$q'];
    //Required to clean codes here
    function AuthService($http, $rootScope, $localStorage,$q) {
        var service = {};
        initService();
        service.Login = Login;
        service.loadCurrentUser = loadCurrentUser;
        service.SaveProfile = SaveProfile;
        service.isLoggedIn = isLoggedIn;
        service.signUp = signUp;
        service.loginToServer = loginToServer;
        return service;

        function initService() {}

        function Login(email, password, loginOK, loginFailed) { //need to change it to promise.
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
                $rootScope.currentUser.userId = firebase.auth().currentUser.uid;
                loginToServer().then(function(user) {
                    loginOK(user);
                }, function(error) {
                    loginFailed(error);
                });

            }, function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                $rootScope.currentUser.userId = null;
                loginFailed(error);
            });
        }
        function isLoggedIn() {
            if ($rootScope.currentUser.userId) {
                return true;
            } else {
                return false;
            }
        }

        function loginToServer() {
            var deferred = $q.defer();
            firebase.auth().currentUser.getToken(false).then(function(idToken) {
                $http.post('/api/auth/firebaseToken', {
                    'idToken': idToken
                }).then(function(response) {
                    if (response.data.success) {
                        $rootScope.currentUser.userId = firebase.auth().currentUser.uid;
                        //read user information
                        loadCurrentUser().then(function(data) {
                            angular.extend($rootScope.currentUser, data);
                            deferred.resolve($rootScope.currentUser)
                        });
                    }
                }, function(error) {
                    $rootScope.currentUser.userId = null;
                    deferred.reject(error);
                });
            });
            return deferred.promise;
        }

        function signUp(user, signupOK, signupFaield) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function(result) {
                //angular.extended(user, result);
                user.userId = result.uid;
                user.phone = '0';
                // loginToServer().then(createProfile(user))
                //     .then(function(data) {
                //         signupOK();
                //     }, function(error) {
                //         signupFaield(error);
                //     });
                loginToServer().then(function(ret){
                  createProfile(user).then(function(data) {
                    //read user information
                    loadCurrentUser().then(function(data) {
                        angular.extend($rootScope.currentUser, data);
                       signupOK();
                    });


                         }, function(error) {
                             signupFaield(error);
                         });
                })
            });
            // firebase.auth().currentUser.getToken(false).then(function(data) {
            //     $http.post('./../api/auth/firebaseToken', {
            //         'idToken': data
            //     }).then(function(data) {
            //         createProfile(user).then(function(data) {
            //             signupOK();
            //         }, function(error) {
            //             signupFaield(error);
            //         });
            //     });
            // })
            // },
            // function(error) {
            //     // Handle Errors here.
            //     var errorCode = error.code;
            //     var errorMessage = error.message;
            //     console.log(error);
            //     signupFaield(error);
            // });
        }

        function loadCurrentUser() {
            return $http.get('/api/users/0').then(handleSuccess, handleError);
        }

        function SaveProfile(user) {
            return $http.put('/api/users/0', user).then(handleSuccess, handleError);
        }

        function createProfile(user) {
            return $http.put('/api/users/create', user).then(handleSuccess, handleError);
        }
    }
    // private functions
    function handleSuccess(res) {
        return res.data;
    }

    function handleError(error) {
        return error;
    }
})();
