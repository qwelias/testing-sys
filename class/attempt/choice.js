function Choice( {
	user,
	question,
	body
} ) {
	if ( !( this instanceof Choice ) ) return new Choice( {
		user,
		question,
		body
	} );

	if ( !Array.isArray( body ) ) body = [ body ];
	this.body = body.map( opt => {
		if ( typeof opt != 'string' ) throw new Error( 'Invalid input.' );
        return opt.toLowerCase();
	} );

	if ( typeof question != 'string' ) throw new Error( 'Invalid input.' );
	this.question = question;

	if ( typeof user != 'string' ) throw new Error( 'Invalid input.' );
	this.user = user;
};

Object.defineProperties( Choice.prototype, {
	data: {
		enumerable: true,
		get: function(){
			return {
				user: this.user,
				question: this.question,
				body: this.body
			}
		}
	}
} );

module.exports = Choice;
