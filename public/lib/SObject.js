(function(){
	"use strict";

	function SObject( data, model ) {
		if ( !( this instanceof SObject ) ) return new SObject( data, model );

		this.initial = JSON.parse( JSON.stringify( ko.toJS( data ) ) );

		this.model = model;

		this.data = SObject.fromJS( data );

	};

	SObject.fromJS = function fromJS( o ) {
		var out = {};
		Object.keys( o ).map( function ( k ) {
			if ( Array.isArray( o[ k ] ) ) out[ k ] = ko.observableArray( o[ k ] );
			else out[ k ] = ko.observable( o[ k ] );
		} );
		return out;
	};

	SObject.prototype.toJS = function toJS() {
		return ko.toJS( this.data );
	};

	SObject.prototype.save = function save() {
		return Server.save( '/api/' + this.model, this.toJS() );
	};

	window.SObject = SObject;
})();
