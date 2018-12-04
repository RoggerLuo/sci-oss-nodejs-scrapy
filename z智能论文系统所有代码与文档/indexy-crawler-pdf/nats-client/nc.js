'use strict';

const config = require( '../config' );

const nats_stream = module.exports = require( 'node-nats-streaming' ).connect( config.nats.clusterId, config.nats.clientId, config.nats.opts );


nats_stream.on( 'error', ( e ) => {
	console.log( 'Error [' + nats_stream.options.url + ']: ' + e );
} );

// nats_stream.once( 'connect', ( _nats_stream ) => {});

nats_stream.once( 'close', () => {
	console.log( 'nats_stream client closed' );
} );

nats_stream.on( 'disconnect', () => {
	console.log( 'nats_stream client disconnect' );
} );

nats_stream.once( 'reconnecting', () => {
	console.log( 'nats_stream client reconnecting...' );
} );

nats_stream.on( 'reconnect', () => {
	console.log( 'nats_stream client reconnect' );
} );
