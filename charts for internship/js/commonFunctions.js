function hasClass(element, classname) {
    var classes = element.className.match(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
    if(classes===null){return false;} else{ return true;}
}
function addClass(element, classname) {
    if (!this.hasClass(element, classname)) element.className += " " + classname;
}
function removeClass(element, classname) {
    if (hasClass(element, classname)) {
        var reg = new RegExp('(\\s|^)' + classname + '(\\s|$)');
        element.className = element.className.replace(reg, ' ');
    }
}
function toggleClass(element,classToAdd,classToRemove)
{
	removeClass(element, classToRemove);
	addClass(element, classToAdd);
}