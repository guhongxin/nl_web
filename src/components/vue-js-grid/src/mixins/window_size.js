export default {
  data: function() {
    return {
      windowHeight: 0,
      windowWidth: 0
    }
  },
  created: function() {
    window.addEventListener('resize', this.getWindowSize)
    this.getWindowSize()
  },

  beforeDestroy: function() {
    window.removeEventListener('resize', this.getWindowSize)
  },

  methods: {
    getWindowSize: function() {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth - 220
    }
  }
}
