<style>
.h360-select {
    overflow: auto;
}
</style>
<template>
    <div class="h360-select" :style="{height:modHeight+'px'}">
        <h4>H360 List</h4>
        <h360-itme v-for="item in h360Modules.list.rows" :key="item.zipkey" :item="item" @select="select"></h360-itme>
    </div>
</template>
<script>
import Vuex from 'vuex'
import H360SelectItem from './h360SelectItem.vue'
import {
    H360_LIST,
    H360_LIST_NEXT,
} from 'types'
export default {
    data: function() {
        return {}
    },
    computed: {
        step() {
            return this['h360Modules'].step
        },
        modHeight() {
            return this.windowSize.hh - 72 //- header高度
        },
        // listOffset() {
        //     return this['h360Modules'].list.rows.length
        // },
        // isListEnd(){
        //     return this.listOffset < this['h360Modules'].list.count?true:false
        // },
        ...Vuex.mapState(['h360Modules', 'windowSize']),
        ...Vuex.mapGetters([
            'isListEnd',
            'listOffset',
            //     'isListLoading',
            //     'canLoadNum',
        ]),
    },
    components: {
        'h360-itme': H360SelectItem,
    },
    methods: {
        loadH360List() {
            this[H360_LIST_NEXT]({
                limit: 5,
                offset: this.listOffset,
            })
        },
        select(item) {
            this.$emit('select', item)
        },
        ...Vuex.mapActions([H360_LIST, H360_LIST_NEXT]),
    },
    watch: {
        step(val, old) {
            /* 如果還有下一頁就繼續 */
            if (old === 1 && val === 2 && !this.isListEnd) {
                this.loadH360List()
            }
        },
    },
    mounted() {
        /* 如果沒有資料就載入 */
        if (this.step === 0) {
            this.loadH360List()
        } else if (!this.isListEnd) {
            this.loadH360List()
        }
    }
}
</script>
