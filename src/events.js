var Events = function() {
  this.observers = []

  this.addObserver = function(observer) {
    this.observers.push(observer)
  }

  this.emit = function(event, params) {
    this.observers.forEach(function(observer) {
      observer.handleEvent(event, params)
    })
  }
}

module.exports = Events
