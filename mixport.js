#!/usr/bin/env node

// script setup
	
	var program = require('commander'),
		email_validator = require("email-validator"),
		fs = require('fs'),
		jsonfile = require('jsonfile'),
		json2csv = require('json2csv'),
		path = require('path'),
		Mixpanelist = require('mixpanelist');
		
	var config = require('./config.json'),	
		states = require('./states.json');
		
	var mixpanelist = new Mixpanelist(config);			
	
// commander setup

	program
	  .version('0.0.1')
	  .option('-j, --json', 'JSON export')
	  .option('-f, --filename <name>', 'Override filename')
	  .option('-e, --export <export>', 'Export folder', 'export')
	  .option('-p, --prop <prop>', 'Property to filter', 'prop')	  
	
	program
	  .command('*')
	  .action(function(arg){

	  	// if email
	  	if (is_email(arg)) export_profiles("$email", arg);
	  	
	  	// if state
	  	else if (is_state(arg)) export_profiles("$state", arg.toUpperCase());
	  		  	
	  	// prop mode
	    else if (program.prop) export_profiles(program.prop, arg);
	    
	    // error
		else {    	    
	    	console.log ("Please supply an email address or a state!");
			program.outputHelp();	    	
	    }
	    
	    // conditional helpers
	    
	    function is_email(arg) {
			if (email_validator.validate(arg)) return true;
			else return false;
	    }
	    
	    function is_state(arg) {
	    	var state = arg.toUpperCase();
	    	if (state in states) return true;
	    	else return false;
	    }    
	    
	});
	
	program.parse(process.argv);

// export

	function export_profiles(prop_name, prop_val) {
	
		get_profiles(prop_name, prop_val, function(results) {
								 	
	 		// build flat profile list
	 	
	 		var profiles = [];
	 	
		 	results.forEach(function(e) {
		 		var profile = e["$properties"];
		 		profile["$distinct_id"] = e["$distinct_id"];
			 	profiles.push(profile);				 		
		 	});				 	
				 					
			console.log(profiles.length + " profiles found!");
		
			easy_export(prop_val, profiles);
		
		});	
		
	}
		
	function get_profiles(prop_name, prop_val, cb) {
	
		console.log("Grabbing profile data where " + prop_name + " = " + prop_val);
		
		var query = 'properties["' + prop_name + '"]=="' + prop_val + '"';
		
		mixpanelist.get('/engage', { where: query }, function (err, res) {
		
			if (!err) {
	
				var results = res.results;
			 	
			 	if (results.length > 0) cb(results);
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
 

 
	