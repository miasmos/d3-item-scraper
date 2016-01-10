var d3itemscraper = require('./index')

d3itemscraper.get(function(err, data) {
	for (var i in data) {
		if (!data[i].length) {
			console.log(i + ' has no items')
		}
	}
}, 'data.json', true)