# Mixport

A command line tool for exporting Mixpanel profile data.

You can filter by an email address, a state abbreviation, or specify any other property.

## Basic Use

Export a single profile in CSV format:

`node mixport.js someperson@somedomain.com`

Export all profiles from Missouri in JSON format:

`node mixport.js MO -j`

By default, the output file will be at: exports/someperson@somedomain.com.csv

## Additional Options

`-p` property to filter by

`-j` json format

`-o` override the output folder

`-f` override the output filename

More Examples: 

`node mixport.js -p '$city' 'Saint Louis' -o cities -j`

exports: cities/SaintLouis.json

## Getting Started

Put your mixpanel api key & secret in ~/.bash_rc or ~/.zshrc:

        #### Mixpanel
        export MIXPANEL_KEY="{put key here}"
        export MIXPANEL_SECRET="{put key secret}"

## Credits

Thanks to:

- Mixpanelist - https://www.npmjs.com/package/mixpanelist
- Mixpanel - http://mixpanel.com
- states.json by @mshafrir - https://gist.github.com/mshafrir/2646763
- Revolution Messaging - http://revolutionmessaging.com








