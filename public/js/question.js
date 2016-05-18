( function () {
	this._vm.question = {
		table: ko.DataTable( {
			route: '/api/question',
			columns: [ 'body', 'type' ],
			defaultSort: 'created',
			name:'question'
		} ),
		wo: {
			_id: ko.observable(),
			body: ko.observable(),
			options: ko.observable(),
			type: ko.observable(),
			correct: ko.observable(),
		},
		save: function () {
			return window.Server.save( '/api/question', ko.toJS( this.wo ) ).then( function () {

			} ).catch( function ( e ) {
				console.log( e );
			} );
		}
	}
} )();
