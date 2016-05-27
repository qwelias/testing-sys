const OIDRE = new RegExp(/^[a-f\d]{24}$/i);

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


	if ( !OIDRE.test(String(question)) ) throw new Error( 'Invalid input.' );
	this.question = String(question);

	if ( !OIDRE.test(String(user)) ) throw new Error( 'Invalid input.' );
	this.user = String(user);
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
