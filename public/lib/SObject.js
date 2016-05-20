function SObject( data, model ) {
	if ( !( this instanceof SObject ) ) return new SObject( data, model );

	this.initial = JSON.parse( JSON.stringify( data ) );

    this.model = model;

	this.data = ko.mapping.fromJS(data);

};

SObject.prototype.toJS = function toJS(){
    return ko.mapping.toJS(this.data);
};

SObject.prototype.save = function save(){
    return Server.save('/api/'+this.model, this.toJS());
};
