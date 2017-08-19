<style>
#h360Meta {
    width: 420px;
    min-height: 170px;
    padding: 22px 26px;
    background-color: rgba(0, 0, 0, 0.6);
    border: 1px solid #FFFFFF;
    border-radius: 5px;
    color: #FFFFFF;
    z-index: 30;
    code {
        max-height: 500px;
        border: 0px none;
        background-color: transparent;
        color: #fff;
        padding: 0px;
        margin: 0px;
    }
    hr {
        margin: 15px 0px;
        border-width: 0.5px;
        border-color: #ffffff;
    }
    .txt {
        padding-right: 40px;
        word-break: break-all;
    }
    .edit {
        position: absolute;
        right: 0px;
        top: 20%;
        width: 17px;
        height: 17px;
        background: url("/images/edit.png");
    }
}
</style>
<template>
    <transition name="fade">
        <div class="pos_xymd" id="h360Meta">
            <div class="pos_re">
                <div>{{ $t('h360View.meta.name')}}:</div>
                <div class="txt" slot="til">
                    <slot name="til">物件內容slot</slot>
                </div>
                <div class="edit bg_c_g mouse_bn hover_icon" @click="click_editName"></div>
            </div>
            <hr>
            <div class="pos_re">
                <div>{{ $t('h360View.meta.about')}}:</div>
                <div class="txt">
                    <slot name="detail">物件說明slot</slot>
                </div>
                <div class="edit bg_c_g myMouse hover_icon" @click="click_editAbout"></div>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    data: function() {
        return {

        }
    },
    components: {

    },
    methods: {
        click_editName() {
            this.$emit('editName');
        },
        click_editAbout() {
            this.$emit('editAbout');
        },
    },
}
</script>
