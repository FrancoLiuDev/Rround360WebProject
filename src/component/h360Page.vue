<style>
#h360Page {}
</style>
<template>
    <div id="h360Page">
        <keep-alive>
            <h360-view v-if="viewer" @delH360="showDelAlert"></h360-view>
            <h360-list v-else></h360-list>
        </keep-alive>
        <confirm-alert v-if="isDelAlert" @confirm="delH360Item" @close="closeDelAlert">{{ $t('h360Page.dalAlert')}}</confirm-alert>
    </div>
</template>
<script>
import Vuex from 'vuex';
import {
    H360_DEL,
} from 'types';
import H360List from 'component/h360List/h360List.vue';
import h360View from 'component/h360View/h360View.vue';

/**
 * @class H360Page
 * @classdesc
 * H360頁面vue組件
 */

export default {
    data: function() {
        return {
            /**
             * 是否進入Viewer
             * @memberof H360Page#
             * @type {Boolean}
             */
            viewer: false,
            /**
             * zipkey
             * @memberof H360Page#
             * @type {String}
             */
            zipkey: '',
            /**
             * 展開刪除視窗
             * @memberof H360Page#
             * @type {Boolean}
             */
            isDelAlert: false,
        }
    },
    components: {
        'h360-list': H360List,
        'h360-view': h360View,
    },
    methods: {
        /**
         * 展開是否刪除視窗
         * @memberof H360Page#
         * @return {Boolean} 是否展開
         */
        showDelAlert() {
            this.isDelAlert = true;
        },
        /**
         * 關閉刪除視窗
         */
        closeDelAlert() {
            this.isDelAlert = false;
        },
        /**
         * 刪除H360 Item
         * @return {[type]} [description]
         */
        delH360Item() {
            this.isDelAlert = false;
            this[H360_DEL]({
                zipkey: this.zipkey
            })
            this.$router.replace({
                name: 'h360'
            })
        },
        ...Vuex.mapActions([H360_DEL]),
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
