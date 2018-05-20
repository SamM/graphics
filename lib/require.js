var require, document;
if(typeof require != "function"){
    if(typeof document == "object"){
        require = (function(){
            var source;
            var scripts = [].slice.call(document.getElementsByTagName("script"));
            for(var s=0; s<scripts.length; s++){
                if(/(^.*\/|^)?require\.js$/.test(scripts[s].src)){
                    source = scripts[s].src;
                    break;
                }
            }
            
            var require = function(){
                var files, onLoad, onError;
                
                var args = [].slice.call(arguments);
                if(typeof args[args.length-1] == "function"){
                    onLoad = args.pop();
                }
                if(typeof args[args.length-1] == "function"){
                    onError = onLoad;
                    onLoad = args.pop();
                }
                files = [];
                for(var i = 0; i<args.length; i++){
                    if(Array.isArray(args[i])){
                        files = files.concat(args[i]);
                    }else if(typeof args[i] != "undefined"){
                        files.push(args[i]);
                    }
                }


                onLoad = typeof onLoad == 'function'? onLoad: function(){};
                onError = typeof onError == 'function'? onError: function(){};

                function loadScript(load){
                    if(load>= files.length) return;
                    file = files[load];

                    var path = require.pathTo(source, file);
                    var script = require.find(path);
                    if(script===true){
                        load++;
                        if(load == files.length){
                            onLoad();
                            if(require.loading.length == require.loaded.length){
                                require.done();
                            }
                        }else{
                            loadScript(load);
                        }
                        return;
                    }else if(script){
                        var onLoaded = typeof script.onLoaded == "function" ? script.onLoaded : function(){};
                        script.onLoaded =  function(){
                            load++;
                            loadScript(load);
                            onLoaded.call(this);
                        };
                        script.addEventListener('error', function(){
                            onError.call(script, script);
                        });
                        return;
                    }

                    script = document.createElement('script');
                    script.src = path;
                    
                    script.onLoaded = function(){
                        if(typeof require.onLoad == 'function'){
                            require.onLoad.call(script, script);
                        }
                        require.loaded.push(script);
                        load++;
                        if(load == files.length){
                            onLoad();
                            if(require.loading.length == require.loaded.length){
                                require.done();
                            }
                            return;
                        }else{
                            loadScript(load);
                        }
                    };

                    script.addEventListener('load', function(){
                        script.onLoaded.apply(this, arguments);
                    });

                    script.addEventListener('error', function(){
                        require.loading.splice(require.loading.indexOf(script),1);
                        onError.call(script, script);
                        if(typeof require.onError == 'function'){
                            require.onError(script);
                        }
                        script.onLoaded();
                    });

                    require.isDone = false;
                    require.scripts.push(script);
                    require.loading.push(script);
                    document.getElementsByTagName('head')[0].appendChild(script);
                }

                loadScript(0);
    
            };
            require.isDone = true;
            require.scripts = [];
            require.loading = [];
            require.loaded = [];
            require.find = function(path){
                var search = require.loading;
                for(var i=0; i<search.length; i++){
                    if(search[i].src == path) return search[i];
                }
                search = require.loaded;
                for(i=0; i<search.length; i++){
                    if(search[i].src == path) return true;
                }
                return false;
            };
            require.done = function(){
                if(!require.isDone){
                    require.isDone = true;
                    if(typeof require.onDone == 'function'){
                        require.onDone(require.loaded);
                    }
                    require.loading = [];
                    require.loaded = [];
                }
            };
            require.onDone = function(){};
            require.onError = function(){};
            require.onLoad = function(){};
            require.pathTo = function(from, to){
                var a = from.indexOf('/');
                var b = to.indexOf('/');
                while(a == 1 && from[0] == "."){
                    from = from.slice(2);
                    a = from.indexOf('/');
                }
                while(b == 1 && to[0] == "."){
                    to = to.slice(2);
                    b = to.indexOf('/');
                }
                var down_one = from.slice(0, from.lastIndexOf('/'));
                down_one = down_one.slice(0, down_one.lastIndexOf('/'));
                if(b==0){
                    return to;
                }else if(a==0){
                    return '/'+require.pathTo(from.slice(1), to);
                }else if(a<0&&b<0){
                    return to;
                }if(a < 0){
                    return to;
                }else if(b < 0){
                    return from.slice(0,from.lastIndexOf('/'))+"/"+to;
                }else if(from.slice(0,a) == ".."){
                    return "../"+require.pathTo(from.slice(a+1),to)
                }else if(to.slice(0,b) == ".." ){
                    return down_one+to.slice(b);
                }else if( from.slice(0,a) == to.slice(0,b)){
                    return require.pathTo(from.slice(a+1),to.slice(b+1))
                }else{
                    return from.slice(0,from.lastIndexOf('/'))+"/"+to;
                }
            };
            return require;
        })();
    }
}