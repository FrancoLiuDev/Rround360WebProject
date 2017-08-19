<style>
#v360List {}
</style>
<template>
    <div id="v360List">
        <h2>V360 List</h2>
        <ul class="list-group">
            <v360-list-item class="list-group-item" v-for="item in v360Modules.list.rows" :key="item.mp4key" :itemdata="item" @v360view="openV360Viewer" @delV360="delV360"></v360-list-item>
        </ul>
    </div>
</template>
<script>
import Vuex from 'vuex'
import V360ListItem from 'component/v360List/v360ListItem.vue'
import {
    V360_LIST,
    V360_SET_ITEM_STATE,
} from 'types'
export default {
    data: function() {
        return {}
    },
    computed: {
        ...Vuex.mapState(['v360Modules']),
    },
    components: {
        'v360-list-item': V360ListItem,
    },
    methods: {
        openV360Viewer(mp4key) {
            this.$emit('openV360Viewer', mp4key)
        },
        delV360(mp4key) {
            this.$emit('delV360', mp4key)
        },
        ...Vuex.mapActions([V360_LIST, V360_SET_ITEM_STATE]),
    },
    mounted() {
        this[V360_LIST]()
    },
    watch: {
        '$store.state.pushMessage' (val) {
            this[V360_SET_ITEM_STATE]({
                mp4key: val.mp4,
                status: val.status ? 0 : 1,
            })
        },
    },
}
</script>
