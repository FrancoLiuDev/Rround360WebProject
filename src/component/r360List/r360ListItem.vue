<style>
.r360-list-item {
    position: relative;
    float: left;
    width: 300px;
    height: 300px;
    margin: 10px;
    /*border: #000000 1px solid;*/
    overflow: hidden;
    border-radius: 3px;
    box-shadow: 2px 3px 16px #969696;
    .item-img {
        position: relative;
        width: auto;
        height: 200px;
        margin: 25px 50px 15px 50px;
        border-radius: 3px;
        background-image: url('/itembg.jpg');
        background-size: cover;
        background-position: center center;
    }
    .til {
        padding: 0px 10px 0px 10px;
        font-size: 18px;
    }
    .time {
        float: right;
        padding: 10px 10px 0px 0px;
    }
}
</style>
<template>
    <div class="r360-list-item">
        <div class="item-img mouse_bn" :style="{ backgroundImage: 'url(' + itemImg + ')' }" @click="onClick">
            <load-ing v-if="isLoading"></load-ing>
        </div>
        <div class="til">
            {{r360ItemData.name}}
        </div>
        <div class="time">
            {{r360ItemData.cdate}}
        </div>
    </div>
</template>
<script>
import Vuex from 'vuex'
import LoadIng from 'component/loadIng.vue'
/**
 * @class R360ListItem
 * @classdesc
 * R360 List Item vue組件
 */

export default {
    data: function() {
        return {
            isLoading: true,
        }
    },
    props: ['r360ItemData'],
    computed: {
        itemImg() {
            return '/api/r360/fp/' + this.r360ItemData.thumbkey;
        },
    },
    components: {
        'load-ing': LoadIng,
    },
    methods: {
        onClick() {
            if (!this.isLoading) {
                this.$emit('clickR360', this.r360ItemData.zipkey)
            }
        },
    },
    mounted() {
        //pcx loading
        let pcx = new Image()
        pcx.src = this.itemImg
        pcx.onload = () => this.isLoading = false
    }
}
</script>
