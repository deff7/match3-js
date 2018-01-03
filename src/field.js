var Block = require('./block.js')
var Events = require('./events.js')
var Logger = require('./logger.js')

var Field = function(context, width, height) {
  this.events = new Events()
  this.context = context

  this.width = width
  this.height = height

  this.blocksArea = {
    width: Block.properties.field * width,
    height: Block.properties.field * height
  }

  this.context.canvas.width = this.blocksArea.width
  this.context.canvas.height = this.blocksArea.height

  this.map = new Array(height)
  for(var i = 0; i < height; i++) {
    this.map[i] = new Array(width)
  }

  this.eachBlock = function(callback) {
    for(var y = 0; y < this.height; y++) {
      for(var x = 0; x < this.width; x++) {
        var result = callback(this.map[y][x], x, y)
        if (result != undefined) {
          this.map[y][x] = result
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
          Math.floor(Math.random() * 6),
          x,
          y)
        that.events.addObserver(block)
        return block
      }
    })
  }

  this.getBlock = function(x, y) {
    return this.map[y][x]
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
    this.events.addObserver(new Logger())
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

  this.dropping = new Array(width)

  this.dropBlocks = function() {
    var blocksToDrop = [],
      that = this
    for(var x = 0; x < width; x++) {
      if(this.dropping[x]) {
        continue
      }
      var emptyFound = false
      for(var y = this.height - 1; y >= 0; y--) {
        var block = this.map[y][x]
        if(block == undefined) {
          emptyFound = true
        } else if(emptyFound && block.state != 'dropping' ) {
          this.dropping[x] = true
          blocksToDrop.push(block)
          break
        }
      }
    }

    blocksToDrop.forEach(function(block) {
      that.events.emit('drop_block', block)
    })
  }

  this.markBlocks = function(position) {
    this.markedBlocks = new Set()
    var color = this.map[position.y][position.x].color,
      that = this,
      checked = new Array(height)
    for(var i = 0; i < height; i++) {
      checked[i] = new Array(width)
    }
    var crawl = function(pos) {
      if(pos.x < 0 || pos.x >= width || pos.y < 0 || pos.y >= height) {
        return
      }
      if(checked[pos.y][pos.x]) {
        return
      }
      checked[pos.y][pos.x] = true
      var block = that.map[pos.y][pos.x]
      if(block != undefined && block.color == color) {
        that.markedBlocks.add(block)
        crawl({x: pos.x - 1, y: pos.y})
        crawl({x: pos.x + 1, y: pos.y})
        crawl({x: pos.x, y: pos.y - 1})
        crawl({x: pos.x, y: pos.y + 1})
      }
    }
    crawl(position)
  }

  this.handleEvent = function(event, params) {
    switch(event) {
      case 'click': {
        this.markBlocks(params)
        var that = this
        this.markedBlocks.forEach(function(block) {
          that.events.emit('remove_block', block)
        })
        break
      }
      case 'removed_block': {
        this.map[params.y][params.x] = undefined
        this.markedBlocks.delete(params)
        if(this.markedBlocks.size == 0) {
          this.dropBlocks()
        }
        break
      }
      case 'dropped_block': {
        var block = this.map[params.y][params.x]
        this.map[block.y][block.x] = undefined
        this.map[block.y + 1][block.x] = block
        block.y++

        this.dropping[block.x] = false
        this.dropBlocks()
        break
      }
    }
  }
}

module.exports = Field
