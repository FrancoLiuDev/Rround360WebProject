<style>
/* CSS請見 h360MetaNameEdit.vue */
</style>
<template>
    <transition name="fade">
        <div class="detail-edit-bg" id="">
            <div class="modal-content pos_xymd detail-edit-til" id="">
                <div class="modal-header ">
                    <button type="button" class="close" aria-hidden="true" @click="close">&times;</button>
                    <h4 class="modal-title txt_ag_md ">{{ $t('h360View.meta.about')}}</h4>
                </div>
                <div class="modal-body">
                    <textarea id="aboutInput" wrap="Virtual" v-model="aboutVal" :placeholder="$t('h360View.meta.aboutInput')"></textarea>
                    <p class="txt_prompt">{{wordNum}}/{{max}}</p>
                    <div class="bnGp txt_ag_md">
                        <button type="button" class="btn btn-default" @click="close">{{ $t('h360View.meta.confirm[0]')}}</button>
                        <button type="button" class="btn btn-primary" @click="confirm">{{ $t('h360View.meta.confirm[1]')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
//     ____        __        _ ________    ___ __  ___    __                __
//    / __ \____ _/ /_____ _(_) / ____/___/ (_) /_/   |  / /_  ____  __  __/ /_
//   / / / / __ `/ __/ __ `/ / / __/ / __  / / __/ /| | / __ \/ __ \/ / / / __/
//  / /_/ / /_/ / /_/ /_/ / / / /___/ /_/ / / /_/ ___ |/ /_/ / /_/ / /_/ / /_
// /_____/\__,_/\__/\__,_/_/_/_____/\__,_/_/\__/_/  |_/_.___/\____/\__,_/\__/


/**
 * @file
 * <b class="subsection-title">Vue component</b><br>
 * 修改物件詳細資訊視窗組件<br>
 * <b class="subsection-title">Tag name</b><br>
 * datail-edit-about<br>
 */

import debug from 'debug';
const log = debug('log');

/**
 * @class DatailEditAbout
 * @classdesc
 * <b class="subsection-title">Vue component</b><br>
 * 修改物件詳細資訊視窗組件<br>
 * <b class="subsection-title">mounted</b><br>
 * focus 文字輸入框<br>
 * <b class="subsection-title">Tag name</b><br>
 * datail-edit-about<br>
 */
export default {
    data: () => {
        return {
            /**
             * 表單內文字
             * @type {String}
             * @memberof DatailEditAbout#
             */
            aboutVal: '',
            /**
             * 表單內文字字數
             * @type {Number}
             * @memberof DatailEditAbout#
             */
            wordNum: 0,
        }
    },
    /**
     * Tag屬性
     * @property [about] {String} 表單內預設文字
     * @property max {String} 表單限制字數
     * @memberof DatailEditAbout#
     * 
     */
    props: ['about', 'max'],
    computed: {},
    methods: {
        /**
         * 按下關閉
         * @fires close
         * @memberof DatailEditAbout#
         */
        close() {
            /**
             * @event DatailEditAbout#close
             * @description 按下關閉事件
             */
            this.$emit('close');
        },
        /**
         * 按下確定
         * @memberof DatailEditAbout#
         * @fires confirm
         */
        confirm() {
            if (this.aboutVal.length > this.max) { //字數檢查
                this.outrideError();
                return
            }
            /**
             * @event DatailEditAbout#confirm
             * @description 按下確定
             * @return 表單內文字
             */
            this.$emit('confirm', this.aboutVal);
        },
        /**
         * 字數超過錯誤訊息
         * @memberof DatailEditAbout#
         */
        outrideError() {
            this.$root.infoMessage.type = 2;
            this.$root.infoMessage.message = '不能超過' + this.max + '個字元';
        },
    },
    watch: {
        aboutVal(val) {
            let num = val.length;
            if (num > this.max) { //字數檢查
                this.outrideError();
                this.aboutVal = val.substr(0, this.max);
            }
            this.wordNum = num;
        },
    },
    created() {
        this.aboutVal = this.about;
    },
    mounted() {
        document.getElementById("aboutInput").focus();
    },
}
</script>
