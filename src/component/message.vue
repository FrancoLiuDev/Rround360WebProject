<style>
#message {
    position: fixed;
    bottom: 0px;
    z-index: 9999;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    color: #000000;
    text-align: center;
    background: rgba(255, 255, 255, 0.5);
    overflow: hidden;
}
</style>
<template>
    <transition name="fadeOut">
        <div id="message" v-if="isShow">{{stageMessage}}</div>
    </transition>
</template>
<script>
/**
 * @class R360Page
 * @classdesc
 * R360頁面vue組件
 */
export default {
    data: function() {
        return {
            isShow: false,
        }
    },
    computed: {
        stageMessage() {
            return this.$store.state.message
        }
    },
    watch: {
        stageMessage(val) {
            if (val) {
                this.isShow = true
                this.timeout = setTimeout(() => {
                    clearTimeout(this.timeout)
                    this.isShow = false
                }, 1500)
            }
        },
    },
    components: {},
    methods: {},
}
</script>
