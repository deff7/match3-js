var Logger = function() {
  this.handleEvent = function(event, params) {
    if(event == 'hover') return
    console.log('Event catched: ', event, params)
  }
}

module.exports = Logger
