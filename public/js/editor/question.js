( function () {
	"use strict";

	window._vm.question = {
		table: ko.DataTable( {
			class: Question,
			columns: [ 'body', 'type' ],
			defaultSort: 'created',
			name: 'question',
			threshold: 30 * 1000,
			goto: function ( item ) {
				var p = window.location.pathname.split( '/' );
				p = p.slice( 0, 3 );
				return p.join( '/' ) + '/' + item.initial._id;
			},
			actions: [ {
				name: 'add',
				f: function f() {
					var ex = _vm.test.wo.data.questions().find( function ( e ) {
						return this.initial._id == e.initial._id;
					}.bind( this ) );
					if ( !ex ) _vm.test.wo.data.questions.push( Draggable( this ) );
					else alert( 'Exists' )
				}
			} ]
		} ),
		wo: null,
		init: function init( id ) {
			if ( id != 'new' ) {
				return Server.get( '/api/question/' + id, {
					select: '+correct'
				} ).then( function ( data ) {
					data = data.result;
					data.options = data.options.map( function ( opt ) {
						return ko.observable( opt );
					} );
					data.correct = data.correct.map( function ( opt ) {
						return data.options.find( function ( it ) {
							return it() == opt;
						} );
					} );
					return Promise.resolve( this.wo = Question( data ) );
				}.bind( this ) );
			}
			return Promise.resolve( this.wo = Question() );
		}
	}

	window._vm.guards.push( [ window._vm.question.init.bind( window._vm.question ) ] );
	window._vm.guards[ 1 ].push( window._vm.question.table.reload.bind( window._vm.question.table ) );

	function Question( data ) {
		if ( !( this instanceof Question ) ) return new Question( data );
		SObject.call( this, data || Question.default, Question.modelname );
	};

	Question.default = {
		body: '',
		type: '',
		options: [],
		correct: []
	};

	Question.modelname = 'question';

	Question.prototype = Object.create( SObject.prototype, {} );
	Question.prototype.constructor = Question;

	Question.prototype.save = function save() {
		this.data.options = this.data.options().map( function ( opt ) {
			return opt();
		} ).filter( function ( opt ) {
			return !!opt
		} );
		this.data.correct = this.data.correct().map( function ( opt ) {
			return opt();
		} ).filter( function ( opt ) {
			return !!opt
		} );

		return SObject.prototype.save.call( this ).then( function () {
			var p = window.location.pathname.split( '/' );
			p = p.slice( 0, 3 );
			window.pager.navigate( p.join( '/' ) );
		} );
	};

	window.Question = Question;

} )();
