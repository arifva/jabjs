//generic lib
function toArray(itemOrArray) {
    var arrayified = ((itemOrArray).constructor === Array) ? itemOrArray : [itemOrArray];
    return arrayified;
}

function addListenerMulti(element, eventsString, func) { 
    var events = eventsString.split(' ');
    events.forEach(function(event) { element.addEventListener(event, func, false);  });    
}

//return the property to access DOM element's value - 'value', 'innerHTML', 'selectedIndex', etc. 
function getDomValueProp(elem) { 
    if (elem.type == 'checkbox') return 'checked'; 
    if (elem.nodeName == 'INPUT') return 'value'; 
    if (elem.nodeName == 'TEXTAREA') return 'value'; 
    if (elem.nodeName == 'SELECT') return 'selectedIndex'; 

    return 'innerHTML'; //default
}

function getDomValue(elem) {
    var propName = getDomValueProp(elem);
    return elem[propName];
}

function setDomValue(elem, newValue) {
    var propName = getDomValueProp(elem);
    elem[propName] = newValue;
}

function setDomElemsVal(domElems, newValue) {
    domElems.forEach(function(domElem) { 
        setDomValue(domElem, newValue) 
    });
}

function syncDomElemsOnChange(obj, property, domElems) {        
    var events = 'change keyup';
    domElems.forEach(function(elem) { 
        addListenerMulti(elem, events, function(e) {
            obj[property] = getDomValue(e.srcElement);             
        }); 
    });        
}

function markBindings(obj, property, domElems) {
    obj.bindings = obj.bindings || {};
    obj.bindings[property] = domElems;         
}

function bindModelToElem(obj, property, domElems) {
    var domElems = toArray(domElems);

    Object.defineProperty(obj, property, {
        get: function() { return getDomValue(domElems[0]); }, 
        set: function(newValue) { setDomElemsVal(domElems, newValue) },            
        configurable: true
    });

    if (domElems.length > 1) { syncDomElemsOnChange(obj, property, domElems); }               

    markBindings(obj, property, domElems);    
    return obj;
}

function bindObjPropToElements(obj, property, domElems) {    
    bindModelToElem(obj, property, domElems);
}

function jab(obj, property, domElems) {
    bindObjPropToElements(obj, property, domElems);
}