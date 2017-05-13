var test = require('tape')
,app = require('../')

test('explodeAddress',function(t){
	var tests = [
		{
			desc: 'basic worky'
			,input: '1842 W Washington Blvd, Los Angeles, CA 90007'
			,expected: {
				street_address1: '1842 W Washington Blvd'
				,city: 'Los Angeles'
				,state: 'CA'
				,postal_code: '90007'
				,country: null
			}
		}
		,{
			desc: 'street address looks like a zip code'
			,input: '90007 W Washington Blvd, Santa Monica, California 90007'
			,expected: {
				street_address1: '90007 W Washington Blvd'
				,city: 'Santa Monica'
				,state: 'California'
				,postal_code: '90007'
				,country: null
			}
		}
		,{
			desc: 'street address is just words'
			,input: 'Trousdale Parkway, Los Angeles, California'
			,expected: {
				street_address1: 'Trousdale Parkway'
				,city: 'Los Angeles'
				,state: 'California'
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'state and city have the same name'
			,input: '1201 Broadway, New York, New York 10001'
			,expected: {
				street_address1: '1201 Broadway'
				,city: 'New York'
				,state: 'New York'
				,postal_code: '10001'
				,country: null
			}
		}
		,{
			desc: 'state with two names spelled out'
			,input: '306 Deep Creek Rd, Fayetteville, North Carolina 28312'
			,expected: {
				street_address1: '306 Deep Creek Rd'
				,city: 'Fayetteville'
				,state: 'North Carolina'
				,postal_code: '28312'
				,country: null
			}
		}
		,{
			desc: 'country is appended with comma'
			,input: '1842 W Washington Blvd, Los Angeles, CA 90007, US'
			,expected: {
				street_address1: '1842 W Washington Blvd'
				,city: 'Los Angeles'
				,state: 'CA'
				,postal_code: '90007'
				,country: 'US'
			}
		}
		,{
			desc: 'country is appended without comma'
			,input: '1842 W Washington Blvd, Los Angeles, CA 90007 USA'
			,expected: {
				street_address1: '1842 W Washington Blvd'
				,city: 'Los Angeles'
				,state: 'CA'
				,postal_code: '90007'
				,country: 'USA'
			}
		}
		,{
			desc: 'canada'
			,input: '646 Union Ave E, Winnipeg, MB R2L 1A4, CA'
			,expected: {
				street_address1: '646 Union Ave E'
				,city: 'Winnipeg'
				,state: 'MB'
				,postal_code: 'R2L 1A4'
				,country: 'CA'
			}
		}
		,{
			desc: 'canada - no country indicator'
			,input: '229 Begin St W, Thunder Bay, ON P7E 5M5'
			,expected: {
				street_address1: '229 Begin St W'
				,city: 'Thunder Bay'
				,state: 'ON'
				,postal_code: 'P7E 5M5'
				,country: null
			}
		}
		,{
			desc: 'street address + city + state only (no postal code)'
			,input: '3300-3332 Glen Koester Ln, Idaho Falls, ID'
			,expected: {
				street_address1: '3300-3332 Glen Koester Ln'
				,city: 'Idaho Falls'
				,state: 'ID'
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'street address + city only'
			,input: '757 Juntura-Riverside Rd, Riverside'
			,expected: {
				street_address1: '757 Juntura-Riverside Rd'
				,city: 'Riverside'
				,state: null
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'street address + postal code only'
			,input: '1813 Linda Vista Cir, 92831'
			,expected: {
				street_address1: '1813 Linda Vista Cir'
				,city: null
				,state: null
				,postal_code: '92831'
				,country: null
			}
		}
		,{
			desc: 'street address only'
			,input: '145 Parkway Ave'
			,expected: {
				street_address1: '145 Parkway Ave'
				,city:  null
				,state: null
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'city only'
			,input: 'Los Angeles'
			,expected: {
				street_address1: null
				,city:  'Los Angeles'
				,state: null
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'state only'
			,input: 'NJ'
			,expected: {
				street_address1: null
				,city:  null
				,state: 'NJ'
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'postal code only'
			,input: '13820'
			,expected: {
				street_address1: null
				,city:  null
				,state: null
				,postal_code: '13820'
				,country: null
			}
		}
		,{
			desc: 'country only'
			,input: 'United States'
			,expected: {
				street_address1: null
				,city:  null
				,state: null
				,postal_code: null
				,country: 'United States'
			}
		}
		,{
			desc: 'empty'
			,input: '  '
			,expected: {
				street_address1: null
				,city:  null
				,state: null
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'invalid input'
			,input: {}
			,expected: {
				street_address1: null
				,city:  null
				,state: null
				,postal_code: null
				,country: null
			}
		}
	]

	t.plan(tests.length)

	tests.forEach(function(test){
		app(test.input,function(err,addressObj){
			if (JSON.stringify(addressObj) != JSON.stringify(test.expected)) console.log(test.desc,'addressObj != test.expected',addressObj,'!=',JSON.stringify(test.expected))
			t.ok(JSON.stringify(addressObj) == JSON.stringify(test.expected), test.desc)
		})
	})
})

test('implodeAddress',function(t){
	var tests = [
		{
			desc: 'basic worky'
			,input: {
				street_address1: '1842 W Washington Blvd'
				,street_address2: ''
				,city: 'Los Angeles'
				,state: 'CA'
				,postal_code: '90007'
				,country: null
			}
			,expected: '1842 W Washington Blvd, Los Angeles, CA 90007'
		}
		,{
			desc: 'has country'
			,input: {
				street_address1: '1842 W Washington Blvd'
				,street_address2: ''
				,city: 'Los Angeles'
				,state: 'CA'
				,postal_code: '90007'
				,country: 'US'
			}
			,expected: '1842 W Washington Blvd, Los Angeles, CA 90007, US'
		}
		,{
			desc: 'has street_address2'
			,input: {
				street_address1: '1842 W Washington Blvd'
				,street_address2: 'Ste 300'
				,city: 'Los Angeles'
				,state: 'CA'
				,postal_code: '90007'
				,country: null
			}
			,expected: '1842 W Washington Blvd Ste 300, Los Angeles, CA 90007'
		}
		,{
			desc: 'invalid input'
			,input: null
			,expected: ''
		}
	]

	t.plan(tests.length)

	tests.forEach(function(test){
		app.implodeAddress(test.input,function(err,addressStr){
			t.ok(addressStr == test.expected, test.desc)
		})
	})
})

