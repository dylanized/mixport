#!/usr/bin/env node

// script setup
	
	var program = require('commander'),
		email_validator = require("email-validator"),
		fs = require('fs'),
		jsonfile = require('jsonfile'),
		json2csv = require('json2csv'),
		path = require('path'),
		_ = require('underscore'),
		Mixpanelist = require('mixpanelist');
		
	var config = require('./config.json'),	
		states = require('./states.json');
		
	var mixpanelist = new Mixpanelist(config);			
	
// commander setup

	program
	  .version('0.0.1')
	  .option('-j, --json', 'JSON export')
	  .option('-f, --filename <name>', 'Override filename')
	  .option('-e, --exports <export>', 'Exports folder', 'exports')
	  .option('-p, --prop <prop>', 'Property to filter', 'prop')	  
	
	program
	  .command('*')
	  .action(function(arg){

	  	// if email
	  	if (is_email(arg)) export_profiles("$email", arg);
	  	
	  	// if state
	  	else if (get_state(arg)) export_profiles("$region", get_state(arg), arg);
	  		  	
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
	    
	    function get_state(arg) {
	    	var state = arg.toUpperCase();
	    	// if abbreviation
	    	if (state in states) return states[state];
	    	// else if spelled out
	    	else if ((_.invert(states))[arg]) return arg; 
	    	else return false;
	    }    
	    
	});
	
	program.parse(process.argv);

// export

	function export_profiles(prop_name, prop_val, filename) {
	
		console.log("Querying " + prop_name + " = " + prop_val);

		// set globals
		var query = 'properties["' + prop_name + '"]=="' + prop_val + '"';
		if (typeof filename == 'undefined') filename = prop_val;
		
		var page = 0;
		var total = 0;
		var session_id = false;
		var all_results = [];
	
		// start recursive loop
		get_profiles();
		
		// functions

		function get_profiles() {
		
			var params = {
				where: query
			};
			
			if (session_id) {
				params.page = page;
				params.session_id = session_id;
			}
		
			mixpanelist.get('/engage', params, function (err, res) {
			
				if (err) console.log(err);
				else if (res.error) console.log(res.error);
				else {
				
					// result handler				
					var results = res.results;
			
					// if profiles got returned
					if (results && results.length > 0) {
						// flatten results
					 	results.forEach(function(e) {
					 		var profile = e["$properties"];
					 		profile["$distinct_id"] = e["$distinct_id"];
					 		// add to collection
						 	all_results.push(profile);				 		
					 	});				 	

						if (page == 0 ) console.log("Getting profiles...");																	else console.log("Getting profiles... (page %s)", page + 1);						
					}
					
					// if there might be more results
					if (results && results.length == 1000) {

						// if this is the first page, grab the session id and increment the count
						if (page == 0) session_id = res.session_id;
						page++;
						
						// loop this function
						get_profiles();
						
					}
					// else we are all done
					else {
						console.log("%s profiles found", all_results.length);
						easy_export(filename, all_results);							
					}									
				
				}
			  
			});
		
		}
	}
	
	function easy_export(name, results) {
	
		// remove spaces from filename
		name = name.replace(/\s+/g, '');

		// build name and path
		var ext;
		if (program.json) ext = ".json";
		else ext = ".csv";
		
		var filename;
		if (program.filename) filename = program.filename + ext;
		else filename = name + ext;
		
		var filepath = program.exports + "/" + filename;	
		
		console.log("Exporting %s", filepath);
				
		// create export folder if it doesn't exist
		if (!fs.existsSync(program.exports)) fs.mkdirSync(program.exports);
		
		// delete file if it already exists
		if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
		
		// save file
		if (program.json) exportJSON(filepath, results);
		else {
			var fields = Object.keys(results[0]);			
			exportCSV(filepath, results, fields);
		}
	
	}
	
	function exportJSON(filename, results) {
	
		jsonfile.writeFileSync(filename, results);
				
	}
	
	function exportCSV(filename, results, fields) {	
	
		json2csv({data: results, fields: fields}, function(err, csv) {
		  if (err) console.log(err);
		  fs.writeFile(filename, csv, function(err) {
			if (err) throw err;
		  });
		});				
		
	}
 

 
	