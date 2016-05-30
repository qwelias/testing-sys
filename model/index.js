const mongoose = require( "mongoose" );
const express = require( "express" );
const requireAll = require( "../requireAll" );
const Log = require( "debug" )( "app:model" );

const plugins = {
	createdmodified: require('mongoose-createdmodified').createdModifiedPlugin
};

const models = requireAll( "./model/schema" );
const extenders = requireAll( "./model/extender" );

mongoose.Promise = global.Promise;

const doSchema = ( modelname ) => {
	let schema = models[ modelname ].schema;
	schema = new mongoose.Schema( schema, {} );
	if ( extenders[ modelname ] && extenders[ modelname ].useSchema ) {
		extenders[ modelname ].useSchema( schema );
	};
	schema.static( "source", function () {
		return models[ modelname ];
	} );
	schema.static( "filter", function (o) {
		let schema = this.source().schema;
		Object.keys(o).map(k => {
			if(!(k in schema)) delete o[k];
		});
		return o;
	} );
	models[ modelname ].plugin && Object.keys(models[ modelname ].plugin).map( ( name ) => {
		let plugin = plugins[ name ];
		if ( !plugin ) return;
		schema.plugin( plugin, models[ modelname ].plugin[name] || null );
	} );
	return schema;
};

const doModel = ( schema, modelname ) => {
	let model = mongoose.model(
		modelname,
		schema
	);
	if ( extenders[ modelname ] && extenders[ modelname ].useModel ) {
		extenders[ modelname ].useModel( model );
	};
};

let ext = {};

for ( let modelname in models ) {

	doModel( doSchema( modelname ), modelname );

	ext[ modelname ] = ( extenders[ modelname ] && extenders[ modelname ].useRouter ) || null;
};

module.exports = ext;
