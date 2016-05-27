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
			if ( id != 'new' ) {
				return Server.get( '/api/test/' + id, {
					pop: 'questions'
				} ).then( function ( data ) {
					data = data.result;
					if ( this.wo && data._id == this.wo.initial._id ) return;
					data.questions = data.questions.map( function ( q ) {
						return Draggable( Question( q ) );
					} );
					return Promise.resolve( this.wo = Test( data ) );
				}.bind( this ) );
			};
			if(!this.wo || this.wo.initial._id) return Promise.resolve( this.wo = Test() );
		}
	};

	window._vm.guards.push( [ window._vm.test.table.reload.bind( window._vm.test.table ) ] );
	window._vm.guards.push( [ window._vm.test.init.bind( window._vm.test ) ] );

	function Test( data ) {
		if ( !( this instanceof Test ) ) return new Test( data );

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
		this.data.questions = this.data.questions().map( function ( it ) {
			return it.initial._id;
		} );
		return SObject.prototype.save.call( this ).then( function () {
			var p = window.location.pathname.split( '/' );
			p = p.slice( 0, 2 );
			window.pager.navigate( p.join( '/' ) );
		} );
	};

	Test.prototype.rmQuestion = function rmQuestion( q ) {
		this.data.questions.remove( function ( e ) {
			return e.initial._id == q.initial._id;
		} );
	};

	window.Test = Test;

} )();
