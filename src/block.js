var colors = {
  0: '#CBE896', //green
  1: '#FF299C', //pink
  2: '#F8F991', //yellow
  3: '#B191FF', //blue
}

var Block = function(context, color, x, y) {
  this.context = context
  this.color = color
  this.x = x
  this.y = y

  this.blockSize = 40
  this.blockMargin = 5
  this.blockField = this.blockSize + this.blockMargin

  this.render = function() {
    this.context.save()
    this.context.fillStyle = colors[this.color]
    this.context.fillRect(
      this.x * this.blockField,
      this.y * this.blockField,
      this.blockSize,
      this.blockSize
    )
    this.context.restore()
  }
}

module.exports = Block
