<style>
#r360Page {}
</style>
<template>
    <div id="r360Page">
        <r360-view v-if="viewer" :zipkey="zipkey"></r360-view>
        <r360-list v-else @clickR360="gotoR360View"></r360-list>
    </div>
</template>
<script>
import Vuex from 'vuex';
import R360List from 'component/r360List/r360List.vue'
import R360View from 'component/r360View/r360View.vue'
/**
 * @class R360Page
 * @classdesc
 * R360頁面vue組件
 */

export default {
    data: function() {
        return {
            viewer: false,
            zipkey: '',
        }
    },
    computed: {

    },
    components: {
        'r360-list': R360List,
        'r360-view': R360View,
    },
    methods: {
        /**
         * 到r360 view頁面
         * @return {String} r360 zipkey
         */
        gotoR360View(zipkey) {
            this.$router.push({
                name: 'r360View',
                params: {
                    zipkey: zipkey,
                }
            })
        }
    },
    beforeRouteEnter(to, from, next) {
        //取回 Route 中的 zipkey
        next((vm) => {
            if (to.params.zipkey) {
                vm.viewer = true;
                vm.zipkey = to.params.zipkey;
            } else {
                vm.viewer = false;
                vm.zipkey = '';
            }
        });
    },
}
</script>
