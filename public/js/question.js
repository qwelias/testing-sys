( function () {
	this._vm.question = {
		table: ko.DataTable( {
			class: Question,
			columns: [ 'body', 'type' ],
			defaultSort: 'created',
			name:'question',
			goto: function(item){
				return window.location.pathname+'/'+item.initial._id;
			},
			actions:[{
				name:'add',
				f: function(){
					var ex = _vm.test.wo.data.questions().find(function(e){
						return this.initial._id == (typeof e.initial._id == 'function' ? e.initial._id() : e.initial._id);
					}.bind(this));
					if(!ex) _vm.test.wo.data.questions.push(Draggable(this));
					else alert('Exists')
				}
			}]
		} ),
		wo: null,
		init: function ( id ) {
			if ( id != 'new' ) {
				return Server.get( '/api/question/' + id).then( function ( data ) {
					data = data.result;
					return Promise.resolve( this.wo = Question( data ) );
				}.bind( this ) );
			}
			return Promise.resolve( this.wo = Question() );
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
