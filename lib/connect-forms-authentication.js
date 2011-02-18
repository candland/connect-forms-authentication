/**
 * Copyright (c) 2011, Dusty Candland
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are 
 * permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this list 
 *   of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice, this 
 *   list of conditions and the following disclaimer in the documentation and/or other 
 *   materials provided with the distribution.
 * * Neither the name of the <ORGANIZATION> nor the names of its contributors may be 
 *   used to endorse or promote products derived from this software without specific 
 *   prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS 
 * OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY 
 * AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER 
 * OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
 */

var sys = require('sys');
var crypto = require('crypto')

module.exports = {
	isAuthenticated: function(req) {
		return req.session.auth && req.session.auth === true;
	},
	
	authenticate: function(req, res, next) {
		sys.log('authenticate');

		if (req.session.auth)
			return next();

    res.writeHead(403);
    res.end('Sorry you are unauthorized.\n\n');
    return;
	},

	setAuthenticatedUser: function(defaultRedirect, getUserId) {
		return function(req, res, next) {
			getUserId(req, function(userId) {
				if (!userId) {
					sys.log('redirecting back to login page.');
				}
				else {
					sys.log('setting user' + userId);
					req.session.auth = true;
					req.session.userId = userId;
					res.redirect(defaultRedirect);
				}
			});
		};
	},

	removeAuthenticatedUser: function(redirectUrl) {
		return function(req, res, next) {
			sys.log('removing user');
			req.session.destroy();
			res.redirect(redirectUrl);
		};
	},

	hashPassword: function(password, salt) {
		return crypto.createHmac('sha1', salt)
											 .update(password)
											 .digest('base64');
	}
};	


