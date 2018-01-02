var Field = require('./field')
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

canvas.width = 500
canvas.height = 500

context.fillStyle = 'green'

var field = new Field(context, 10, 10)
field.generate()
field.render()

