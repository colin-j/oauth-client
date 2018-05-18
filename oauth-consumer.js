#!/usr/bin/env node
const express = require('express')
const app = express()
const fs = require('fs')

var port = 3141
// url: https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=3MVG9zlTNB8o8BA3z5jzVrOzV26AGGOtkWM7Vi4k9aEzUWcc5gLxOJuR5vnSEM0nXdpuntPbEXANIJQqJXh_W&redirect_url=http%3A%2F%2Flocalhost%3A3141%2Fcallback
//      https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=3MVG9rFJvQRVOvk5nd6A4swCycqQ0Hogb20LB7z3ndy1lwwrBb99R3GSl09cTKHNcJhIEAY5ttEAczOfCxPJ5&redirect_uri=http%3A%2F%2Flocalhost%3A3835%2Foauth%2F_callback
//

function logRequest(req) {
	console.dir({
		//baseUrl: req.baseUrl,
		//body: req.body,
		//cookies: req.cookies,
		hostname: req.hostname,
		ip: req.ip,
		method: req.method,
		originalUrl: req.originalUrl,
		params: req.params,
		path: req.path,
		proto: req.protocol,
		query: req.query
	})

}

function handleGet(req, res) {
	logRequest(req);
	res.send(fs.readFileSync('oauth.html', { encoding: 'utf8' }));
}

function handlePost(req, res) {
	console.log('access token: ' + req.query.access_token);
	logRequest(req)
	res.sendStatus(200)
}

app.get('/*', (req, res) => handleGet(req,res))
app.post('/*', (req, res) => handlePost(req,res))

app.listen(port, () => console.log('Example app listening on port ' + port))
