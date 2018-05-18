#!/usr/bin/env node
const express = require('express')
const fs = require('fs')
const open = require('open')

var config = readConfig(process.argv[2])

startConsumerServer()
openBrowserAuth()


function readConfig(configFilename) {
	if (!configFilename) {
		configFilename = './config.json'
	}
	return JSON.parse(fs.readFileSync(configFilename, { encoding: 'utf8' }))
}

function log(msg) {
	if (config.verbose) {
		console.log(msg)
	}
}

function startConsumerServer() {
	var app = express()
	app.get(config.redirectPath, handleGet)
	app.post(config.redirectPath, handlePost)
	server = app.listen(config.listenPort)

	function logRequest(req) {
		log({
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
		logRequest(req)
		res.send(fs.readFileSync('oauth.html', { encoding: 'utf8' }))
		res.end()
	}

	function handlePost(req, res) {
		logRequest(req)
		console.log(JSON.stringify(req.query, null, '  '))
		res.sendStatus(200)
		res.end()
		shutdown()
	}

	function shutdown() {
		// TODO shutdown all open sockets
		process.exit(0)
	}
}

function openBrowserAuth() {

	var params = {
		response_type: 'token',
		client_id: config.clientId
	}

	if (config.sendRedirectUri) {
		params.redirect_uri = 'http://localhost:' + config.listenPort + config.redirectPath
	}
	var url = config.oauthEndpoint + qs(params)
	console.log('auth url: ' + url)
	open(url)

	function param(name, val) {
		var result = encodeURIComponent(name)
		if (val) {
			result += '=' + encodeURIComponent(val)
		}
		return result
	}

	function qs(params) {
		var parts = []
		for (name in params) {
			if (params.hasOwnProperty(name)) {
				parts.push(param(name, params[name]))
			}
		}
		if (parts.length == 0) {
			return ''
		}
		return '?' + parts.join('&')
	}
}

