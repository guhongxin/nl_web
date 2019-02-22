<template>
  <div ref="self"
       :class="className"
       :style="style"
       @mousedown="mousedown"
       @touchstart="mousedown">
    <slot/>
  </div>
</template>

<script>
var CLICK_PIXEL_DISTANCE = 4

export default {
  name: 'GridItem',
  props: {
    index: {
      type: Number
    },
    sort: {
      type: Number
    },
    cellWidth: {
      type: Number
    },
    cellHeight: {
      type: Number
    },
    rowCount: {
      type: Number
    },
    rowShift: {
      type: Number,
      default: 0
    },
    draggable: {
      type: Boolean
    },
    dragDelay: {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {
      animate: true,
      dragging: false,

      shiftStartX: 0,
      shiftStartY: 0,

      mouseMoveStartX: 0,
      mouseMoveStartY: 0,

      shiftX: 0,
      shiftY: 0,

      timer: null,

      zIndex: 1
    }
  },
  mounted: function() {
    this.$refs.self
      .addEventListener('transitionend', function(event) {
        if (!this.dragging) {
          this.zIndex = 1
        }
      }, false)
  },
  computed: {
    className: function() {
      var animate = this.animate
      var dragging = this.dragging
      return [
        'v-grid-item-wrapper',
        {
          'v-grid-item-animate': animate,
          'v-grid-item-dragging': dragging
        }
      ]
    },
    style: function() {
      var zIndex = this.zIndex
      var cellWidth = this.cellWidth
      var cellHeight = this.cellHeight
      var top = this.top
      var left = this.left
      return {
        zIndex: zIndex,
        width: cellWidth + 'px',
        height: cellHeight + 'px',
        transform: 'translate3d('+left+'px, '+top+'px, 0)'
      }
    },

    left: function() {
      return this.dragging
        ? this.shiftX
        : this.rowShift + (this.sort % this.rowCount) * this.cellWidth
    },

    top: function() {
      return this.dragging
        ? this.shiftY
        : Math.floor(this.sort / this.rowCount) * this.cellHeight
    }
  },
  methods: {
    wrapEvent: function(event) {
      var index = this.index
      var sort = this.sort
      return { event: event, index: index, sort: sort }
    },

    dragStart: function(event) {
      var e = event.touches ? event.touches[0] : event

      this.zIndex = 2

      this.shiftX = this.shiftStartX = this.left
      this.shiftY = this.shiftStartY = this.top

      this.mouseMoveStartX = e.pageX
      this.mouseMoveStartY = e.pageY

      this.animate = false
      this.dragging = true

      document.addEventListener('mousemove', this.documentMouseMove)
      document.addEventListener('touchmove', this.documentMouseMove)

      this.$emit('dragstart', this.wrapEvent(event))
    },

    drag: function(event) {
      var e = event.touches ? event.touches[0] : event

      var distanceX = e.pageX - this.mouseMoveStartX
      var distanceY = e.pageY - this.mouseMoveStartY

      this.shiftX = distanceX + this.shiftStartX
      this.shiftY = distanceY + this.shiftStartY

      var gridX = Math.round(this.shiftX / this.cellWidth)
      var gridY = Math.round(this.shiftY / this.cellHeight)

      gridX = Math.min(gridX, this.rowCount - 1)
      gridY = Math.max(gridY, 0)

      var gridPosition = gridX + gridY * this.rowCount

      var $event = {
        event: event,
        distanceX: distanceX,
        distanceY: distanceX,
        positionX: this.shiftX,
        positionY: this.shiftY,
        index: this.index,
        gridX: gridX,
        gridY: gridY,
        gridPosition: gridPosition
      }

      this.$emit('drag', $event)
    },

    mousedown: function(event) {
      if (this.draggable) {
        var self = this
        self.timer = setTimeout( function() {
          self.dragStart(event)
        }, self.dragDelay)

        document.addEventListener('mouseup', this.documentMouseUp)
        document.addEventListener('touchend', this.documentMouseUp)
      }
    },

    documentMouseMove: function(event) {
      if (this.draggable && this.dragging) {
        this.drag(event)
      }
    },

    documentMouseUp: function(event) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }

      var dx = this.shiftStartX - this.shiftX
      var dy = this.shiftStartY - this.shiftY

      var distance = Math.sqrt(dx * dx + dy * dy)

      this.animate = true
      this.dragging = false
      this.mouseMoveStartX = 0
      this.mouseMoveStartY = 0
      this.shiftStartX = 0
      this.shiftStartY = 0

      document.removeEventListener('mousemove', this.documentMouseMove)
      document.removeEventListener('touchmove', this.documentMouseMove)

      document.removeEventListener('mouseup', this.documentMouseUp)
      document.removeEventListener('touchend', this.documentMouseUp)

      var $event = this.wrapEvent(event)

      if (distance < CLICK_PIXEL_DISTANCE) {
        this.$emit('click', $event)
      }

      this.$emit('dragend', $event)
    }
  }
}
</script>

<style lang="scss">
.v-grid-item-wrapper {
  display: block;
  position: absolute;
  box-sizing: border-box;

  left: 0;
  top: 0;

  user-select: none;
  transform: translate3d(0px, 0px, 0px);

  z-index: 1;

  &.v-grid-item-animate {
    transition: transform 800ms ease;
  }

  &.v-grid-item-dragging {
  //  z-index: 9000 !important;
  }
}
</style>
