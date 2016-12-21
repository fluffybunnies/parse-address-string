[![Build Status](https://secure.travis-ci.org/fluffybunnies/parse-address-string.png)](http://travis-ci.org/fluffybunnies/parse-address-string)


# parse-address-string
Extract street, city, state, zip, and country components from single-line address string


## Example
```javascript
var parseAddress = require('parse-address-string')

parseAddress('4296 W 7th St, Long Beach, CA 90802', function(err,addressObj){
	console.log('Street: ', addressObj.street_address1)
	console.log('City: ', addressObj.city)
	console.log('State: ', addressObj.state)
	console.log('Zip: ', addressObj.postal_code)
	console.log('Country: ', addressObj.country)
})
```


## Notes
- This version currently targets US and Canada
	- Many other North American and European countries follow the same standard, but are not explicitly supported in this build
	- Updating `lib/*.json` would get you 90% of the way there
- `explodeAddress` conflates Street1 and Street2 as it is economically difficult to parse with high enough consistency
	- Would require a dictionary of prefix terms ("apt", "ste", etc) with heuristics to ensure it wasn't part of Street1
	- May add support for this in future versions
- Async callback format is for interoperability with potential future versions of this module, or if you wanted to swap it out with (for example) a call directly to google maps api


## Api

### parseAddress( addressString, callback )
`addressString`

`callback(err, addressObj)`
- `err` will always be false in current version, should still check `if (err)` for future compatibility
- `addressObj` has string or NULL properties `street_address1`, `street_address2`, `city`, `state`, `postal_code`, `country`

### parseAddress.explodeAddress( addressString, callback )
Same as `parseAddress()`

### parseAddress.implodeAddress( addressObject, callback)
Inverse of `explodeAddress`

`addressObject` - Object with some properties `street_address1`, `street_address2`, `city`, `state`, `postal_code`, `country`

`callback(err, addressStr)`
- `err` will always be false in current version, should still check `if (err)` for future compatibility
- `addressStr` Follows inline US/CA address format standard: *Street1 Street2, City, State PostalCode, Country*\*<br />
*See APA, usps.gov, google maps, etc


### Test Cases
See `test/test.js` for more

```
// Street address looks like a zip code
parseAddress('90007 W Washington Blvd, Santa Monica, California 90007')
=> {
	street_address1: '90007 W Washington Blvd',
	city: 'Santa Monica',
	state: 'California',
	postal_code: '90007',
	country: null
}

// State with two names spelled out
parseAddress('306 Deep Creek Rd, Fayetteville, North Carolina 28312')
=> {
	street_address1: '306 Deep Creek Rd',
	city: 'Fayetteville',
	state: 'North Carolina',
	postal_code: '28312',
	country: null
}

// Country is appended with comma
parseAddress('1842 W Washington Blvd, Los Angeles, CA 90007, US')
=> {
	street_address1: '1842 W Washington Blvd',
	city: 'Los Angeles',
	state: 'CA',
	postal_code: '90007',
	country: 'US'
}

// Country is appended without comma
parseAddress('1842 W Washington Blvd, Los Angeles, CA 90007 USA')
=> {
	street_address1: '1842 W Washington Blvd',
	city: 'Los Angeles',
	state: 'CA',
	postal_code: '90007',
	country: 'USA'
}

// Canada
parseAddress('646 Union Ave E, Winnipeg, MB R2L 1A4, Canada')
=> {
	street_address1: '646 Union Ave E',
	city: 'Winnipeg',
	state: 'MB',
	postal_code: 'R2L 1A4',
	country: 'Canada'
}

// Canada - no country indicator
parseAddress('229 Begin St W, Thunder Bay, ON P7E 5M5')
=> {
	street_address1: '229 Begin St W',
	city: 'Thunder Bay',
	state: 'ON',
	postal_code: 'P7E 5M5',
	country: null
}

// Street address + city + state only (no postal code)
parseAddress('3300-3332 Glen Koester Ln, Idaho Falls, ID')
=> {
	street_address1: '3300-3332 Glen Koester Ln',
	city: 'Idaho Falls',
	state: 'ID',
	postal_code: null,
	country: null
}

// Street address + city only
parseAddress('757 Juntura-Riverside Rd, Riverside')
=> {
	street_address1: '757 Juntura-Riverside Rd',
	city: 'Riverside',
	state: null,
	postal_code: null,
	country: null
}

// Street address + postal code only
parseAddress('1813 Linda Vista Cir, 92831')
=> {
	street_address1: '1813 Linda Vista Cir',
	city: null,
	state: null,
	postal_code: '92831',
	country: null
}

// Street address only
parseAddress('145 Parkway Ave')
=> {
	street_address1: '145 Parkway Ave',
	city:  null,
	state: null,
	postal_code: null,
	country: null
}

// City only
parseAddress('Los Angeles')
=> {
	street_address1: null,
	city:  'Los Angeles',
	state: null,
	postal_code: null,
	country: null
}

// State only
parseAddress('NJ')
=> {
	street_address1: null,
	city:  null,
	state: 'NJ',
	postal_code: null,
	country: null
}

// Postal code only
parseAddress('13820')
=> {
	street_address1: null,
	city:  null,
	state: null,
	postal_code: '13820',
	country: null
}

// Country only
parseAddress('United States')
=> {
	street_address1: null,
	city:  null,
	state: null,
	postal_code: null,
	country: 'United States'
}
```


## To Do
- Extract Street2

