var colors = {
  0: '#CBE896', //green
  1: '#FF299C', //pink
  2: '#F8F991', //yellow
  3: '#B191FF', //blue
}

var properties = {
  size: 40,
  margin: 5,
}
properties.field = properties.size + properties.margin

var Block = function(context, color, x, y) {
  this.context = context
  this.color = color
  this.x = x
  this.y = y
  this.state = null

  this.render = function() {
    this.context.save()
    var color = colors[this.color]
    if (this.state == 'hover') {
      color = 'white'
    } 
    this.context.fillStyle = color
    this.context.fillRect(
      this.x * properties.field,
      this.y * properties.field,
      properties.size,
      properties.size
    )
    this.context.restore()
  }

  this.isMyEvent = function(position) {
      return position.x == this.x && position.y == this.y
  }

  this.handleEvent = function(event, params) {
    if(this.isMyEvent(params)) {
      switch(event) {
        case 'hover':
          this.state = 'hover'
          return
        case 'click':
          this.state = 'click'
          return
      }
    }
    this.state = null
  }
}

Block.properties = properties

module.exports = Block
