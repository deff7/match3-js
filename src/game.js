var Field = require('./field')
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

canvas.width = 700
canvas.height = 700

context.fillStyle = 'green'

var field = new Field(context, 10, 10)
field.generate()
field.start()

var getMousePosition = function(event) {
  var rect = canvas.getBoundingClientRect()
  return({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  })
}

var listeners = {
  click: 'click',
  mousemove: 'hover'
}

for(var eventName in listeners) {
  (function() {
    var event = listeners[eventName]
    canvas.addEventListener(eventName, function(e) {
      var position = getMousePosition(e)
      field.emitMouseOnBlockEvent(position.x, position.y, event)
    })
  })()
}

