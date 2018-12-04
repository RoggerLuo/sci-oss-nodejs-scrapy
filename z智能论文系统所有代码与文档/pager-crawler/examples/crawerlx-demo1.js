/**
 * Created by lyf on 2017/10/18.
 */

const crawler = require('crawlerx');

crawler.request('https://www.journals.elsevier.com/trends-in-food-science-and-technology/recent-articles',
  { decode: 'utf-8', deep: 1, concurrency: 3 },
  function(err, $, body, url, resp) {
    const result = $('#Content1 > div.pod-list .pod-listing').map(function() {

      return {
        title: $(this).find('.pod-listing-header > a').text()
          .replace(/[\r\n]/g, '')
          .trim(),
        createAt: new Date($(this).find('.article-info').text()),
        author: $(this).find('small').text()
          .replace(/[\r\n]/g, '')
          .trim(),
        url: $(this).find('.pod-listing-header > a').attr('href'),
        content: $(this).find('.article-content').text()
          .trim(),
      };

    }).get();
    console.log(result);
  }
);
