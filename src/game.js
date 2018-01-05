var Field = require('./field')

var Game = function(width, height) {
  var canvas = document.getElementById('canvas')
  var context = canvas.getContext('2d')
  var field = new Field(context, width, height)

  this.start = function() {
    field.generate()
    field.start()
    addEventListeners()
  }

  var getMousePosition = function(event) {
    var rect = canvas.getBoundingClientRect()
    return({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    })
  }

  var addEventListeners = function() {
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
  }
}
new Game(10, 10).start()
