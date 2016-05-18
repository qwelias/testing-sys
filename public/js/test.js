(function(){
    this.site.test = {
        table: ko.DataTable({
            route: '/api/test',
            columns: ['title'],
            defaultSort: 'createdAt'
        });
    }
})();
