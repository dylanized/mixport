#!/usr/bin/env node

// includes
	
	var program = require('commander'),
		validator = require("email-validator"),
		fs = require('fs'),
		jsonfile = require('jsonfile'),
		json2csv = require('json2csv');		
	
// commander setup

	program
	  .version('0.0.1')
	  .option('-j, --json', 'JSON export')
	
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
	
		// grab profile data
		
			console.log("grabbing profile data for " + email);
		
		// grab all events
		
			console.log("grabbing event data for " + email);
		
		// save file
		
			var name = email.substr(0, email.search("@"));
			
			// dummy results data
			var results = [
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
			];			
		
			save_file(name, results);
	
	}
	
	function save_file(name, results) {
	
		// grab fields
		var fields = Object.keys(results[0]);
		
		// save file
		if (program.json) exportJSON(name + ".json", results);
		else exportCSV(name + ".csv", results, fields);
	
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