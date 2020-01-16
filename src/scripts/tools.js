export function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild; 
}

export function secondeToMinute(sec = 0) {
  let min = Math.floor(sec / 60);
  let secRest = sec - (min * 60);
  if(min < 10) min = `0${min}`;
  if(secRest < 10) secRest = `0${secRest}`;
  return `${min}:${secRest}`;
}

export function assignOrSetDefault(value, def){
  if(value) return value;
  return def;
}

export function createCustomEvent(element, name = "", detail = {}){ 
  let event = new CustomEvent(name, {detail});
  element.dispatchEvent(event);
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (min - max + 1) ) + max;
}