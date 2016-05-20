( function () {

	this._vm.test = {
		table: ko.DataTable( {
			class: Test,
			columns: [ 'title' ],
			defaultSort: 'created',
			pageSize: 3
		} ),
		wo: null,
		init: function(){
			this.wo = Test();
		}
	}

} )();

function Test(data){
	if ( !( this instanceof Test ) ) return new Test( data );

	SObject.call(this, data || Test.default, Test.modelname);

};

Test.default = {
	title: '',
	questions: []
};

Test.modelname = 'test';

Test.prototype = Object.create(SObject.prototype, {});
Test.prototype.constructor = Test;
