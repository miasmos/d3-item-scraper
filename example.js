var d3itemscraper = require('./index')

d3itemscraper.get(function(err, data) {
	for (var i in data) {
		console.log(data[i])
	}
}, 'data.json', true)