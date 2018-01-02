var Field = require('./field')
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

canvas.width = 500
canvas.height = 500

context.fillStyle = 'green'

var field = new Field(context, 10, 10)
field.generate()
field.render()

canvas.addEventListener('click', field.mouseClick)
canvas.addEventListener('mousemove', function(event) {
  var rect = canvas.getBoundingClientRect(),
    x = event.clientX - rect.left,
    y = event.clientY - rect.top
  field.mouseOver(x, y)
})
