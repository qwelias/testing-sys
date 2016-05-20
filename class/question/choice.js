function Choice( {
	body,
	options,
	correct,
	type
} ) {
	if ( !( this instanceof Choice ) ) return new Choice({
		body,
		options,
		correct,
		type
	});

	if ( !Array.isArray( correct ) ) correct = [ correct ];
	this.correct = correct.map( opt => {
		if ( typeof opt != 'string' ) throw new Error( 'Invalid input.' );
		return opt.toLowerCase();
	} );

	if ( typeof body != 'string' ) throw new Error( 'Invalid input.' );
	this.body = body;

	if ( !Array.isArray( options ) || !options.length ) throw new Error( 'Invalid input.' );
	options.map( opt => {
		if ( typeof opt != 'string' ) throw new Error( 'Invalid input.' );
	} );
	this.options = options;

	this.type = type;
};

Choice.prototype.check = function check( {
	body
} ) {
	return body.length == this.correct.length && this.correct.every( c => body.indexOf( c ) > -1 );
};

Object.defineProperties( Choice.prototype, {
	data: {
		enumerable: true,
		get: function(){
			return {
				body: this.body,
				correct: this.correct,
				options: this.options,
				type: this.type
			}
		}
	}
} );

module.exports = Choice;
