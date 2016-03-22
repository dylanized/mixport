# Mixport

A command line tool for exporting Mixpanel profile data.

You can filter by an email address, a state abbreviation, or specify any other property.

## Basic Use

Export every profile in your account:

```
mixport
```

By default, the output file will be at `exports/all.csv`. Please be aware, this may not work on accounts with a serious amount of people profiles.

Export a single profile in CSV format:

```
mixport someperson@somedomain.com
```

Export all profiles from Missouri in JSON format:

```
mixport MO -j
```

By default, the output file will be at: `exports/{prop_val}.csv`. So, exporting for "MO" would create `export/MO.csv`.

## Additional Options

`-p` property to filter by

`-j` json format

`-o` override the output folder

`-f` override the output filename

More Examples:

`node mixport.js -p '$city' 'Saint Louis' -o cities -j`

exports: cities/SaintLouis.json

## Getting Started

Put your Mixpanel API key & secret in ~/.bash_rc or ~/.zshrc:

        #### Mixpanel
        export MIXPANEL_KEY="{put key here}"
        export MIXPANEL_SECRET="{put key secret}"

## Credits

Thanks to:

- Mixpanelist - https://www.npmjs.com/package/mixpanelist
- Mixpanel - http://mixpanel.com
- states.json by @mshafrir - https://gist.github.com/mshafrir/2646763