var colors = {
  0: '#CBE896', //green
  1: '#FF299C', //pink
  2: '#F8F991', //yellow
  3: '#B191FF', //blue
}

var properties = {
  size: 64,
  margin: 5,
}
properties.field = properties.size + properties.margin

var Block = function(context, events, color, x, y) {
  this.context = context
  this.events = events
  this.color = color
  this.x = x
  this.y = y
  this.state = null

  this.scale = 1.0

  this.render = function() {
    this.context.save()
    var color = colors[this.color]
    if (this.state == 'hover') {
      color = 'white'
    } 
    if (this.state == 'removing') {
      if(this.scale >= 0.1) {
        this.scale -= 0.1
      } else {
        this.scale = 0
        this.events.emit('removed_block', this)
      }
      this.context.translate(
        (1 - this.scale) * properties.size / 2,
        (1 - this.scale) * properties.size / 2,
      )
    }

    if (this.state == 'dropping') {
      if(this.animY < 1) {
        /*this.context.translate(
          0,
          - (1 - this.animY) * properties.field
        )*/
        this.animY += 0.1
      } else {
        console.log('Dropped', this)
        this.state = null
        this.events.emit('dropped_block', {x: this.x, y: this.y})
      }
    }

    this.context.translate(
      this.x * properties.field,
      this.y * properties.field,
    )

    this.context.scale(this.scale, this.scale)
    this.context.fillStyle = color
    this.context.fillRect(
      0,
      0,
      properties.size,
      properties.size
    )
    this.context.restore()
  }

  this.isMyEvent = function(position) {
      return position.x == this.x && position.y == this.y
  }

  this.handleEvent = function(event, params) {
    if(this.state == 'removing' || this.state == 'dropping') {
      return
    }
    if(this.isMyEvent(params)) {
      switch(event) {
        case 'hover': {
          this.state = 'hover'
          return
        }
        case 'remove_block': {
          this.state = 'removing'
          return
        }
        case 'drop_block': {
          console.log('Start dropping: ', this)
          this.state = 'dropping'
          this.animY = 0.0
          return
        }
      }
    } 
    this.state = null
  }
}

Block.properties = properties

module.exports = Block
