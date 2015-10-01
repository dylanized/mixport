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
	  	if (validator.validate(env)) profile_export(env);
	    else console.log ("Please supply a valid email address");
	});
	
	program.parse(process.argv);

// export

	function profile_export(email) {
	
		get_profiles(email, function(profiles) {
		
			easy_export(email, profiles);
		
		});	
		
	}
	
	function get_profiles(email, cb) {

		console.log("Grabbing profile data for " + email);
		
		var query = 'properties["$email"]=="' + email + '"';
		
		mixpanelist.get('/engage', { where: query }, function (err, res) {
		
			if (!err) {

				var results = res.results;
			 	
			 	if (results.length > 0) {
			 	
			 		// build flat profile list
			 	
			 		var profiles = [];
			 	
				 	results.forEach(function(e) {
				 		var profile = e["$properties"];
				 		profile["$distinct_id"] = e["$distinct_id"];
					 	profiles.push(profile);				 		
				 	});				 	
				 	
				 	cb(profiles);
				 	
				}						

				else console.log("No profiles found!");
			
			}
			
			else console.log(err);
		  
		});	
		
	}
	
	function easy_export(name, results) {
	
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
		
		console.log(results);
		
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
 

 
	