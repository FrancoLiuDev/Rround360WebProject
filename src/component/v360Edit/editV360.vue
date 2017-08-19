<style>
.edit-v360 {
    min-height: 123px;
}
</style>
<template>
    <div class="edit-v360">
        <h4>{{ $t('v360Edit.message')}}</h4>
        <item v-for="item in editV360Modules.v360List" :key="item.rad" :h360Item="item" @del="del" @onDrag="onDrag" @onDragover="onDragover"></item>
        <div class="clear"></div>
    </div>
</template>
<script>
import Vuex from 'vuex'
import Lazy from 'lazy.js'
import H360Item from './h360Item.vue'
export default {
    data: function() {
        return {
            fromDragRad: '',
            toDragRad: '',
        }
    },
    components: {
        item: H360Item,
    },
    computed: {
        ...Vuex.mapState(['editV360Modules']),
    },
    methods: {
        del(h360Item) {
            this.$emit('del', h360Item)
        },
        onDrag(itemRad) {
            this.fromDragRad = itemRad
        },
        onDragover(itemRad) {
            this.toDragRad = itemRad
        },
    },
    watch: {
        toDragRad(val) {
            let to = Lazy(this['editV360Modules'].v360List).pluck('rad').indexOf(this.fromDragRad)
            let from = Lazy(this['editV360Modules'].v360List).pluck('rad').indexOf(val)
            this['editV360Modules'].v360List.splice(from, 0, this['editV360Modules'].v360List.splice(to, 1)[0])
        }
    },
    mounted() {}
}
</script>
