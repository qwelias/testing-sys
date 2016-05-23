function Draggable( data ) {
	data.dragging = ko.observable( false );

	return data;
};

Draggable.dragStart = function ( item ) {
	item.dragging( true );
};
Draggable.dragEnd = function ( item ) {
	item.dragging( false );
};
Draggable.reorder = function ( event, dragData, zoneData ) {
	if ( dragData.initial._id !== zoneData.item.initial._id ) {
		var zoneDataIndex = zoneData.items().findIndex( function ( it ) {
			return it.initial._id == zoneData.item.initial._id;
		} );
		zoneData.items.remove(dragData);
        zoneData.items.splice(zoneDataIndex, 0, dragData);
	}
};
