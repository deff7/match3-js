var Resources = {
  imagesToLoad: 6,
  loading: true
}

Resources.images = {}
Resources.images.gems = []

for(var i = 0; i < 6; i++) {
  (function (){
    var image = new Image()
    image.addEventListener('load', function() {
      Resources.images.gems.push(image)
      Resources.imagesToLoad--
      if(Resources.imagesToLoad == 0) {
        Resources.loading = false
        console.log(Resources.images)
      }
    })
    image.src = 'data/gem_' + i + '.png'
  })()
}

module.exports = Resources
