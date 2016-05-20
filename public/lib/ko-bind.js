ko.bindingHandlers.alias = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var aliasPropertyName = valueAccessor();
        var extraContext = {};
        extraContext[aliasPropertyName] = bindingContext.$data;
        extraContext['raw' + aliasPropertyName] = bindingContext.$rawData;
        var innerBindingContext = bindingContext.extend(extraContext);
        ko.applyBindingsToDescendants(innerBindingContext, element);
        return { controlsDescendantBindings: true };
    }
};
ko.virtualElements.allowedBindings.alias = true;
