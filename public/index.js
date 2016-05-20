( function () {

	if ( !Array.prototype.findIndex ) {
		Array.prototype.findIndex = function ( predicate ) {
			if ( this === null ) {
				throw new TypeError( 'Array.prototype.findIndex called on null or undefined' );
			}
			if ( typeof predicate !== 'function' ) {
				throw new TypeError( 'predicate must be a function' );
			}
			var list = Object( this );
			var length = list.length >>> 0;
			var thisArg = arguments[ 1 ];
			var value;

			for ( var i = 0; i < length; i++ ) {
				value = list[ i ];
				if ( predicate.call( thisArg, value, i, list ) ) {
					return i;
				}
			}
			return -1;
		};
	}

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
