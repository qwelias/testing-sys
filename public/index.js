( function () {

	this.$.ajaxSetup( {
		error: function ( jqXHR ) {
			if ( jqXHR.status === 401 ) this.location.reload();
		}
	} );

	Promise.all( this._vm.init ).then( function () {
		console.log( "INITED" );
	} ).catch( function ( e ) {
		console.log( "INIT ERR:", e );
	} );

	this.pager.useHTML5history = true;
	this.pager.Href5.history = this.History;
	this.pager.extendWithPage( this._vm );
	this.ko.applyBindings( this._vm );
	this.pager.startHistoryJs();

} )();
