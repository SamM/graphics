var Variable, _, __, ___, ____;

Variable = function(one){
    if(this instanceof Variable){
        var self = this;
        if(arguments.length>1){
            one = [].slice.call(arguments);
        }
        var getterSetter = function(two){
            var three, output, get_one;
            var write = arguments.length==0?false:arguments[arguments.length-1]===true;
            /*/
            /// function setAttr (attr)
             -  When `one` and `two` are Objects, Arrays or Strings this is used to change 
                an attribute of `one` to the that attribute of `two`
            /*/
            function setAttr(attr, value){
                /*/
                /// If no value set, use `two[attr]` instead
                /*/
                value = typeof value == "undefined" ? two[attr] : value;

                get_one = getSet();
                /*/
                /// When `two[attr]` is a reference to the Variable class
                /*/
                if(value === Variable){
                    /*/
                    /// If one is an Array or String then remove item at index `attr`
                    /*/
                    if(Array.isArray(one) || typeof one == "string"){
                        one.splice(attr, 1);
                    /*/
                    /// Otherwise if one is an object then delete the value store with key `attr`;
                    /*/
                    }else if(typeof one == "object" && one !== null){
                        delete one[attr];
                    }
                    /// Set this variables value in parent variable to this variable's value
                    getSet(one);
                
                /*/
                /// Otherwise if two[attr] is anything else except undefined
                /*/
                }else if(typeof two[attr] != "undefined"){
                    /// Give a new value to one[attr]
                    one[attr] = Variable(one[attr])(value)();
                    /// Set this variables value in parent variable to this variable's value
                    getSet(one);
                }
            }
            /*/
            /// When there is more than one argument
             -  Set `two` to an array of all arguments
            /*/
            if(arguments.length > 1){
                two = [].slice.call(arguments);
                /*/
                /// When the last argument is `true` then set write flag to true also
                /*/
                if(arguments[arguments.length-1] === true){
                    write = true;
                    two = two.slice(0,-1)
                }
            }

            /*/
            /// If there are no arguments
             -  This function is being used as a getter
             -  Return stored variable `one`
            /*/
            if(arguments.length == 0){
                return one;
            }

            output = [];
            get_one = getSet();

/*/
/// Begin processing of arguments 
/// ============================= ///
///
/*/
            
/*/
/// When `one` and `two` are of the same type
/*/
            if(typeof one == typeof two){
/*/
/// When they are both Arrays
/*/
                if(Array.isArray(one) && Array.isArray(two)){
                    /*/
                    /// Loop through items in the `two` array
                    /*/
                    for(var i = 0, c=0; i < two.length ; i++){
            /*/
            /// When this item of `two` is also an Array
            /*/
                        if(Array.isArray(two[i])){
                            /*/
                            /// Loop through the array `two[i]`
                            /*/
                            for(var j = 0; j< two[i].length; j++){
                                setAttr(c, two[i][j]);
                                /*/
                                if(typeof two[i][j] != "undefined" && two[i][j] !== Variable){
                                    output[c] = Variable(one)(two[i][j])();
                                }else if(two[i][j] === Variable){
                                    if(Array.isArray(one)){
                                        one.splice(c, 1);
                                    }else{
                                        delete one[i];
                                    }
                                }else if(typeof two[i][j] == "undefined"){
                                    output[c] = one[c];
                                }
                                /*/
                                c++;
                            }
            /*/
            /// When this item of `two` is not an Array
            /*/
                        }else{
                            if(typeof two[i] != "undefined" && two[i] !== Variable){
                                if(typeof two[i] == "string"){
                                    output[c] = Variable(one[c])(two[i])();
                                }else{
                                    output[c] = Variable(one)(two[i])();
                                }
                            }else if(two[i] === Variable){
                                if(Array.isArray(one)){
                                    one.splice(c, 1);
                                }else{
                                    delete one[c];
                                }
                            }else if(typeof two[i] == "undefined"){
                                output[c] = one[c];
                            }
                            c++;
                        }
                    }
                    for(var i in output){
                        one[i] = output[i];
                    }
                    getSet(one);

/*/
/// When `one` is an Object
/*/
                }else if(typeof one == 'object'){
                    if(two == null){
                        one = null;
                        getSet(one);
                    }else if(one == null){
                        one = two;
                        getSet(one);
                    }else if(Array.isArray(two)){
                        if(typeof one == "string"){
                            for(var i = 0; i < two.length; i++){
                                var three = Variable(one)(two[i])();
                                output.push(three);
                            }
                            return Variable(output);
                        }else if(Array.isArray(one)){
                            for(var i=0; i<two.length; i++){
                                if(typeof two[i] != "undefined"){
                                    output.push(one[i]);
                                }
                            }
                            return Variable(output.length==1?output[0]:output);
                        }
                        for(var i=0; i<two.length; i++){
                            compare = Array.isArray(two[i])?two[i]:[two[i]];
                            for(var j = 0; j<compare.length; j++){
                                if(typeof compare[j] == "number" || typeof compare[j] == "string" && typeof one[compare[j]] != "undefined"){
                                    output.push(one[compare[j]])
                                }else{
                                    found = false;
                                    for(var k=output.length-1; k>=0; k--){
                                        if(typeof output[k] != "undefined" && typeof compare[j] == "number" || typeof compare[j] == "string" && typeof output[k][compare[j]] != "undefined"){
                                            output[k] = output[k][compare[j]];
                                            found = true;
                                            break;
                                        }
                                    }
                                    if(!found) output.push(undefined);
                                }
                            }
                        }
                        return Variable(output.length == 1?output[0]:output);
                    }else{
                        for(var key in two){
                            if(two[key] === Variable){
                                delete one[key];
                            }else{
                                setAttr(key);
                            }
                        }
                    }
                }else{
                    one = two;
                    getSet(one);
                }
/*/
/// `one` is an Array
/*/
            }else if(Array.isArray(one)){
        /*/
        /// `two` is an Number
        /*/
                if(typeof two == 'number'){
                    if(two === 0){
                        output = (get_one[0]);
                    }else if(two > 0){
                        if(two < get_one.length){
                            output = (get_one[two]);
                        }else{
                            two = two%get_one.length;
                            if(two == 0){
                                output = (get_one[0]);
                            }else{
                                output = (get_one[two]);
                            }
                        }
                    }else{
                        if(-one.length < two ){
                            output = (get_one[get_one.length+two]);
                        }else{
                            two = -two;
                            two = two%get_one.length;
                            if(two == 0){
                                output = (get_one[0]);
                            }else{
                                output = (get_one[get_one.length-two]);
                            }
                        }
                    }
                    var variable = Variable(output);
                    variable.getterSetter = function(three){
                        if(typeof three == "undefined"){
                            return get_one;
                        }else{
                            if(!Array.isArray(three)){
                                three = [three];
                            }
                            if(two === 0){
                                console.log('one array two == 0');
                                one = three.concat(get_one.slice(1));
                            }else if(two > 0){
                                console.log('one array two > 0');
                                one = get_one.slice(0, two).concat(three).concat(get_one.slice(two+1));
                                console.log("result:", get_one)
                            }else{
                                console.log('one array two < 0');
                                one = get_one.slice(0, get_one.length+two).concat(three).concat(get_one.slice(get_one.length+two-1));
                            }
                            getSet(one);
                            return one;
                        }
                    };
                    if(write){
                        console.log("one array two number write")
                        one = output;
                        getSet(one);
                        return getterSetter;
                    }
                    console.log("one array two number read", variable())
                    return variable;
                }else{
                    one[0] = two;
                    getSet(one);
                }
            }else if(typeof one == "object"){
/*/
/// `one` is null
/*/
                if(one === null){
                    one = two;
                    getSet(one);
                }else{
/*/
/// `one` is a non-null Object
/*/
                    if(typeof two == 'number' || typeof two == "string" && typeof one[two] != "undefined"){
                        return Variable(one[two]);
                    }else{
                        one = two;
                        getSet(one);
                    }
                }
/*/
/// `one` is a String
/*/
            }else if(typeof one == "string"){
                
        /*/
        /// `two` is a Number
        /*/
                if(typeof two == "number"){
                    if(two === 0){
                        output = (get_one[0]);
                    }else if(two > 0){
                        if(two < get_one.length){
                            output = (get_one[two]);
                        }else{
                            two = two%get_one.length;
                            if(two == 0){
                                output = (get_one[0]);
                            }else{
                                output = (get_one[two]);
                            }
                        }
                    }else{
                        if(-get_one.length < two ){
                            output = (get_one[get_one.length+two]);
                        }else{
                            two = -two;
                            two = two%get_one.length;
                            two = -two;
                            if(two == 0){
                                output = (get_one[0]);
                            }else{
                                output = (get_one[get_one.length+two]);
                            }
                        }
                    }
                    var variable = Variable(output);
                    variable.getterSetter = function(three){
                        var get_one = getSet();
                        if(typeof three == "undefined"){
                            return one;
                        }else{
                            if(two === 0){
                                console.log("one string two == 0", three);
                                one = [three].concat(one.slice(1));
                                console.log("result:", one)
                            }else if(two > 0){
                                console.log("one string two > 0", three);
                                one = [get_one.slice(0, two)].concat(three).concat(get_one.slice(two+1));
                                console.log("result:", one)
                            }else{
                                console.log("one string two < 0"), three;
                                one = [get_one.slice(0, get_one.length+two)].concat(three).concat(get_one.slice(get_one.length+two+1));
                                console.log("result:", one)
                            }
                            if(Array.isArray(one)) one = one.join('');
                            getSet(one);
                            return one;
                        }
                    };
                    return variable;
        /*/
        /// `two` is an Array
        /*/
                }else if(Array.isArray(two)){
                    console.log("one string two array")
                    if(two.length == 1){
                        return Variable(get_one)(two[0]);
                    }else if(two.length >= 2){
                        console.log("one string two array length >= 2");
                        var text;
                        for(var i=0; i<two.length; i++){
                            if(typeof two[i] == "string"){
                                text = two[i];
                            }else{
                                text = Variable(get_one)(two[i])();
                            }
                            if(text) output.push(text);
                        }
                        one = output.length==1?output[0]:output;
                        getSet(one);
                        return getterSetter;
                    }
                    return getterSetter;
        /*/
        /// `two` is an Object
        /*/
                }else if(typeof two == "object"){
                    output = {};
                    for(var key in two){
                        output[key] = Variable(one)(two[key])();
                    }
                    return Variable(output);
                }
                return Variable(output);
            }
/*/
/// `one` is a number
/*/
            else if(typeof one == "number"){
                one = two;
                getSet(one);
            }
/*/
/// `one` is not a number, string, object, Array
 -  Could be a function, boolean, or undefined
/*/
            else{
                one = two;
                getSet(one);
            }
            /*/
            /// Return this function forming a chain loop of returned functions
            /*/
            return getterSetter;
        };
        getterSetter.toString = Variable.prototype.toString;
        getterSetter.join = function(sep){
            sep = sep || '';
            function join(variable){
                var output = [];
                if(Array.isArray(variable)){
                    for(var i=0; i<variable.length; i++){
                        var two = variable[i];
                        if(Array.isArray(two)){
                            output.push(join(two));
                        }else{
                            output.push(Variable(two).toString());
                        }
                    }
                }
                return output.join(sep);
            }
            
            return Variable(join(one));
        }
        getterSetter.valueOf = function(){
            return one;
        }

        function getSet(value){
            if(typeof getterSetter.getterSetter == "function"){
                return getterSetter.getterSetter(value);
            }
            return one;
        }
        getterSetter._ = function(two){
            if(arguments.length == 0) return one;
            one = two;
            getSet(one);
        };
        
        this._ = getterSetter;
        //this.__defineGetter__('_', getterSetter);
        
        //getterSetter.__defineGetter__('_', getterSetter);

        //this.__defineSetter__('_', getterSetter);
        //getterSetter.__defineSetter__('_', getterSetter);

        // function(){return getterSetter.apply(getterSetter, arguments);}
    }else if(arguments.length == 0){
        return (new Variable())._;
    }else if(arguments.length == 1){
        return (new Variable(one))._
    }else if(arguments.length > 1){
        return (new Variable([].slice.call(arguments)))._;
    }
};

Variable.prototype.valueOf = function(){
    return this._();
};
Variable.prototype.toString = function(padding_min, padding_max){
    padding_max = typeof padding_max == "number" ? padding_max : 0;
    padding_min = typeof padding_min == "number" ? padding_min : padding_max;
    var _ = "";
    if(padding_max == padding_min){
        for(var i = 0; i<padding_min; i++){
            _ += " ";
        }
    }else{
        for(var i = 0; i<padding_min-padding_max; i++){
            _ += " ";
        }
    }
    var value = this instanceof Variable || typeof this._ == 'function' ? this._() : this;
    //padding_max=padding_max==padding_min?padding_max:padding_max-1;
    padding_min=padding_max==padding_min?padding_min:padding_min-1;
    if(Array.isArray(value)){
        return ["[", value.map(function(item){
            return Variable(item).toString(padding_min, padding_max)
        }).join(_+","+_), "]"].join(_);
    }else if(typeof value == "function"){
        if(typeof value._ == 'function') return value._()+"";
        return value.toString().split(/[\ ]+/).join(' ') || Function.prototype.toString.call(value).split(/[\ ]+/).join(' ');
    }else if(typeof value == "undefined"){
        return "undefined";
    }else if(value === null){
        return "null";
    }else if(typeof value == "object"){
        if(value+"" !== "[object Object]") return value+"";
        return ["{",Object.keys(value).map(key=>'"'+key+'"'+_+':'+_+Variable(value[key]).toString(padding_min, padding_max)).join(_+","+_),"}"].join(_);
    }else if(typeof value == "string"){
        return value;
    }else if(typeof value == "number"){
        return value.toString();
    }else if(typeof value == "boolean"){
        return value?"true":"false";
    }else{
        console.log("Another type: ", typeof value);
    }
}

if(typeof _ == "undefined"){
    _ = Variable;
}
if(typeof __ == "undefined"){
    __ = Variable;
}
if(typeof ___ == "undefined"){
    ___ = Variable;
}
if(typeof ____ == "undefined"){
    ____ = Variable;
}