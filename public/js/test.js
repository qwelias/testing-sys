( function () {

	this._vm.test = {
		table: ko.DataTable( {
			class: Test,
			columns: [ 'title' ],
			defaultSort: 'created',
			pageSize: 3,
			goto: '../'
		} ),
		wo: null,
		init: function ( id ) {
			if ( id != 'new' ) {
				return Server.get( '/api/test/' + id, {
					pop: 'questions'
				} ).then( function ( data ) {
					data = data.result;
					data.questions = data.questions.map( function ( q ) {
						return Draggable( Question( q ) );
					} );
					return Promise.resolve( this.wo = Test( data ) );
				}.bind( this ) );
			}
			return Promise.resolve( this.wo = Test() );
		}
	}

	function Test( data ) {
		if ( !( this instanceof Test ) ) return new Test( data );

		SObject.call( this, data || Test.default, Test.modelname );

	};

	Test.default = {
		title: '',
		questions: []
	};

	Test.modelname = 'test';

	Test.prototype = Object.create( SObject.prototype, {} );
	Test.prototype.constructor = Test;

	Test.prototype.save = function save() {
		this.data.questions = this.data.questions().map( function ( it ) {
			return it.initial._id;
		} );
		SObject.prototype.save.call( this );
	};

	Test.prototype.rmQuestion = function ( q ) {
		this.data.questions.remove( function ( e ) {
			return e.initial._id == q.initial._id;
		} );
	};

	this.Test = Test;

} )();
