( function () {
	"use strict";

	function DataTable( config ) {

		if ( !( this instanceof DataTable ) ) return new DataTable( config );

		this.items = ko.observableArray( config.items || [] );
		this.columns = config.columns;
		this.goto = config.goto;
		this.class = config.class;
		this.threshold = config.threshold || 0;
		this.lastReload = 0;
		this.actions = ko.observableArray( config.actions || [] );

		this.columns.push( 'action' );

		this.totalItems = ko.observable();
		this.pageIndex = ko.observable( 0 );
		this.pageSize = config.pageSize || 6;
		this.pageRadius = config.pageRadius || 3;

		this.sortField = ko.observable( config.defaultSort );
		this.sortOrder = ko.observable( true );

		this.search = ko.observable().extend( {
			rateLimit: {
				timeout: 400,
				method: "notifyWhenChangesStop"
			}
		} );

		this.search.subscribe( function () {
			this.moveToPage( 1 );
		}.bind( this ) );

		this.getData = ( config.getData && config.getData.bind( this ) ) || defaultDataGetter( config.model ).bind( this );

	};

	DataTable.prototype.isFirstPage = function isFirstPage() {
		return this.pageIndex() === 0
	};

	DataTable.prototype.isLastPage = function isLastPage() {
		return this.pageIndex() === Math.ceil( this.totalItems() / this.pageSize ) - 1
	};

	DataTable.prototype.pages = function pages() {
		var pages;
		var totalPages = Math.ceil( this.totalItems() / this.pageSize );
		var activePage = this.pageIndex() + 1;
		var radius = this.pageRadius;
		pages = new Array( totalPages ).fill( 0 ).map( function ( e, i ) {
			return ++i;
		} );
		var rPad = Math.min( totalPages, activePage + radius - ( activePage - radius - Math.max( activePage - radius, 1 ) ) );
		var lPad = Math.max( activePage - radius - ( activePage + radius - Math.min( totalPages, activePage + radius ) ), 1 );
		if ( lPad != 1 ) {
			pages.splice( 1, lPad - 0, "ellipsis" );
		}
		if ( rPad != totalPages ) {
			pages.splice( rPad - totalPages - 2, totalPages - rPad + 1, "ellipsis" );
		}
		return pages;
	};

	DataTable.prototype.setSort = function setSort( row ) {
		if ( row == this.sortField() ) {
			this.sortOrder( !this.sortOrder() );
		} else {
			this.sortField( row );
			this.sortOrder( true );
		}
		return this.reload( true );
	};

	DataTable.prototype.prevPage = function prevPage() {
		if ( this.pageIndex() > 0 ) {
			this.pageIndex( this.pageIndex() - 1 );
			return this.reload( true );
		}
	};

	DataTable.prototype.nextPage = function nextPage() {
		if ( this.pageIndex() + 1 < Math.ceil( this.totalItems() / this.pageSize ) ) {
			this.pageIndex( this.pageIndex() + 1 );
			return this.reload( true );
		}
	};

	DataTable.prototype.moveToPage = function moveToPage( index ) {
		this.pageIndex( Math.max( Number( index ) - 1, 0 ) );
		return this.reload( true );
	};

	DataTable.prototype.reload = function reload( force ) {
		var now = Date.now();
		if ( now - this.lastReload <= this.threshold && force !== true ) return Promise.resolve();
		if ( !this.getData ) return Promise.resolve();
		return this.getData().then( function ( data ) {
			this.items( data.result.items.map( function ( it ) {
				return this.class( it );
			}.bind( this ) ) );
			this.totalItems( data.result.totalItems );
			this.lastReload = now;
		}.bind( this ) ).catch( function ( e ) {
			console.log( e );
		} );
	};

	DataTable.prototype.itemRoute = function itemRoute( item, page ) {
		var append = null;
		var url = page ? page.path() : window.History.getState().url;
		if ( this.goto ) {
			if ( typeof this.goto == 'function' ) append = this.goto( item );
			else if ( typeof this.goto == 'string' ) append = this.goto + item.initial._id;
		}
		if ( append === null ) {
			return window.History.pushState( null, null, url + '/' + item.initial._id );
		}
		if ( append !== undefined ) {
			return window.History.pushState( null, null, url + append );
		}
	};

	function defaultDataGetter() {
		return function getData() {
			return window.Server.get( '/api/' + this.class.modelname, {
				size: this.pageSize,
				index: this.pageIndex(),
				sort: ( this.sortOrder() ? '+' : '-' ) + this.sortField(),
				search: this.search()
			} );
		};
	};

	ko.DataTable = DataTable;

} )();
