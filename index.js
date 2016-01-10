'use strict'
var request = require('request')
var cheerio = require('cheerio')
var async = require('async')
var fs = require('fs')

class d3ItemScraper {
	get(cb, filename, verbose) {
		if (typeof verbose === 'undefined') verbose = false
		if (typeof filename === 'undefined') filename = false
		var self = this

		async.waterfall([
			function(cb1) {
				//get all the items category pages
				request('http://us.battle.net/d3/en/item/', function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				    self._parseItemCategoriesLinks(body, cb1)
				  } else {
				  	cb1(error)
				  }
				})
			},
			function(links, cb1) {
				//fetch each item category page
				var data = {}
				var cnt = 0
				async.each(links, function(link, cb2) {
					request('http://us.battle.net'+link, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							self._parseItemList(body, function(err, res) {
								if (verbose) console.log(`done parsing ${link}`)
								var type = link.split('/')[link.split('/').length-2]
								if (!err) {
									data[type] = res
									cnt += res.length
								}
								cb2(null || err)
							})
						} else {
							cb2(error)
						}
					})
				}, function(err) {
					cb1(err, data)
				})
			}
		], function(err, results) {
			if (filename && !err && results) {
				var pretty = JSON.stringify(results, null, 4)
				fs.writeFile(filename, pretty, function(err) {
					if (!err && verbose) console.log(`wrote to file ${filename}`)
					cb(err, results)
				})
			} else {
				cb(err, results)
			}
			if (verbose) console.log('done')
		})
	}

	_parseItemList(data, cb) {
		var $ = cheerio.load(data)
		var names = []

		$('table tbody tr .subheader-3 a').each(item)

		if (!names.length) {
			//dyes
			$('.page-body .data-cell a').each(item)
		}

		function item(index, element) {
			var split = $(this).attr('href').split('/')
			names.push(split[split.length-1])
		}

		cb(null, names)
	}

	_parseItemCategoriesLinks(data, cb) {
		var $ = cheerio.load(data)
		var links = []
		$('.db-directory-inner a').each(function(index, element) {
			links.push($(this).attr('href'))
		})
		cb(null, links)
	}
}

module.exports = new d3ItemScraper()