# Mixport

A command line tool for exporting Mixpanel profile data.

You can filter by an email address, a state abbreviation, a zip code, or specify another property.

## Basic Use

Export a single profile in CSV format:

`node mixport.js someperson@somedomain.com`

Export all profiles from Missouri in JSON format:

`node mixport.js MO -j`

By default, the output file will be at: exports/someperson@somedomain.com.csv

## Additional Options

`-j` json format

`-f` change the filename

`-e` change the exports folder

`-p` set property to filter by

More Examples: 

`node mixport.js -p '$city' 'Saint Louis' -e cities -j`

exports: cities/SaintLouis.json


## Getting Started

- Open config.sample.json, fill out the fields
- Change filename name to config.json
- Now you can begin using it as shown above.

## Credits

Thanks to:

- Mixpanelist - https://www.npmjs.com/package/mixpanelist
- Mixpanel - http://mixpanel.com
- states.json by @mshafrir - https://gist.github.com/mshafrir/2646763
- Revolution Messaging - http://revolutionmessaging.com








