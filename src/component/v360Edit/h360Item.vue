<style>
#v360Edit {
    .h360-item {
        position: relative;
        float: left;
        width: 100px;
        height: 100px;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
        .item-img {
            width: 100px;
            height: 100px;
            margin: 2px;
            border-radius: 3px;
            background-image: url('/itembg.jpg');
            background-size: cover;
            background-position: center center;
        }
        .del {
            display: none;
            position: absolute;
            top: 0px;
            right: 0px;
            width: 17px;
            height: 17px;
            background-image: url('./delete.png');
        }
        &:hover {
            .del {
                display: block;
            }
        }
    }
}
</style>
<template>
    <!-- <transition name="fadeIn"> -->
    <div class="h360-item" draggable="true" @dragstart.stop="onDrag" @dragenter.prevent="onDragover" @dragover.prevent>
        <div class="item-img" :style="{ backgroundImage: 'url(' + h360Item.itemImg + ')' }"></div>
        <div class="del mouse_bn hover_icon" @click="del"></div>
    </div>
    <!-- </transition> -->
</template>
<script>
export default {
    data: function() {
        return {
            hide: false,
        }
    },
    props: ['h360Item'],
    computed: {},
    components: {},
    methods: {
        del() {
            this.$emit('del', this.h360Item)
        },
        onDrag() {
            this.$emit('onDrag', this.h360Item.rad)
        },
        onDragend() {

        },
        onDragover() {
            this.$emit('onDragover', this.h360Item.rad)
        },
    },
}
</script>
