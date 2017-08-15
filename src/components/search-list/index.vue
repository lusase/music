<template>
  <div class="search-list" v-show="searches.length">
    <transition-group tag="ul" name="list">
      <li :key="item" @click="selectItem(item)" class="item" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>
<script>
  export default {
    props: {
      searches: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteItem(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .search-list
    .item
      display: flex
      align-items: center
      height: 40px
      .text
        flex: 1
        color: $c-text-l
      .icon
        .icon-delete
          font-size: $f-s
          color: $c-text-d
      &.list-enter-active, &.list-leave-active
        transition: all .1s linear
      &.list-enter, &.list-leave-to
        height: 0
</style>
