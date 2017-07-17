<template>
  <div class="search-box">
    <div class="icon-search"></div>
    <input :placeholder="placeholder" v-model="query" type="text" class="box" ref="box">
    <i class="icon-dismiss" v-show="query" @click="query = ''"></i>
  </div>
</template>
<script>
  import {throttle} from 'common/js/util'
  const DELAY = 200
  export default {
    data() {
      return {
        query: ''
      }
    },
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    created() {
      this.$watch('query', throttle(val => this.$emit('query', val), DELAY))
    },
    methods: {
      setQuery(query) {
        this.query = query
      },
      blur() {
        this.$refs.box.blur()
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $c-bg-h
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $c-bg
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $c-bg-h
      color: $c-text
      font-size:$f-m
      &::placeholder
        color: $c-text-d
    .icon-dismiss
      font-size: 16px
      color: $c-bg

</style>
