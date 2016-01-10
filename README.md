# d3-item-scraper
Scrapes the Diablo 3 website for all valid item names. Gives a complete list of valid items when querying the [diablo api](https://dev.battle.net/io-docs).
  
# Getting Started  
```
npm install
```
  
# Example  
```
var d3itemscraper = require('d3-item-scraper')

d3itemscraper.get(function(err, data) {
	for (var i in data) {
		console.log(data[i])
	}
}, 'data.json', true)
```  
  
# API  
Get(callback, filename, verbose)  
callback, optional Function  
filename, optional String, the name of the file to save to  
verbose, optional Boolean, enables verbose logging  
  
# Licence  
The MIT License (MIT)

Copyright (c) 2015 Stephen Poole

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
