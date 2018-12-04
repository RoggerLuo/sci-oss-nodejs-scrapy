'use strict';

const config = require( '../config' ),
	Queue = require( 'bull' );


const crawlerQueue = new Queue( 'task executing', config.redis, {
	retryProcessDelay: config.bull.retryProcessDelay
} );

crawlerQueue.process( 'scraper processor', config.bull.concurrency, ( job ) => {
	// 业务逻辑
} );
