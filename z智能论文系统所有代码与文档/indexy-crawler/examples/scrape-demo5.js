/**
 * Created by lyf on 2017/10/18.
 */

var scraperjs = require( 'scraperjs' ),
	scrapeIt = require( 'scrape-it' ),
	asyncm = require( 'async' ),
	router = new scraperjs.Router( {
		firstMatch: false
	} );

var get$ = async( url, isStatic = true ) => {
	let result = await scraperjs[ isStatic ? "StaticScraper" : "DynamicScraper" ].create( url ).scrape( function( $ ) {
		return $;
	} );
	return result;
}

var scrapeForPage = ( regExp, options, isStatic = true ) => {
	router.otherwise( function( url ) {
		console.log( "Url '" + url + "' couldn't be routed." );
	} );
	router.on( regExp )[ isStatic ? "createStatic" : "createDynamic" ]().scrape( function( $ ) {
		return scrapeIt.scrapeHTML( $, options );
	} ).then( function( err, result ) {
		return err || result;
	} );

}

( async function() {

	//爬取第一层
	let $ = await get$( 'https://www.journals.elsevier.com/trends-in-food-science-and-technology/recent-articles' );
	//处理列表，获取第一层数据
	let result = scrapeIt.scrapeHTML( $, {
		articles: {
			listItem: "#Content1 > div.pod-list .pod-listing",
			data: {
				createdAt: {
					selector: ".article-info",
					convert: x => new Date( x )
				},
				title: ".pod-listing-header > a",
				url: {
					selector: ".pod-listing-header > a",
					attr: "href"
				},
				author: 'small'
			}
		}
	} );

	/**
	 * 对爬取回来的列表进行第二层爬取，并做路由检验
	 */
	scrapeForPage( 'http?://(www.)?sciencedirect.com/science/article/pii/:article', {
		abstract: {
			selector: "div.abstract.author",
			how: "html",
			trim: false
		}
	} );
	asyncm.eachLimit( result.articles, 2, function( article, done ) {
		router.route( article.url, function( found, returned ) {
			article.abstract = returned.abstract;
			console.log( article );
			console.log( "---------" );
			done();
		} );
	}, function( err ) {
    console.error(err);
	} );

} )();
