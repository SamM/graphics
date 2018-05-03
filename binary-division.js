function BinaryDivision(chain){
    this.chain = typeof chain == "string"?chain:"";
}
BinaryDivision.prototype.divide = function(number, chain){
    chain = chain || this.chain;
    if(chain.length == 0){
        return number;
    }
    var c = chain[0];
    if(typeof c == "string"){
        c = parseInt(c);
    }
    if(!c){
        // First Half
        if(chain.length == 1){
            return 0;
        }else{
            return this.divide(number/2, chain.slice(1));
        }
        
    }else{
        // Second Half
        if(chain.length == 1){
            return number;
        }else{
            return (number/2) + this.divide(number/2, chain.slice(1));
        }
        
    }
}
BinaryDivision.prototype.find = function(number, location){
    if(typeof number != "number") throw "Wrong type error";
    if(typeof location != "number") throw "Wrong type error";
    console.log(number, location)
    if(number == location) return "1";
    if(number - location < 1) return "0";
    if(location == 0) return "0";
    if(number<0){
        if(location < number || location > 0) throw "Outside of bounds error";
        if(location > number/2){
            return "0"+this.find(number/2, location);
        }else{
            return "1"+this.find(number/2, location-(number/2));
        }
    }else{
        if(location > number || location < 0) throw "Outside of bounds error";
        if(location < number/2){
            return "0"+this.find(number/2, location);
        }else{
            return "1"+this.find(number/2, location-(number/2));
        }
    }
    
}