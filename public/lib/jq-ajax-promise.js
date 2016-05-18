(function($) {
    $.pAjax = function() {
        var args = Array.prototype.slice.call(arguments);
        var jqPromise = $.ajax.apply(this, args);
        var promise = new Promise(function(resolve, reject) {
            jqPromise.then(function(data, textStatus, jqXHR) {
                resolve(data);
            }, function(jqXHR, textStatus, errorThrown) {
                reject(jqXHR, textStatus, errorThrown);
            });
        });
        return promise;
    };
})(jQuery);
