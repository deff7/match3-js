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

  this.render = function() {
    this.context.save()
    this.context.fillStyle = colors[this.color]
    this.context.fillRect(
      this.x * properties.field,
      this.y * properties.field,
      properties.size,
      properties.size
    )
    this.context.restore()
  }
}

Block.properties = properties

module.exports = Block
