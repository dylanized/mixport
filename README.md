# Mixport

A command line tool for exporting Mixpanel profile data.

You can filter by an email address, a state abbreviation, a zip code, or specify another property.

## Basic Use

Export events data in CSV format:

`node mixport.js someperson@somedomain.com`

By default, the output file will be at: exports/someperson@somedomain.com.csv

## Additional Options

`-j` json format

`-f` change the filename

`-e` change the exports folder

`-p` set property to filter by

More Examples: 

`node mixport.js MO -e states`

exports: states/MO.csv

`node mixport.js Ontario -p Region -j`

exports: exports/Ontario.json


## Getting Started

- Open config.sample.json, fill out the fields
- Change filename name to config.json
- Now you can begin using it as shown above.








