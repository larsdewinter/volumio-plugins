'use strict';

var libQ = require('kew');
var fs=require('fs-extra');
var config = new (require('v-conf'))();
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var io = require('socket.io-client')

var intervalId;

const Lcd = require('lcd');
const lcd = new Lcd({rs: 7, e: 8, data: [25, 24, 23, 18], cols: 20, rows: 4});


module.exports = lcdController;
function lcdController(context) {
	var self = this;

	this.context = context;
	this.commandRouter = this.context.coreCommand;
	this.logger = this.context.logger;
	this.configManager = this.context.configManager;

}



lcdController.prototype.onVolumioStart = function()
{
	var self = this;
	var configFile=this.commandRouter.pluginManager.getConfigurationFile(this.context,'config.json');
	this.config = new (require('v-conf'))();
	this.config.loadFile(configFile);

	lcd.on('ready', _ => {
		lcd.setCursor(0, 0);
		lcd.print("Starting radio", err => {
			if (err) {
			  console.log(err);
			}
		  });
	  });
    return libQ.resolve();
}

lcdController.prototype.onStart = function() {
    var self = this;
	var defer=libQ.defer();


	// Once the Plugin has successfull started resolve the promise
	defer.resolve();

	var socket = io.connect('http://localhost:3000');
	socket.emit('getState', '')
	socket.on('pushState', function(data) {
		if(data.status === "stop") {
			/*intervalId = setInterval(_ => {
				lcd.setCursor(0, 0);
				lcdController.print(new Date().toISOString().substring(11, 19), err => {
					if (err) {
					  console.log(err);
					}
				  });
			  }, 1000);*/
			  console.log(new Date().toISOString().substring(11, 19))
			  lcdController.print(new Date().toISOString().substring(11, 19), err => {
				if (err) {
				  console.log(err);
				}
			  });
		} else if(data.status === "play") {
			lcd.setCursor(0, 0);
			lcd.print(data.title);
			lcd.setCursor(0, 2);
			lcd.print(data.artist);
			lcd.setCursor(0, 1);
			lcd.print(data.album);
		}
  				}
		);



    return defer.promise;
};

lcdController.prototype.onStop = function() {
    var self = this;
    var defer=libQ.defer();
	lcd.close();
    // Once the Plugin has successfull stopped resolve the promise
    defer.resolve();

    return libQ.resolve();
};

lcdController.prototype.onRestart = function() {
    var self = this;
    // Optional, use if you need it
};


// Configuration Methods -----------------------------------------------------------------------------

lcdController.prototype.getUIConfig = function() {
    var defer = libQ.defer();
    var self = this;

    var lang_code = this.commandRouter.sharedVars.get('language_code');

    self.commandRouter.i18nJson(__dirname+'/i18n/strings_'+lang_code+'.json',
        __dirname+'/i18n/strings_en.json',
        __dirname + '/UIConfig.json')
        .then(function(uiconf)
        {


            defer.resolve(uiconf);
        })
        .fail(function()
        {
            defer.reject(new Error());
        });

    return defer.promise;
};

lcdController.prototype.getConfigurationFiles = function() {
	return ['config.json'];
}

lcdController.prototype.setUIConfig = function(data) {
	var self = this;
	//Perform your installation tasks here
};

lcdController.prototype.getConf = function(varName) {
	var self = this;
	//Perform your installation tasks here
};

lcdController.prototype.setConf = function(varName, varValue) {
	var self = this;
	//Perform your installation tasks here
};



// Playback Controls ---------------------------------------------------------------------------------------
// If your plugin is not a music_sevice don't use this part and delete it


lcdController.prototype.addToBrowseSources = function () {

	// Use this function to add your music service plugin to music sources
    //var data = {name: 'Spotify', uri: 'spotify',plugin_type:'music_service',plugin_name:'spop'};
    this.commandRouter.volumioAddToBrowseSources(data);
};

lcdController.prototype.handleBrowseUri = function (curUri) {
    var self = this;

    //self.commandRouter.logger.info(curUri);
    var response;


    return response;
};



// Define a method to clear, add, and play an array of tracks
lcdController.prototype.clearAddPlayTrack = function(track) {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'lcdController::clearAddPlayTrack');

	self.commandRouter.logger.info(JSON.stringify(track));

	return self.sendSpopCommand('uplay', [track.uri]);
};

lcdController.prototype.seek = function (timepos) {
    this.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'lcdController::seek to ' + timepos);

    return this.sendSpopCommand('seek '+timepos, []);
};

// Stop
lcdController.prototype.stop = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'lcdController::stop');


};

// Spop pause
lcdController.prototype.pause = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'lcdController::pause');


};

// Get state
lcdController.prototype.getState = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'lcdController::getState');


};

//Parse state
lcdController.prototype.parseState = function(sState) {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'lcdController::parseState');

	//Use this method to parse the state and eventually send it with the following function
};

// Announce updated State
lcdController.prototype.pushState = function(state) {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'lcdController::pushState');

	return self.commandRouter.servicePushState(state, self.servicename);
};


lcdController.prototype.explodeUri = function(uri) {
	var self = this;
	var defer=libQ.defer();

	// Mandatory: retrieve all info for a given URI

	return defer.promise;
};

lcdController.prototype.getAlbumArt = function (data, path) {

	var artist, album;

	if (data != undefined && data.path != undefined) {
		path = data.path;
	}

	var web;

	if (data != undefined && data.artist != undefined) {
		artist = data.artist;
		if (data.album != undefined)
			album = data.album;
		else album = data.artist;

		web = '?web=' + nodetools.urlEncode(artist) + '/' + nodetools.urlEncode(album) + '/large'
	}

	var url = '/albumart';

	if (web != undefined)
		url = url + web;

	if (web != undefined && path != undefined)
		url = url + '&';
	else if (path != undefined)
		url = url + '?';

	if (path != undefined)
		url = url + 'path=' + nodetools.urlEncode(path);

	return url;
};





lcdController.prototype.search = function (query) {
	var self=this;
	var defer=libQ.defer();

	// Mandatory, search. You can divide the search in sections using following functions

	return defer.promise;
};

lcdController.prototype._searchArtists = function (results) {

};

lcdController.prototype._searchAlbums = function (results) {

};

lcdController.prototype._searchPlaylists = function (results) {


};

lcdController.prototype._searchTracks = function (results) {

};

lcdController.prototype.goto=function(data){
    var self=this
    var defer=libQ.defer()

// Handle go to artist and go to album function

     return defer.promise;
};
