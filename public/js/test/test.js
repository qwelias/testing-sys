( function () {
	"use strict";

	window._vm.test = {
		table: ko.DataTable( {
			class: Test,
			columns: [ 'title' ],
			defaultSort: 'created',
			pageSize: 3,
			threshold: 30 * 1000
		} ),
		wo: null,
		init: function init( id ) {
			return Server.get( '/api/test/' + id, {
				pop: 'questions'
			} ).then( function ( data ) {
				data = data.result;
				if ( this.wo && data._id == this.wo.initial._id ) return;
				data.questions = data.questions.map( function ( q ) {
					return Question( q );
				} );
				this.wo = Test( data );
				this.wo.moveTo( this.wo.qIndex() );
				return Promise.resolve();
			}.bind( this ) );
		}
	};

	window._vm.guards.push( [ window._vm.test.table.reload.bind( window._vm.test.table ) ] ); //test
	window._vm.guards.push( [ window._vm.test.init.bind( window._vm.test ) ] ); //test/:id

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

	Test.prototype.finish = function () {
		var atts = this.data.questions().map( function ( q ) {
			return q.att.save();
		} );
		Promise.all( atts ).then( function () {
			console.log('saved!')
		} );
	};

	window.Test = Test;

} )();
