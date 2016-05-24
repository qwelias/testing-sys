const express = require( 'express' );
const mongoose = require( "mongoose" );
const session = require( 'express-session' );
const bParser = require( 'body-parser' );
const MongoStore = require( 'connect-mongo' )( session );
const Path = require( 'path' );
const config = require( './config' );
const Log = require( 'debug' )( 'app' );

const app = express();
const http = require( 'http' ).Server( app );

mongoose.Promise = global.Promise;

mongoose.connect( config.db.url );
const db = mongoose.connection;

const userMiddlware = require( './lib/user' );
const sessionMiddleware = session( Object.assign( config.session, {
	store: new MongoStore( {
		mongooseConnection: db
	} )
} ) );

app.use( bParser.json() );
app.use( bParser.urlencoded( {
	extended: true
} ) );

app.use( express.static( Path.resolve( config.root, 'public' ) ) );

app.use( sessionMiddleware );
app.use( userMiddlware );

app.use( ( req, res, next ) => {
	Log( '\n\n\n<=================================>' );
	Log( req.method, req.path, req.query, req.body );
	req.locals = req.locals || {};
	next();
} );

app.use( '/api', require( './router' ) );

app.use( '/editor*', ( req, res ) => res.sendFile( Path.resolve( config.root, 'public', 'editor.html' ) ) );
app.use( '/test*', ( req, res ) => res.sendFile( Path.resolve( config.root, 'public', 'test.html' ) ) );

http.listen( config.PORT, () => {
	Log( 'listening on ', config.PORT );
} );
