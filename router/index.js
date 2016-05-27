const express = require( 'express' );
const ext = require( '../model' );
const rest = require( '../lib/rest' );
const Log = require('debug')('app:router');

const router = express.Router();

Object.keys( ext ).map( modelname => {
	let mRouter = express.Router();
	ext[ modelname ] && ext[ modelname ]( mRouter );
	rest( modelname, mRouter );
	router.use( `/${modelname}`, mRouter );
} );

module.exports = router;
