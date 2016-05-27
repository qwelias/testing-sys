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

	window.$.ajaxSetup( {
		error: function ( jqXHR ) {
			if ( jqXHR.status === 401 ) window.location.reload();
		}
	} );

	window.GUARD = function ( pg, rt, cb ) {
		var all = [];
		rt.map( function ( id, i ) {
			if ( !id ) return;
			all.push( Promise.all( ( window._vm.guards[ i ] || [] ).map( function ( g ) {
				return g( id );
			} ) ) );
		} );
		Promise.all( all ).then( cb );
	};

	Promise.all( window._vm.init ).then( function () {
		console.log( "INITED" );
	} ).catch( function ( e ) {
		console.log( "INIT ERR:", e );
	} );

	window.pager.useHTML5history = true;
	window.pager.Href5.history = window.History;
	window.pager.extendWithPage( window._vm );
	window.ko.applyBindings( window._vm );
	window.pager.startHistoryJs();

} )();
