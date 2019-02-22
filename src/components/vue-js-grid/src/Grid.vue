<template>
  <div class="v-grid" :style="style">
    <GridItem v-for="v in list"
              :key="v.index"
              :index="v.index"
              :sort="v.sort"
              :draggable="draggable"
              :drag-delay="dragDelay"
              :row-count="rowCount"
              :cell-width="cellWidth"
              :cell-height="cellHeight"
              :window-width="windowWidth"
              :row-shift="rowShift"
              @dragstart="onDragStart"
              @dragend="onDragEnd"
              @drag="onDrag"
              @click="click">
      <slot name="cell"
            :item="v.item"
            :index="v.index"
            :sort="v.sort"
            :remove="() => { removeItem(v) }">
      </slot>
    </GridItem>
  </div>
</template>
<script>
import windowSize from './mixins/window_size.js'
import GridItem from './GridItem.vue'

export default {
  name: 'Grid',
  mixins: [windowSize],
  components: {
    GridItem
  },
  props: {
    items: {
      type: Array,
      default: function() {
        return []
      }
    },
    cellWidth: {
      type: Number,
      default: 80,
    },
    cellHeight: {
      type: Number,
      default: 80
    },
    draggable: {
      type: Boolean,
      default: false
    },
    dragDelay: {
      type: Number,
      default: 0
    },
    sortable: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      list: []
    }
  },
  watch: {
    items: {
      handler: function() {
        var nextItems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        this.list = nextItems.map(function(item, index) {
          return {
            item: item,
            index: index,
            sort: index
          }
        })
      },
      immediate: true
    }
  },
  computed: {
    height: function() {
      return Math.ceil(this.items.length / this.rowCount) *
        this.cellHeight
    },

    style: function() {
      return {
        height: this.height + 'px'
      }
    },

    rowCount: function() {
      return Math.floor(this.windowWidth / this.cellWidth)
    },

    rowShift: function() {
      if (this.center) {
        var contentWidth = this.items.length * this.cellWidth
        var rowShift = contentWidth < this.windowWidth
          ? (this.windowWidth - contentWidth) / 2
          : (this.windowWidth % this.cellWidth) / 2

        return Math.floor(rowShift)
      }

      return 0
    }
  },
  methods: {
    /* Returns merged event object */
    wrapEvent: function() {
      var other = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return {
        datetime: Date.now(),
        items: this.getListClone(),
        ...other
      }
    },
    /* Returns sorted clone of "list" array */
    getListClone: function() {
      return this.list
        .slice(0)
        .sort(function(a, b) {
          return a.sort - b.sort
        })
      //  .map(v => {
      //    return { ...v.item }
      //  })
    },

    removeItem: function(_ref) {
      var index = _ref.index;
      var removeItem = this.list.find(function (v) {
        return v.index === index;
      });
      var removeItemSort = removeItem.sort

      this.list = this.list
        .filter(function(v) {
          return v.index !== index
        })
        .map(function(v) {
          var sort = v.sort > removeItemSort
            ? (v.sort - 1)
            : v.sort

          return { ...v, sort: sort }
        })

      this.$emit('remove', this.wrapEvent({ index: index }))
    },

    onDragStart: function(event) {
      this.$emit('dragstart', this.wrapEvent(event))
    },

    onDragEnd: function(event) {
      this.$emit('dragend', this.wrapEvent(event))
    },

    click: function(event) {
      this.$emit('click', this.wrapEvent(event))
    },

    onDrag: function(event) {
      if (this.sortable) {
        this.sortList(event.index, event.gridPosition)
      }

      this.$emit('drag', this.wrapEvent({ event: event }))
    },

    sortList: function(itemIndex, gridPosition) {
      var targetItem = this.list.find( function(item) {return item.index === itemIndex})
      var targetItemSort = targetItem.sort

      /*
        Normalizing new grid position
      */
      gridPosition = Math.max(gridPosition, 0)
      /*
        If you remove this line you can drag items to positions that
        are further than items array length
      */
      gridPosition = Math.min(gridPosition, this.list.length - 1)

      if (targetItemSort !== gridPosition) {
        this.list = this.list.map(function(item) {
          if (item.index === targetItem.index) {
            return {
              ...item,
              sort: gridPosition
            }
          }

          var sort = item.sort

          if (targetItemSort > gridPosition) {
            if (sort <= targetItemSort && sort >= gridPosition) {
              return {
                ...item,
                sort: sort + 1
              }
            }
          }

          if (targetItemSort < gridPosition) {
            if (sort >= targetItemSort && sort <= gridPosition) {
              return {
                ...item,
                sort: sort - 1
              }
            }
          }

          return item
        })

        this.$emit('sort', this.wrapEvent())
      }
    }
  }
}
</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

.v-grid {
  display: block;
  position: relative;
  width: 100%;
}
</style>
