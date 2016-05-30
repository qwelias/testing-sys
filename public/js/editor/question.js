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
				var path = window.History.getState().url.split( '/' );
				var pre = '/';
				var method = 'pushState';
				if(path.length > 5){
					pre = '+';
					method == 'replaceState';
					if(item.initial._id != 'new' && path[path.length-1].indexOf(item.initial._id) > -1) return;
				}
				var p = pre + item.initial._id;
				window.History[ method ]( null, null, path.join( '/' ) + p );
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
		wos: [],
		init: function init( ids ) {
			ids = ids.split( ' ' );
			this.wos.length = Math.max( this.wos.length, ids.length );
			return Promise.all( ids.map( function ( id, i ) {
				console.log('BBBBBBBBBBBBBB', id);
				var ex = this.wos[ i ];
				if ( ex ) {
					if ( id == 'new' && !ex.initial._id ) return Promise.resolve();
					if ( id != 'new' && ex.initial._id == id ) return Promise.resolve();
				}
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
						return Promise.resolve( this.wos[ i ] = Question( data ) );
					}.bind( this ) );
				}
				return Promise.resolve( this.wos[ i ] = Question() );
			}.bind( this ) ) );
		}
	}

	window._vm.guards.push( [ window._vm.question.init.bind( window._vm.question ) ] );
	window._vm.guards[ 1 ].push( window._vm.question.table.reload.bind( window._vm.question.table ) );

	function Question( data ) {
		if ( !( this instanceof Question ) ) return new Question( data );
		SObject.call( this, data || Question.default, Question.modelname );
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
			var url = window.History.getState().url.split( '/' );
			var p = url.pop();
			var i = window._vm.question.wos.findIndex( function ( q ) {
				if ( this.initial._id ) {
					return q.initial._id == this.initial._id;
				} else {
					return q.data.body() == this.data.body();
				}
			}.bind( this ) );
			window._vm.question.wos.splice( i, 1 );
			p = window._vm.question.wos.map( function ( q ) {
				if ( q.initial._id ) return q.initial._id;
				else return 'new';
			}.bind( this ) );
			console.log('AAAAAAAAAAAAA', p);
			var method = p.length ? 'replaceState' : 'pushState';
			p = p.length ? '/' + p.join( '+' ) : '';
			window.History[ method ]( null, null, url.join('/') + p );
		}.bind( this ) );
	};

	window.Question = Question;

} )();
