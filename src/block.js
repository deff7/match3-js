var Resources = require('./resources.js')

var properties = {
  size: 48,
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
        this.context.translate(
          0,
          this.animY * properties.field
        )
        this.animY += 0.5 * this.animYSpeed * this.animYSpeed
        this.animYSpeed += 0.5
      } else {
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
    if(!Resources.loading) {
      this.context.drawImage(Resources.images.gems[this.color], 0, 0)
    }
    if (this.state == 'hover') {
      this.context.globalCompositeOperation = 'source-atop'
      this.context.fillStyle = 'white'
      this.context.globalAlpha = 0.2
      this.context.fillRect(
            0,
            0,
            properties.size,
            properties.size
      )
    } 
    
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
          this.state = 'dropping'
          this.animY = 0.0
          this.animYSpeed = 1.0
          return
        }
      }
    } 
    this.state = null
  }
}

Block.properties = properties

module.exports = Block
