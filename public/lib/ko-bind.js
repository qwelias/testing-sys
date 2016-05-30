ko.bindingHandlers.alias = {
	init: function ( element, valueAccessor, allBindings, viewModel, bindingContext ) {
		var aliasPropertyName = valueAccessor();
		var extraContext = {};
		extraContext[ aliasPropertyName ] = bindingContext.$data;
		extraContext[ 'raw' + aliasPropertyName ] = bindingContext.$rawData;
		var innerBindingContext = bindingContext.extend( extraContext );
		ko.applyBindingsToDescendants( innerBindingContext, element );
		return {
			controlsDescendantBindings: true
		};
	}
};
ko.virtualElements.allowedBindings.alias = true;

ko.bindingHandlers[ 'let' ] = {
	init: function ( element, valueAccessor, allBindings, viewModel, bindingContext ) {
		var innerContext = bindingContext.extend( valueAccessor );
		ko.applyBindingsToDescendants( innerContext, element );

		return {
			controlsDescendantBindings: true
		};
	}
};
ko.virtualElements.allowedBindings[ 'let' ] = true;

ko.bindingHandlers[ 'editable' ] = {
	init: function ( element, valueAccessor ) {
		var val = valueAccessor();
		element.onkeyup = function () {
			val( element.innerText.trim() );
		};
	},
	update: function ( element, valueAccessor ) {
		var val = valueAccessor()();
		element.innerText = val;
	}
};
