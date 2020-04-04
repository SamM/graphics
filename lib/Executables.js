var require;
if(typeof require == 'function' && typeof isElement != "function"){
    require('elements.js');
}
if(typeof require == 'function' && typeof Variable != "function"){
    require('Variable2.js');
}
window.addEventListener('load', function(){
});
function makeExecutable(element){
    if(!isElement(element)){
        element = document.createElement('exec');
    }
    function makeMessage(title, message, id, color){
        title = title || "Message";
        message = message || "";
        id = id || undefined;
        color = color || "black";
        var fade = createElement('div', {
            id: id,
            style: {
                width: "100%",
                height: "100%",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: "1",
                position: "absolute",
                textAlign: "center",
                overflow: "auto"
            }
        });
        document.body.insertBefore(fade, document.body.firstChild);
        var box = createElement('div', {
            style: {
                "backgroundColor": "white",
                display: "inline-block",
                border: "5px solid "+color,
                margin: "8% auto",
                height: "auto",
                padding: "20px",
                textAlign: "left",
                lineHeight: "2",
                fontFamily: "'Courier New', Courier, monospace",
                whiteSpace: "pre"
            }
        }, fade);
        function stopClickThru(event){
            event.stopPropagation();
        }
        function closeMessage(event){
            document.body.removeChild(fade);
            document.body.style.backgroundColor = "transparent";
        }
        document.body.style.backgroundColor = color;
        createElement("h3", {innerHTML: title, style:{
            backgroundColor: color,
            display: "block",
            margin: "-20px -20px 20px -20px",
            padding: "5px",
            color: "white",
            letterSpacing: "1px",
            textAlign: "left",
            fontFamily: "sans-serif"
        } }, box);
        createElement("p", {innerHTML: message}, box)
        var closeButton = createElement("button", {innerHTML: "Close", style:{textAlign: "center"}}, createElement("div", {style:{textAlign: "center"}}, box));
        fade.addEventListener("click", closeMessage);
        closeButton.addEventListener("click", closeMessage);
        box.addEventListener("click", stopClickThru);
        return fade;
    }
    function makeErrorMessage(errorType, errorMessage){
        makeMessage(errorType, errorMessage, "errorMessage", "hsl(0, 85%, 45%)");
        
    }
    function runCode(makeMessages){
        try{
            var script = element.innerHTML;
            if(script.indexOf(';')<0) script = "return "+script;
            script = script.split('&amp;').join('&').split('&lt;').join('<').split('&gt;').join('>')
            var fn = new Function(script);
            var return_value = fn.call(window);
            if(typeof return_value != "undefined"){
                if(makeMessages!==false) makeMessage("Result", _(return_value).toString(2)+"", "resultMessage", "hsl(100, 80%, 45%)");
            }
        }catch(err){
            let errorType = err.name+(typeof err.lineNumber=="number"?"@ "+err.lineNumber+":"+err.columnNumber:"");
            console.log("New Error:", errorType);
            console.log(err);
            if(makeMessages!==false) makeErrorMessage(errorType, err.message);
        }
    }
    element.addEventListener("click", runCode);
    element.style.cursor = "pointer";

    runCode(false)
    return element;
}