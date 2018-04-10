var user = firebase.auth().currentUser;
var newPassword = getASecureRandomPassword();

$(function() {

    $('#recover-submit').click(function(e) {
    	user.updatePassword(newPassword).then(function() {
 		 	console.log('password reset email sent')
		}, function(error) {
  			console.log('password reset unsuccessful')
		});
		// $("#login-form").delay(100).fadeIn(100);
 	// 	$("#register-form").fadeOut(100);
		// $('#register-form-link').removeClass('active');
		// $(this).addClass('active');
		// e.preventDefault();
	});
	// $('#register-form-link').click(function(e) {
	// 	$("#register-form").delay(100).fadeIn(100);
 // 		$("#login-form").fadeOut(100);
	// 	$('#login-form-link').removeClass('active');
	// 	$(this).addClass('active');
	// 	e.preventDefault();
	// });

});










