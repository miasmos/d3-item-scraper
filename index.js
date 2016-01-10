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
							self._parseItemList(link, body, function(err, res) {
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
					if (typeof cb === 'function') cb(err, results)
				})
			} else {
				if (typeof cb === 'function') cb(err, results)
			}
			if (verbose) console.log('done')
		})
	}

	_parseItemList(url, data, cb) {
		var $ = cheerio.load(data)
		var type = url.split('/')[url.split('/').length-2]
		var names = {}

		switch(type) {
			case "gem":
				//gems are not in the api
				$('.page-body .data-cell').each(function(i,e) {
					item(this,i,e,true,false)
				})
				break;
			case "dye":
			case "potion":
			case "crafting-material":
				$('.page-body .data-cell').each(function(i,e) {
					item(this,i,e,true)
				})
				break;
			default:
				$('table tbody .item-details').each(function(i,e) {
					item(this,i,e,false)
				})
				break;
		}

		function item(self, index, element, misc, inAPI) {
			var name, rarity, inAPI

			if (!misc) {
				name = $(element).find('.subheader-3 a').attr('href').split('/')
				name = name[name.length-1]
				rarity = getRarity(self)
			} else {
				name = $(element).find('a').attr('href').split('/')
				name = name[name.length-1]
				rarity = getRarity($(self).find('.d3-icon'))
			}

			if (typeof inAPI === 'undefined') inAPI = $(self).find('.item-crafting').length ? false : true

			if (!names[rarity]) names[rarity] = []
			names[rarity].push({name:name, inAPI: inAPI})
		}

		function getRarity(node) {
			if ($(node).hasClass('d3-color-blue') || $(node).hasClass('d3-icon-item-blue')) {
				return 'magic'
			} else if ($(node).hasClass('d3-color-yellow') || $(node).hasClass('d3-icon-item-yellow')) {
				return 'rare'
			} else if ($(node).hasClass('d3-color-green') || $(node).hasClass('d3-icon-item-green')) {
				return 'set'
			} else if ($(node).hasClass('d3-color-orange') || $(node).hasClass('d3-icon-item-orange')) {
				return 'legendary'
			} else {
				return 'common'
			}
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