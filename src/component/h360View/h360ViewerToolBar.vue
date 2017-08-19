<style>
#h360ViewerToolBar {
    position: absolute;
    top: 0px;
    overflow: hidden;
    width: 100%;
    height: 50px;
    padding: 0px 15px 0px 15px;
    color: #ffffff;
    font-size: 24px;
    line-height: 50px;
    background-color: rgba(0, 0, 0, 0.6);
    .float {
        display: inline-block;
        float: left;
    }
    .right {
        display: inline-block;
        float: right;
        margin: 0px 0px 0px 20px;
    }
}
</style>
<template>
    <div id="h360ViewerToolBar">
        <div class="float mouse_bn" @click="backToList"><span class="glyphicon glyphicon-arrow-left mouse_bn" aria-hidden="true"></span> H360 List</div>
        <div class="right"><span class="glyphicon glyphicon-list-alt mouse_bn" aria-hidden="true" @click="openMeta"></span></div>
        <div class="right"><span class="glyphicon glyphicon glyphicon-trash mouse_bn" aria-hidden="true" @click="onClcikDelItem"></span></div>
    </div>
</template>
<script>
/**
 * @class H360ViewerToolBar
 * @classdesc
 * H360 Viwer Head ToolBar
 */
export default {
    data: function() {
        return {

        }
    },
    components: {

    },
    methods: {
        //打開h360 meta
        openMeta() {
            this.$emit('openMeta');
        },
        backToList() {
            this.$router.push({
                name: 'h360',
            })
        },
        /**
         * 按下刪除
         * @memberof H360ViewerToolBar#
         * @fires clickDelItem
         */
        onClcikDelItem() {
            this.$emit('clickDelItem');
        },
    },
}
</script>
