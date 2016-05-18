const attempt = require( '../../requireAll' )( './class/attempt' );
const mongoose = require( 'mongoose' );
const Log = require('debug')('app:model:extender:attempt');

const useSchema = ( schema ) => {
	schema.pre( 'save', function ( next ) {
		mongoose.model('question').findById(this.question, {type: true}).then(q => {
            if(!q) throw new Error('Invalid input.');
            attempt[ q.type ]( this );
    		next();
        }).catch(e => {
            Log(e.stack || e);
        });
	} );

	schema.method( 'check', function () {
		return this.populate( 'question' ).execPopulate().then( att => {
			return att.question.check( att );
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
