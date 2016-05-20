( function () {
	"use strict";

	function DataTable( config ) {

		if ( !( this instanceof DataTable ) ) return new DataTable( config );

		this.items = ko.observableArray( config.items || [] );
		this.columns = config.columns;
		this.class = config.class;
		this.actions = ko.observableArray(config.actions || []);

		this.columns.push('action');

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

		this.pageLoader = config.pageLoader;

	};

	DataTable.prototype.isFirstPage = function () {
		return this.pageIndex() === 0
	};

	DataTable.prototype.isLastPage = function () {
		return this.pageIndex() === Math.ceil( this.totalItems() / this.pageSize ) - 1
	};

	DataTable.prototype.pages = function () {
		var pages;
		var totalPages = Math.ceil( this.totalItems() / this.pageSize );
		var activePage = this.pageIndex() + 1;
		var radius = this.pageRadius;
		pages = new Array( totalPages ).fill( 0 ).map( function ( e, i ) {
			return ++i;
		} );
		var rPad = Math.min( totalPages, activePage + radius - ( activePage - radius - Math.max( activePage - radius, 1 ) ) );
		var lPad = Math.max( activePage - radius - ( activePage + radius - Math.min( totalPages, activePage + radius ) ), 1 );
		if(lPad != 1){
			pages.splice(1, lPad-0, "ellipsis");
		}
		if(rPad != totalPages){
			pages.splice(rPad-totalPages-2, totalPages-rPad+1, "ellipsis");
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
			this.items( data.result.items.map(function(it){
				return this.class(it);
			}.bind(this)) );
			this.totalItems( data.result.totalItems );
			this.pageLoader && this.pageLoader.unload();
		}.bind( this ) ).catch( function ( e ) {
			console.log( e );
		} );
	};

	function defaultDataGetter() {
		return function getData() {
			return window.Server.get( '/api/'+this.class.modelname, {
				size: this.pageSize,
				index: this.pageIndex(),
				sort: ( this.sortOrder() ? '+' : '-' ) + this.sortField(),
				search: this.search()
			} );
		};
	};

	ko.DataTable = DataTable;

} )();
