<style>
@import "~style/global.less";
#h360List {}
</style>
<template>
    <div id="h360List">
        <h4>{{ $t('h360List.has[0]')}} {{h360Modules.list.count}} {{ $t('h360List.has[1]')}}</h4>
        <h360-list-item v-for="item in h360Modules.list.rows" :key="item.zipkey" :h360-item-data="item"></h360-list-item>
        <div class="clear"></div>
        <!-- <code>{{h360Modules.list}}</code> -->
        <!-- <code>{{h360Modules.error}}</code> -->
    </div>
</template>
<script>
import Vuex from 'vuex'
import {
    H360_LIST,
    H360_LIST_NEXT,
    MESSAGE,
} from 'types'
import H360ListItem from 'component/h360List/h360ListItem.vue'
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
        ...Vuex.mapState(['h360Modules']),
        ...Vuex.mapGetters([
            'isListEnd',
            'isListLoading',
            'listOffset',
            'canLoadNum',
        ]),
    },
    components: {
        'h360-list-item': H360ListItem,
    },
    methods: {
        onScroll() {
            this.pageYOffset = window.pageYOffset;
            this.isScrollFoot = (this.dom_h - this.pageYOffset) < this.win_h + 200;
        },
        onReize() {
            this.win_h = document.body.scrollHeight;
        },
        /* 檢查是否載入下一頁 */
        chkLoadNext() {
            this.onScroll();
            if (this.isScrollFoot && !this.isListEnd && !this.isListLoading) {
                this.$store.dispatch(MESSAGE, 'Loading...')
                this.$nextTick(() => {
                    this[H360_LIST_NEXT]({
                        limit: this.canLoadNum,
                        offset: this.listOffset,
                    })
                });
            }
        },
        ...Vuex.mapActions([H360_LIST, H360_LIST_NEXT]),
    },
    watch: {
        'h360Modules.list.rows': function(val, old) {
            this.$nextTick(() => {
                this.dom_h = this.$el.clientHeight;
                this.chkLoadNext();
            })
        },
        isScrollFoot(val, old) {
            this.chkLoadNext();
        },
    },
    created() {
        this[H360_LIST]({
            limit: this.canLoadNum,
        });
    },
    mounted() {
        window.addEventListener('scroll', this.onScroll);
        window.addEventListener('resize', this.onReize);
        this.onReize();
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onReize);
    },
}
</script>
