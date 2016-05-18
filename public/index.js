( function () {
	"use strict";

	this.$.ajaxSetup( {
		error: function ( jqXHR ) {
			if ( jqXHR.status === 401 ) this.location.reload();
		}
	} );

	this.pager.useHTML5history = true;
	this.pager.Href5.history = this.History;
	this.pager.extendWithPage( site.vm );
	this.ko.applyBindings( site.vm );
	this.pager.startHistoryJs();

} )();
