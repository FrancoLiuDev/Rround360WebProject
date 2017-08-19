<style>
#r360List {}
</style>
<template>
    <div id="r360List">
        <h4>{{ $t('r360List.has[0]')}} {{r360Modules.list.count}} {{ $t('r360List.has[1]')}}</h4>
        <!-- R360項目 -->
        <r360-list-item v-for="item in r360Modules.list.rows" :r360-item-data="item" :key="item.zipkey" @clickR360="onClickR360"></r360-list-item>
    </div>
</template>
<script>
import Vuex from 'vuex'
import {
    R360_LIST,
    R360_LIST_NEXT,
    MESSAGE,
} from 'types';
import R360ListItem from './r360ListItem.vue'
/**
 * @class R360List
 * @classdesc
 * R360 List vue組件
 */

export default {
    data: function() {
        return {
            /* 滾動高度 */
            pageYOffset: 0,
            /* 列表高度 */
            dom_h: 0,
            /* 頁面高度 */
            win_h: 0,
            /* 是否滾到底部 */
            isScrollFoot: true,
        }
    },
    computed: {
        ...Vuex.mapState(['r360Modules']),
        ...Vuex.mapGetters([
            'isR360ListEnd',
            'isR360ListLoading',
            'r360ListOffset',
        ]),
    },
    components: {
        'r360-list-item': R360ListItem,
    },
    methods: {
        /**
         * 發送Item點擊事件
         * @param  {String} zipkey 點擊R360的zipkey
         */
        onClickR360(zipkey) {
            this.$emit('clickR360', zipkey)
        },
        /**
         * 滾輪滾動觸發
         */
        onScroll() {
            this.pageYOffset = window.pageYOffset
            this.isScrollFoot = (this.dom_h - this.pageYOffset) < this.win_h + 200
        },
        onReize() {
            this.win_h = document.body.scrollHeight;
        },
        /* 檢查是否載入下一頁 */
        chkLoadNext() {
            this.onScroll();
            if (this.isScrollFoot && !this.isR360ListEnd && !this.isR360ListLoading) {
                this.$nextTick(() => {
                    this.$store.dispatch(MESSAGE, 'Loading...')
                    this[H360_LIST_NEXT]({
                        offset: this.r360ListOffset,
                    })
                });
            }
        },
        ...Vuex.mapActions([R360_LIST]),
    },
    mounted() {
        this[R360_LIST]()
        window.addEventListener('scroll', this.onScroll)
        window.addEventListener('resize', this.onReize)
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll)
        window.removeEventListener('resize', this.onReize)
    },
    beforeRouteEnter(to, from, next) {
        next()
    },
}
</script>
