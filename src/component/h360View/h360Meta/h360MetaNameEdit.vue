<style>
.detail-edit-bg {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 200;
}

#detail_bn {
    width: 39px;
    height: 39px;
    position: absolute;
    left: 10px;
    bottom: 0px;
}

.detail-edit-til {
    width: 500px;
    // min-height: 200px;
    background-color: #fff;
    border-radius: 10px;
    input {
        width: 100%;
        background-color: transparent;
        border: 0px none;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        &:focus {
            outline: none;
        }
    }
    textarea {
        width: 100%;
        height: 100px;
        border: 0px none;
        resize: none;
        &:focus {
            outline: none;
        }
    }
    .bnGp {
        margin-top: 30px;
    }
    .txt_prompt {
        position: absolute;
        right: 20px;
        color: #A0A0A0;
    }
}
</style>
<template>
    <transition name="fade">
        <div class="detail-edit-bg">
            <div class="modal-content pos_xymd detail-edit-til" id="">
                <div class="modal-header">
                    <button type="button" class="close" aria-hidden="true" @click="close">&times;</button>
                    <h4 class="modal-title txt_ag_md">{{ $t('h360View.meta.name')}}</h4>
                </div>
                <div class="modal-body">
                    <input id="itemNameInput" type="text" maxlength="20" v-model.trim="itemNameVal">
                    <p class="txt_prompt">{{wordNum}}/20</p>
                    <div class="bnGp txt_ag_md">
                        <button type="button" class="btn btn-default" @click="close">{{ $t('h360View.meta.confirm[0]')}}</button>
                        <button type="button" class="btn btn-primary" @click="confirm">{{ $t('h360View.meta.confirm[1]')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>>
</template>
<script>
/**
 * @file
 * <b class="subsection-title">Vue component</b><br>
 * 修改物件名稱視窗組件<br>
 * <b class="subsection-title">Tag name</b><br>
 * datail-edit-til<br>
 */

import debug from 'debug';
const log = debug('log');

/**
 * @class DatailEditTil
 * @classdesc
 * <b class="subsection-title">Vue component</b><br>
 * 修改物件名稱視窗組件<br>
 * <b class="subsection-title">mounted</b><br>
 * focus 文字輸入框<br>
 * <b class="subsection-title">Tag name</b><br>
 * datail-edit-til<br>
 */
export default {
    data: () => {
        return {
            itemNameVal: '',
            wordNum: 0,
        }
    },
    props: ['itemName'],
    computed: {},
    methods: {
        close() {
            this.$emit('close');
        },
        confirm() {
            if (this.itemNameVal.length > 20) {
                this.$root.infoMessage.type = 2;
                this.$root.infoMessage.message = '不能超過' + '20' + '個字元';
                return
            }
            this.$emit('confirm', this.itemNameVal);
        },
    },
    watch: {
        itemNameVal(val) {
            let num = val.length;
            if (num > 20) {
                this.$root.infoMessage.type = 2;
                this.$root.infoMessage.message = '不能超過' + '20' + '個字元';
                this.itemNameVal = val.substr(0, 20);
            }
            this.wordNum = num;
        },
    },
    created() {
        this.itemNameVal = this.itemName;

    },
    mounted() {
        document.getElementById('itemNameInput').focus();
    },
}
</script>
