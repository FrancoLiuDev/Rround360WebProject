<style>
#r360PcxViewer {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 9000;
    background-color: #000000;
    .header {
        width: 100%;
        height: 50px;
        color: #ffffff;
        font-size: 24px;
        line-height: 50px;
        background-color: rgba(0, 0, 0, 0.6);
        .float {
            display: inline-block;
            float: left;
        }
    }
    .pcx {
        width: 100%;
        height: 100%;
        background-image: url('/itembg.jpg');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
    }
}
</style>
<template>
    <transition name="fade">
        <div id="r360PcxViewer">
            <div class="header">
                <div class="float mouse_bn" @click="close"><span class="glyphicon glyphicon-arrow-left mouse_bn" aria-hidden="true"></span> Back</div>
            </div>
            <div class="pcx" :style="{ backgroundImage: 'url(' + path + ')' }"></div>
        </div>
    </transition>
</template>
<script>
/**
 * @class R360PcxViewer
 * @classdesc
 * R360 單圖片瀏覽 vue組件
 */
export default {
    props: ['path'],
    methods: {
        /**
         * 按下關閉
         * @memberof  R360PcxViewer
         */
        close() {
            this.$emit('close')
        }
    },
    mounted() {
        document.body.style.overflow = 'hidden';
    },
    beforeDestroy() {
        document.body.style.overflow = 'auto';
    },
}
</script>
