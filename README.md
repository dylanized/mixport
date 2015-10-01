# Mixport

A command line tool for exporting Mixpanel profile data

## Basic Use

Export events data in CSV format:

`node mixport.js someperson@somedomain.com`

By default, the output file will be at: exports/someperson.csv

## Additional Options

`-j` json format

`-f` change the filename

`-e` change the exports folder

Example: 

`node mixport.js someperson@somedomain.com -j -f newfilename -e newfolder`

will export a file at: newfolder/newfilename.json

## Getting Started

Fill out the fields in config.sample.json, change the name to config.json, and you can begin using it as shown above.








