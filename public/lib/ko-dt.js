( function () {
	"use strict";

	function DataTable( config ) {

		if ( !( this instanceof DataTable ) ) return new DataTable( config );

		this.items = ko.observableArray( config.items || [] );
		this.columns = config.columns;
		this.name = config.name;

		this.totalItems = ko.observable();
		this.pageIndex = ko.observable( 0 );
		this.pageSize = config.pageSize || 12;
		this.pageRadius = config.pageRadius || 2;

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

		this.getData = ( config.getData && config.getData.bind( this ) ) || ( config.route && defaultDataGetter( config.route ).bind( this ) );

		this.pageLoader = config.pageLoader;

	};

	DataTable.prototype.isFirstPage = function () {
		return this.pageIndex() === 0
	};

	DataTable.prototype.isLastPage = function () {
		return this.pageIndex() === Math.ceil( this.totalItems() / this.pageSize ) - 1
	};

	DataTable.prototype.pages = function () {
		var pages = [];
		var page, elem, last;
		var totalPages = Math.ceil( this.totalItems() / this.pageSize );
		var activePage = this.pageIndex() + 1;
		var radius = this.pageRadius;
		for ( page = 1; page <= totalPages; page++ ) {
			if ( page == 1 || page == totalPages ) {
				elem = page;
			} else if ( activePage < 2 * radius + 1 ) {
				elem = ( page <= 2 * radius + 1 ) ? page : "ellipsis";
			} else if ( activePage > totalPages - 2 * radius ) {
				elem = ( totalPages - 2 * radius <= page ) ? page : "ellipsis";
			} else {
				elem = ( Math.abs( activePage - page ) <= radius ? page : "ellipsis" );
			}
			if ( elem != "ellipsis" || last != "ellipsis" ) {
				pages.push( elem );
			}
			last = elem;
		}
		return pages;
	};

	DataTable.prototype.setSort = function ( row ) {
		if ( row == this.sortField() ) {
			this.sortOrder( !this.sortOrder() );
		} else {
			this.sortField( row );
			this.sortOrder( true );
		}
		return this.reload();
	};

	DataTable.prototype.prevPage = function () {
		if ( this.pageIndex() > 0 ) {
			this.pageIndex( this.pageIndex() - 1 );
			return this.reload();
		}
	};

	DataTable.prototype.nextPage = function () {
		if ( this.pageIndex() + 1 < Math.ceil( this.totalItems() / this.pageSize ) ) {
			this.pageIndex( this.pageIndex() + 1 );
			return this.reload();
		}
	};

	DataTable.prototype.moveToPage = function ( index ) {
		this.pageIndex( Math.max( Number( index ) - 1, 0 ) );
		return this.reload();
	};

	DataTable.prototype.reload = function () {
		if ( !this.getData ) return Promise.resolve();
		this.pageLoader && this.pageLoader.load();
		return this.getData().then( function ( data ) {
			console.log( data )
			this.items( data.result.items );
			this.totalItems( data.result.totalItems );
			this.pageLoader && this.pageLoader.unload();
		}.bind( this ) ).catch( function ( e ) {
			console.log( e );
		} );
	};

	function defaultDataGetter( route ) {
		return function getData() {
			return window.Server.get( route, {
				size: this.pageSize,
				index: this.pageIndex(),
				sort: ( this.sortOrder() ? '+' : '-' ) + this.sortField(),
				search: this.search()
			} );
		};
	};

	ko.DataTable = DataTable;

} )();
