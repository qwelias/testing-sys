const express = require( 'express' );
const ext = require( '../model' );

const router = express.Router();

Object.keys( ext ).map( modelname => {
	let mRouter = express.Router();
	ext[ modelname ] && ext[ modelname ]( modelname, router );
	rest( modelname, router );
	router.use( `/${modelname}`, mRouter );
} );

module.exports = router;
