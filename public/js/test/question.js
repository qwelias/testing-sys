( function () {
	"use strict";

	function Question( data ) {
		if ( !( this instanceof Question ) ) return new Question( data );

		SObject.call( this, data || Question.default, Question.modelname );

		this.att = Attempt();
		this.att.data.question( this.initial._id );
	};

	Object.defineProperty( Question, 'default', {
		enumerable: true,
		get: function () {
			return {
				body: '',
				type: '',
				options: [],
				correct: []
			};
		}
	} );

	Question.modelname = 'question';

	Question.prototype = Object.create( SObject.prototype, {} );
	Question.prototype.constructor = Question;

	Question.prototype.save = function save() {
		return;
	};

	window.Question = Question;

} )();
