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

	Question.prototype.check = function check( opt ) {
		if(this.initial.correct.indexOf(opt) > -1){
			return this.att.initial.body.indexOf(opt) > -1;
		}else{
			return this.att.initial.body.indexOf(opt) < 0;
		}
	};

	window.Question = Question;

} )();
