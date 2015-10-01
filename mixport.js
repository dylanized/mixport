#!/usr/bin/env node

// script setup
	
	var program = require('commander'),
		validator = require("email-validator"),
		fs = require('fs'),
		jsonfile = require('jsonfile'),
		json2csv = require('json2csv'),
		path = require('path'),
		Mixpanelist = require('mixpanelist');
		
	var config = require('./config.json');	
	var mixpanelist = new Mixpanelist(config);			
	
// commander setup

	program
	  .version('0.0.1')
	  .option('-j, --json', 'JSON export')
	  .option('-f, --filename <name>', 'Override filename')
	  .option('-e, --export <export>', 'Export folder', 'export')
	
	program
	  .command('*')
	  .action(function(env){
	  	// validate argument
	  	if (validator.validate(env)) mixpanel_export(env);
	    else console.log ("Please supply a valid email address");
	});
	
	program.parse(process.argv);

// export

	function mixpanel_export(email) {
	
		var name = email.substr(0, email.search("@"));
	
		// grab profile data
		
			console.log("Grabbing profile data for " + email);
			
			mixpanelist.get('/events/top', { type: 'general' }, function (err, results) {
			 
			  if (err) {
			    throw err;
			  }
			 
			  var events = results.events;
			  
			  console.log(events);
			  
			  save_file(name, events);
			  
			});			
		
		// grab all events
		
			//console.log("grabbing event data for " + email);
		
		// save file
		
			/*var results = [
			  {
			    "car": "Audi",
			    "price": 40000,
			    "color": "blue"
			  }, {
			    "car": "BMW",
			    "price": 35000,
			    "color": "black"
			  }, {
			    "car": "Porsche",
			    "price": 60000,
			    "color": "green"
			  }
			];*/		
		
	}
	
	function save_file(name, results) {
	
		// build name and path
		var ext;
		if (program.json) ext = ".json";
		else ext = ".csv";
		
		var filename;
		if (program.filename) filename = program.filename + ext;
		else filename = name + ext;
		
		var filepath = program.export + "/" + filename;	
				
		// create export folder if it doesn't exist
		if (!fs.existsSync(program.export)) fs.mkdirSync(program.export);
		
		// save file
		if (program.json) exportJSON(filepath, results);
		else {
			var fields = Object.keys(results[0]);			
			exportCSV(filepath, results, fields);
		}
	
	}
	
	function exportJSON(filename, results) {
	
		console.log("Exporting " + filename);
		
		jsonfile.writeFileSync(filename, results);
				
	}
	
	function exportCSV(filename, results, fields) {	
	
		json2csv({data: results, fields: fields}, function(err, csv) {
		  if (err) console.log(err);
		  fs.writeFile(filename, csv, function(err) {
			if (err) throw err;
		    console.log("Exporting " + filename);
		  });
		});				
		
	}
 

 
	