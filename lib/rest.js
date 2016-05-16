const MW = require( './mw' );
const Log = require( 'debug' )( 'app:lib:rest' );

module.exports = ( modelname, router, name = modelname ) => {

	router.post( `/`,
        MW.create( modelname )
    );
	router.put( `/:id`,
		MW.find( modelname ),
		MW.modify( modelname )
	);
	router.get( `/:id?`,
        MW.find( modelname ),
		MW.respond( modelname )
    );

};
