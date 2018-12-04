/**
 * Created by lyf on 2017/10/18.
 */

/**
 * Created by lyf on 2017/10/17.
 */
let scraperjs = require('scraperjs');

scraperjs.StaticScraper.create('https://www.journals.elsevier.com/trends-in-food-science-and-technology/recent-articles')
    .scrape(function($) {

        return $("#Content1 > div.pod-list .pod-listing").map(function() {

            return {
                title : $(this).find( ".pod-listing-header > a" ).text().replace( /[\r\n]/g,"" ).trim(),
                createAt : new Date( $(this).find(".article-info").text() ),
                author : $(this).find( "small" ).text().replace( /[\r\n]/g,"" ).trim(),
                url : $(this).find( ".pod-listing-header > a" ).attr( "href" ),
                content : $(this).find(".article-content").text().trim()
            }

        }).get();
    })
    .then(function(err , result) {
        console.log(err || result);
    })

