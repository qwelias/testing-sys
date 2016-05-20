( function () {
	this._vm.question = {
		table: ko.DataTable( {
			class: Question,
			columns: [ 'body', 'type' ],
			defaultSort: 'created',
			name:'question',
			actions:[{
				name:'add',
				f: function(){
					_vm.test.wo.data.questions.push(Draggable(this));
				}
			}]
		} ),
		wo: null,
		init: function(){
			this.wo = Question();
		}
	}
} )();

function Question(data){
	if ( !( this instanceof Question ) ) return new Question( data );

	SObject.call(this, data || Question.default, Question.modelname);

};

Question.default = {
	body: '',
	type: '',
	options: null,
	correct: null
};

Question.modelname = 'question';

Question.prototype = Object.create(SObject.prototype, {});
Question.prototype.constructor = Question;
