This is a simple forms based authentication framework
-----------------------------------------------------

Checkout connect-auth for a full featured option.

The goals of this is to allow you to hook into your own methods for authentication
while providing some simplification of the process. 

Required connect middleware
 
 * app.use(express.cookieDecoder());
 * app.use(express.session({secret: 'random-string'}));

Usage
=====
These examples are using expressjs, but should work with just connectjs.

Require the library:

	var auth = require('./node-forms-authentication');

Use this to handle your login post. Call callback with a user id if successful, undefined otherwise.

	app.post('/login', auth.setAuthenticatedUser('/admin', function(req, callback) {
		callback(1);
	});


Logout can be handled like this.

	app.get('/logout', auth.removeAuthenticatedUser('/'));


Secure a page.

	app.get('/admin', auth.authenticate, function(req, res) {
		res.send("admin page user id: " + req.session.userId);
	});


Create a hashed password. 
	
	var hashed = auth.hashPassword('password', 'salt');

