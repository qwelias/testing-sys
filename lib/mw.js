const mongoose = require( 'mongoose' );
const Log = require( 'debug' )( 'app:lib:mw' );
const models = require( '../requireAll' )( './model/schema' );

const create = ( modelname ) => {
	const model = mongoose.model( modelname );
	return ( req, res, next ) => {
		model.create( model.filter( req.body ) ).then( ( doc ) => {
			res.status( 200 ).end();
		} ).catch( ( e ) => {
			Log( e.stack || e );
			res.status( 400 ).end();
		} );
	};
};

const find = ( modelname ) => {

	const model = mongoose.model( modelname );

	const single = ( req, res, next ) => {
		let q = req.params.id;
		let pop = req.query.pop;
		let select = req.query.select;
		let attBy = req.query.attBy;
		let popSelect = '';
		if ( modelname == 'test' && pop == 'questions' && attBy ) {
			popSelect = '+correct';
		};
		return model.findOne( {
			_id: q
		} ).populate( pop || '', popSelect ).select( select || null ).exec().then( ( doc ) => {
			if ( !doc ) return res.status( 404 ).end();
			if ( modelname == 'test' && pop == 'questions' && attBy ) {
				return doc.attempts( attBy ).then( ( [ fAtts ] ) => {
					doc = doc.toObject();
					doc.questions.map( q => {
						q.att = fAtts.find( att => String( att.question ) === String( q._id ) );
					} );
					req.locals[ modelname ] = doc;
					next();
				} );
			} else {
				req.locals[ modelname ] = doc;
				next();
			}
		} );
	};

	const table = ( req, res, next ) => {
		let sort = req.query.sort;
		let size = Number( req.query.size );
		let skip = Number( req.query.index ) * size;

		let q = model.find();
		sort && ( q = q.sort( sort ) );
		skip && ( q = q.skip( skip ) );
		size && ( q = q.limit( size ) );

		return Promise.all( [
			q.exec(),
			model.count().exec()
		] ).then( ( [ docs, N ] ) => {
			if ( !docs.length ) return res.status( 404 ).end();
			req.locals[ modelname ] = {
				items: docs,
				totalItems: N
			};
			next();
		} );
	};

	return ( req, res, next ) => {
		let process = null;
		if ( req.params.id ) process = single( req, res, next );
		else process = table( req, res, next );

		process.catch( ( e ) => {
			Log( e.stack || e );
			res.status( 400 ).end();
		} );
	};
};

const modify = ( modelname ) => {
	const model = mongoose.model( modelname );
	return ( req, res, next ) => {
		let doc = req.locals[ modelname ];
		Object.assign( doc, model.filter( req.body ) );
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
