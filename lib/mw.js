const mongoose = require( 'mongoose' );
const Log = require( 'debug' )( 'app:lib:mw' );
const models = require('../requireAll')('./model/schema');

const create = ( modelname ) => {
	const model = mongoose.model( modelname );
	return ( req, res, next ) => {
		model.create( req.body ).then( ( doc ) => {
			res.status( 200 ).end();
		} ).catch( ( e ) => {
			Log( e.stack || e );
			res.status( 400 ).end();
		} );
	};
};

const find = ( modelname ) => {
	const model = mongoose.model( modelname );
	return ( req, res, next ) => {
		let q = req.params.id;
		if ( q ) q = model.find( {
			_id: q
		} ).exec();
		else{
			q = model.find()
			.sort( req.query.sort )
			.skip( req.query.index * req.query.size )
			.limit( Number(req.query.size) );

			q = Promise.all( [
				q.exec(),
				model.count().exec()
			] );
		}
		q.then( ( [ doc, N ] ) => {
			if ( !doc ) return res.status( 404 ).end();
			req.locals[ modelname ] = N > -1 ? {
				items: doc,
				totalItems: N
			} : doc;
			next();
		} ).catch( ( e ) => {
			Log( e.stack || e );
			res.status( 400 ).end();
		} );
	};
};

const modify = ( modelname ) => {
	return ( req, res, next ) => {
		let doc = req.locals[ modelname ];
		Object.assign( doc, req.body );
		doc.save().then( ( doc ) => {
			res.status( 200 ).end();
		} ).catch( ( e ) => {
			Log( e.stack || e );
			res.status( 400 ).end();
		} );
	};
};

const respond = ( modelname ) => {
	return ( req, res, next ) => {
		res.json( {
			result: modelname ? req.locals[ modelname ] : req.locals
		} );
	};
};

module.exports = {
	create,
	modify,
	find,
	respond
};
