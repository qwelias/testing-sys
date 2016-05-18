window.Server = (function(){
    var _wrap = function(_done){
        return function(answer, code){
            if(_done){
                console.log("Server@answer:", answer);
                if(answer && (answer.hasOwnProperty("err") || answer.hasOwnProperty("result"))){
                    _done(answer.err || null, answer.result || null)
                }else if (answer){
                    _done(null, answer)
                }else{
                    _done("no_answer", null)
                }
            }
        }
    }

    var _f = function(method){
        return function(url, data, done){
            console.log("Server@"+method, url, data);
            var _req = {
                url: Server.www + url,
                type: method,
                data: data,
                dataType: "JSON",
                success: done && _wrap(done),
                error: done && function(xhr, text, e){
                    console.log(xhr.status, text, e)
                    done(xhr.status);
                }
            }

            return done ? $.ajax(_req) : $.pAjax(_req);
        }
    }

    $.ajaxSettings.cache = false;
    $.ajaxSettings.timeout = 5*1000;

    var Server = {
        get: _f("get"),
        put: _f("put"),
        del: _f("delete"),
        post: _f("post"),
        save: function(url, data, done){
            console.log("Server@save");
            var id = data._id || null;
            if(id){
                if(url[url.length-1] != '/') url += '/';
                url += id;
                return this.put.apply(this, arguments)
            }else{
                return this.post.apply(this, arguments)
            }
        },
        response: _wrap
    }
    return Server
})()
