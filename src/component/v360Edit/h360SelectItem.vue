<style>
.select-item {
    float: left;
    width: 160px;
    height: 180px;
    &:hover {
        box-shadow: 2px 3px 16px #969696;
    }
    .item-img {
        position: relative;
        width: 150px;
        height: 150px;
        margin: 5px 5px 5px 5px;
        border-radius: 3px;
        background-image: url('/itembg.jpg');
        background-size: cover;
        background-position: center center;
    }
    .til {
        width: 140px;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
<template>
    <div class="select-item">
        <div class="item-img mouse_bn" :style="{ backgroundImage: 'url(' + itemImg + ')' }" @click="select">
            <load-ing v-if="isLoading"></load-ing>
        </div>
        <div class="til">
            {{item.name}}
        </div>
    </div>
</template>
<script>
import LoadIng from 'component/loadIng.vue'
export default {
    data: function() {
        return {
            isLoading: true,
        }
    },
    props: ['item'],
    components: {
        'load-ing': LoadIng,
    },
    computed: {
        itemImg() {
            return '/api/fp/' + this.item.thumbkey
        },
    },
    methods: {
        select() {
            this.$emit('select', {
                zipkey: this.item.zipkey,
                itemImg: this.itemImg,
            })
        }
    },
    mounted() {
        let pcx = new Image()
        pcx.src = this.itemImg
        pcx.onload = () => this.isLoading = false
    }
}
</script>
