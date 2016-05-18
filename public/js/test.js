( function () {
	this._vm.test = {
		table: ko.DataTable( {
			route: '/api/test',
			columns: [ 'title' ],
			defaultSort: 'created',
			name: 'test',
			pageSize: 3
		} ),
		wo: {
			_id: ko.observable(),
			title: ko.observable(),
			questions: ko.observableArray()
		},
		save: function () {
			return window.Server.save( '/api/test', ko.toJS( this.wo ) ).then( function () {

			} ).catch( function ( e ) {
				console.log( e );
			} );
		}
	}
} )();
