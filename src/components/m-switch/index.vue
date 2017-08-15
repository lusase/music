<template>
  <ul class="m-switch">
    <li class="item"
        v-for="(item, index) in items"
        :class="{active: index === currentIndex}"
        @click="switchItem(index)"
    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>
<script>
  export default {
    props: {
      items: {
        type: Array,
        'default': []
      },
      currentIndex: {
        type: Number,
        'default': 0
      }
    },
    methods: {
      switchItem(index) {
        this.$emit('switch', index)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .m-switch
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $c-bg-h
    border-radius: 5px
    .item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $f-m
      color: $c-text-d
      &.active
        background: $c-bg-h
        color: $c-text
</style>
