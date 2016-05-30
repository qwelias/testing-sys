( function () {
	"use strict";

	window._vm.test = {
		table: ko.DataTable( {
			class: Test,
			columns: [ 'title' ],
			defaultSort: 'created',
			pageSize: 3,
			threshold: 300 * 1000,
			goto: function ( item ) {
				_vm.test.test( item )
			}
		} ),
		wo: ko.observable( null ),
		test: ko.observable( null ),
		user: ko.observable( {
			initial: {
				_id: '5745a34ba2d202b23fec278d'
			}
		} )
	};

	_vm.test.load = ko.computed( function () {
		var test = this.test();
		var user = this.user();
		if ( !test || !user ) return;
		return Server.get( '/api/test/' + test.initial._id, {
			pop: 'questions',
			attBy: user.initial._id
		} ).then( function ( data ) {
			data = data.result;
			data.questions = data.questions.map( function ( q ) {
				var att = q.att;
				delete q.att;
				q = Question( q );
				q.att = Attempt( att );
				return q;
			} );
			this.wo( Test( data ) );
			this.wo().moveTo( this.wo().qIndex() );
			return Promise.resolve();
		}.bind( this ) );
	}, _vm.test );

	window._vm.guards.push( [ window._vm.test.table.reload.bind( window._vm.test.table ) ] );

	function Test( data ) {
		if ( !( this instanceof Test ) ) return new Test( data );

		this.qIndex = ko.observable( 0 );

		SObject.call( this, data || Test.default, Test.modelname );

	};

	Object.defineProperty( Test, 'default', {
		enumerable: true,
		get: function () {
			return {
				title: '',
				questions: []
			};
		}
	} );

	Test.modelname = 'test';

	Test.prototype = Object.create( SObject.prototype, {} );
	Test.prototype.constructor = Test;

	Test.prototype.save = function save() {
		return;
	};

	Test.prototype.moveTo = function ( i ) {
		if ( i < 0 || i >= this.initial.questions.length ) i = 0;
		this.qIndex( i );
	};

	Test.prototype.moveNext = function () {
		return this.moveTo( this.qIndex() + 1 );
	};

	window.Test = Test;

} )();
