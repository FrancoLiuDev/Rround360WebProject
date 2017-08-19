<style>
#r360View {}
</style>
<template>
    <div id="r360View">
        <r360-pcx-viewer :path="pcxViewerPath" v-if="isShowrPcxViewer" @close="closeR360PcxView"></r360-pcx-viewer>
        <r360-pcx class="r360-pcx" v-for="item in r360ItemList" :key="item" :path='item' @onClick="openR360PcxView">
        </r360-pcx>
    </div>
</template>
<script>
import Vuex from 'vuex'
import {
    R360_PAG,
} from 'types'
import R360Pcx from './r360Pcx.vue'
import R360PcxViewer from './r360PcxViewer.vue'
/**
 * @class R360View
 * @classdesc
 * R360 View vue組件
 */

export default {
    data: function() {
        return {
            r360ItemList: [],
            isShowrPcxViewer: false,
            pcxViewerPath: '',
            isDie: false,
        }
    },
    props: ['zipkey'],
    computed: {
        ...Vuex.mapState(['r360Modules']),
        ...Vuex.mapGetters(['getR360Path']),
    },
    components: {
        'r360-pcx': R360Pcx,
        'r360-pcx-viewer': R360PcxViewer,
    },
    methods: {
        /**
         * 打開R360單照片Viewer
         * @memberof  R360View
         * @param  {String} path 照片路徑
         */
        openR360PcxView(path) {
            this.pcxViewerPath = path;
            this.isShowrPcxViewer = true;
        },
        /**
         * 關閉R360單照片Viewer
         * @memberof  R360View
         */
        closeR360PcxView() {
            this.isShowrPcxViewer = false;
        },
        /**
         * 載入一張圖
         * @memberof  R360View
         * @param  {String} path 圖路徑
         */
        loadAnImage(path) {
            let imageTmp = new Image()
            this.r360ItemList.push(path)
            imageTmp.onload = () => {
                this.$emit('loadedAnImage')
            }
            imageTmp.src = path
        },
        ...Vuex.mapActions([R360_PAG]),
    },
    mounted() {
        this[R360_PAG]({
            zipkey: this.zipkey
        });
    },
    watch: {
        'r360Modules.pagStep': function(val, old) {
            if (val === 2 && old === 1) {
                this.key = 1;
                let path = '001';
                this.$on('loadedAnImage', () => {
                    this.key += 1;
                    path = '' + this.key
                    while (path.length < 3) {
                        path = '0' + path
                    }
                    if (this.key <= 48 && !this.isDie) {
                        this.loadAnImage(this.getR360Path + path + '.jpg')
                    }
                })
                this.loadAnImage(this.getR360Path + path + '.jpg')
            }
        },
    },
    beforeDestroy() {
        this.isDie = true
    },
    beforeRouteEnter(to, from, next) {
        next()
    },
}
</script>
