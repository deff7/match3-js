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
    if (this.state == 'removed') {
      if(this.scale >= 0.1) {
        this.scale -= 0.1
      } else {
        this.scale = 0
      }
      this.context.translate(
        (1 - this.scale) * properties.size / 2,
        (1 - this.scale) * properties.size / 2,
      )
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

  this.isNearMe = function(pos) {
    if(this.x == pos.x) {
      if(this.y == pos.y - 1 || this.y == pos.y + 1) return true
    } else if(this.y == pos.y) {
      if(this.x == pos.x - 1 || this.x == pos.x + 1) return true
    }
    return false
  }

  this.mark = function() {
    this.state = 'marked'
    this.events.emit(
      'markblock',
      this
    )
  }

  this.remove = function() {
    this.state = 'removed'
  }

  this.handleEvent = function(event, params) {
    if(this.state == 'removed') return
    if(this.isMyEvent(params)) {
      switch(event) {
        case 'hover':
          this.state = 'hover'
          return
        case 'click':
          this.mark()
          return
      }
    } else if(event == 'markblock' && this.state != 'marked') {
      if(params.color == this.color && this.isNearMe(params)) {
        this.mark()
        return
      }
    }
    if(this.state != 'marked') {
      this.state = null
    }
  }
}

Block.properties = properties

module.exports = Block
