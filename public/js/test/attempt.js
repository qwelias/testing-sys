( function () {
	"use strict";

	function Attempt( data ) {
		if ( !( this instanceof Attempt ) ) return new Attempt( data );
		SObject.call( this, data || Attempt.default, Attempt.modelname );
	};

	Object.defineProperty( Attempt, 'default', {
		enumerable: true,
		get: function () {
			return {
				user: '5745a34ba2d202b23fec278d',
				question: '',
				body: []
			};
		}
	} );

	Attempt.modelname = 'attempt';

	Attempt.prototype = Object.create( SObject.prototype, {} );
	Attempt.prototype.constructor = Attempt;

	Attempt.prototype.save = function save() {
		return SObject.prototype.save.call( this );
	};

	window.Attempt = Attempt;

} )();
