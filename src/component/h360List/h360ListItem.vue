<style>
.h360-list-item {
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
        width: 250px;
        height: 200px;
        margin: 25px 25px 15px 25px;
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
    <div class="h360-list-item">
        <div class="item-img mouse_bn" :style="{ backgroundImage: 'url(' + itemImg + ')' }" @click="gotoItem">
            <load-ing v-if="isLoading"></load-ing>
        </div>
        <div>
            <div class="til">
                {{h360ItemData.name}}
            </div>
            <div class="time">
                2015/10/10 12:53
            </div>
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
    computed: {
        itemImg() {
            return '/api/fp/' + this.h360ItemData.thumbkey;
        },
    },
    props: ['h360ItemData'],
    components: {
        'load-ing': LoadIng,
    },
    methods: {
        gotoItem() {
            if (this.isLoading) {
                return
            }
            this.$router.push({
                name: 'h360View',
                params: {
                    zipkey: this.h360ItemData.zipkey
                }
            })
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
