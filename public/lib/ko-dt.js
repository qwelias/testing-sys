( function () {
	"use strict";

	ko.DataTable = function DataTable( config ) {

		if ( !( this instanceof DataTable ) ) return new DataTable();

		var self = this;

		this.items = ko.observableArray( config.items );
		this.columns = config.columns;

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
			self.moveToPage( 1 );
		} );

		this.getData = ( config.getData && config.getData.bind( this ) ) || ( config.route && defaultDataGetter( config.route ).bind( this ) );

		this.pageLoader = config.pageLoader;

	};

	ko.DataTable.prototype.isFirstPage = function () {
		return this.pageIndex() === 0
	};

	ko.DataTable.prototype.isLastPage = function () {
		return this.pageIndex() === this.totalPages() - 1
	};

	ko.DataTable.prototype.pages = function () {
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

	ko.DataTable.prototype.setSort = function ( row ) {
		if ( row == this.sortField() ) {
			this.sortOrder( !this.sortOrder() );
		} else {
			this.sortField( row );
			this.sortOrder( true );
		}
		this.reload();
	};

	ko.DataTable.prototype.prevPage = function () {
		if ( this.pageIndex() > 0 ) {
			this.pageIndex( this.pageIndex() - 1 );
			this.reload();
		}
	};

	ko.DataTable.prototype.nextPage = function () {
		if ( this.pageIndex() + 1 < Math.ceil( this.totalItems() / this.pageSize ) ) {
			this.pageIndex( this.pageIndex() + 1 );
			this.reload();
		}
	};

	ko.DataTable.prototype.moveToPage = function ( index ) {
		this.pageIndex( Math.max( index - 1, 0 ) );
		this.reload();
	};

	ko.DataTable.prototype.reload = function ( cb ) {
		if ( !this.getData ) cb && cb();
		this.pageLoader && this.pageLoader.load();
		this.getData( function ( err ) {
			this.pageLoader && this.pageLoader.unload();
			cb && cb( err );
		} );
	};

	function defaultDataGetter( route ) {
		return function getData( cb ) {
			window.Server.get( route, {
				size: this.pageSize(),
				index: this.pageIndex(),
				sort: this.sortField(),
				order: this.sortOrder(),
				search: this.search()
			} ).then( function ( data ) {
				this.items( data.items );
				this.totalItems( data.totalItems );
				cb && cb();
			} ).catch( function ( e ) {
				console.log(e);
				cb && cb( err );
			} );
		};
	};

} )();
