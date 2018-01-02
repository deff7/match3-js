var Block = require('./block.js')

console.log(Block.properties)

var Field = function(context, width, height) {
  this.context = context

  this.width = width
  this.height = height

  this.blockSize = 32
  this.blockMargin = 5
  this.blockField = this.blockSize + this.blockMargin

  this.map = new Array(height)
  for(var i = 0; i < height; i++) {
    this.map[i] = new Array(width)
  }

  this.eachBlock = function(callback) {
    for(var i = 0; i < this.width; i++) {
      for(var j = 0; j < this.height; j++) {
        var result = callback(this.map[j][i], i, j)
        if (result != undefined) {
          this.map[j][i] = result
        }
      }
    }
  }

  this.generate = function() {
    var that = this
    this.eachBlock(function(block, x, y) {
      if(block === undefined) {
        return new Block(
          that.context,
          Math.floor(Math.random() * 4),
          x,
          y)
      }
    })
  }

  this.render = function() {
    this.context.fillStyle = 'black'
    this.eachBlock(function(block) {
      block.render()
    })
  }

  this.mouseOver = function(mouseX, mouseY) {
  }

  this.mouseClick = function(event) {
    console.log(event)
  }
}

module.exports = Field
