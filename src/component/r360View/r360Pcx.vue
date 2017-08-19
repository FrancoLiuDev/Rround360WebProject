<style>
#r360View {
    .r360-pcx {
        position: relative;
        width: 12.5%;
        height: auto;
        float: left;
        img {
            width: 100%;
        }
    }
}
</style>
<template>
    <div class="r360-pcx hover_icon mouse_bn" @click="onClick">
        <img :src="path" @load="isLoading=false">
        <load-ing v-if="isLoading"></load-ing>
    </div>
</template>
<script>
/**
 * @class R360Pcx
 * @classdesc
 * R360 View 的單圖片 vue組件
 */
import LoadIng from 'component/loadIng.vue'
export default {
    data: function() {
        return {
            isLoading: true,
        }
    },
    props: ['path'],
    methods: {
        onClick() {
            this.$emit('onClick', this.path)
        }
    },
    components: {
        'load-ing': LoadIng,
    },
}
</script>
