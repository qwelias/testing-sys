const mongoose = require( 'mongoose' );
const Log = require( 'debug' )( 'app:model:extender:test' );
const QS = require( '../../requireAll' )( './class/question' );

const useSchema = ( schema ) => {
	schema.method( 'result', function ( userid ) {
		const qids = this.questions.map( ( q ) => q._id ? String( q._id ) : String( q ) );
		return Promise.all( qids.map( qid => mongoose.model( 'attempt' ).find( {
			user: userid,
			question: qid
		} ).sort( 'created' ).select( 'question body created' ).populate( 'question', '+correct' ).exec() ) ).then( ( res ) => {
			res = res.map( docs => docs[ 0 ] || null );
			let sum = res.reduce( ( sum, att ) => {
				if ( att ) {
					let type = att.question.type;
					if ( QS[ type ]( att.question ).check( att ) ) sum += 1;
				}
				return sum;
			}, 0 );
			return [ sum, res.length ];
		} );
	} );

	schema.method( 'attempts', function ( userid ) {
		const qids = this.questions.map( ( q ) => q._id ? String( q._id ) : String( q ) );
		const result = [];
		return Promise.all( qids.map( qid => mongoose.model( 'attempt' ).find( {
			user: userid,
			question: qid
		} ).sort( 'created' ).select( 'question body created' ).exec() ) ).then( ( res ) => {
			res.map( ql => ql.map( ( att, i ) => {
				if(!result[i]) result.push([]);
				result[i].push(att);
			} ) );
			return result;
		} );
	} );
};

const useModel = ( model ) => {

};

const useRouter = ( modelname, router ) => {

};

module.exports = {
	useSchema,
	useModel,
	useRouter
};
