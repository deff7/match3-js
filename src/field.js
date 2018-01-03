var Block = require('./block.js')
var Events = require('./events.js')

console.log(Block.properties)

var Field = function(context, width, height) {
  this.events = new Events()
  this.context = context

  this.width = width
  this.height = height

  this.blocksArea = {
    width: Block.properties.field * width,
    height: Block.properties.field * height
  }

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
        var block = new Block(
          that.context,
          that.events,
          Math.floor(Math.random() * 4),
          x,
          y)
        that.events.addObserver(block)
        return block
      }
    })
  }

  this.render = function() {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
    this.context.fillStyle = 'black'
    this.eachBlock(function(block) {
      if(block != undefined) {
        block.render()
      }
    })
  }

  this.start = function() {
    this.events.addObserver(this)
    var that = this
    var timerID = setInterval(function() {
      that.render()
    }, 33)
  }

  this.mousePositionToCoord = function(mouseX, mouseY) {
    var mouseFitInWidth = mouseX >= 0 && mouseX <= this.blocksArea.width,
      mouseFitInHeight = mouseY >= 0 && mouseY <= this.blocksArea.height
    if(mouseFitInWidth && mouseFitInHeight) {
      return({
        x: Math.floor(mouseX / Block.properties.field),
        y: Math.floor(mouseY / Block.properties.field)
        })
    }
  }

  this.emitMouseOnBlockEvent = function(mouseX, mouseY, event) {
    var blockCoord = this.mousePositionToCoord(mouseX, mouseY)
    if(blockCoord != undefined) {
      this.events.emit(event, blockCoord)
    }
  }

  this.startRemoving = false
  this.markedBlocks = []

  this.handleEvent = function(event, params) {
    if(event == 'click') {
      this.markedBlocks = []
      this.startRemoving = false
    }
    if(event == 'markblock') {
      this.markedBlocks.push(params)
      if(this.markedBlocks.length >= 3) {
        this.startRemoving = true
      }
      if(this.startRemoving) {
        var block
        while(block = this.markedBlocks.pop()) {
          block.remove()
        }
      }
    }

    if(event == 'remove_block') {
      delete this.map[params.y][params.x]
    }
  }
}

module.exports = Field
