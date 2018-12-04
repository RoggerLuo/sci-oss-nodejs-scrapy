/**
 * Created by lyf on 2017/10/17.
 */
let scraperjs = require( 'scraperjs' );
const scrapeIt = require( "scrape-it" );

scraperjs.StaticScraper.create( 'https://www.journals.elsevier.com/trends-in-food-science-and-technology/recent-articles' )
	.scrape( function( $ ) {

		return scrapeIt.scrapeHTML( $, {
			// Fetch the articles
			articles: {
				listItem: "#Content1 > div.pod-list .pod-listing",
				data: {
					// Get the article date and convert it into a Date object
					createdAt: {
						selector: ".article-info",
						convert: x => new Date( x )
					}
					// Get the title
					,
					title: ".pod-listing-header > a",
					url: {
						selector: ".pod-listing-header > a",
						attr: "href"
					}
					// Nested list
					,
					author: 'small'
						// Get the content
						,
					content: {
						selector: ".article-content",
						how: "html"
					}
				}
			}
		} );
	} )
	.then( function( err, result ) {
		console.log( err || result );
	} )
