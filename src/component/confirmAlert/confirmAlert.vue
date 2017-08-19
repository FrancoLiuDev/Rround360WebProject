<style>
#confirmAlert {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9980;
}

#confirmAlertCnt {
    min-width: 300px;
}
</style>
<template>
    <transition name="fade">
        <div id="confirmAlert">
            <div class="modal-content pos_xymd" id="confirmAlertCnt">
                <div class="modal-body ">
                    <button type="button" class="close" aria-hidden="true" @click="close">&times;</button>
                    <h4 class="modal-title txt_ag_md "><slot>Alert</slot></h4>
                </div>
                <div class="modal-body">
                    <div class="bnGp txt_ag_md">
                        <button type="button" class="btn btn-default" @click="close">{{ $t('confirmAlert[0]')}}</button>
                        <button type="button" class="btn btn-primary" @click="confirm">{{ $t('confirmAlert[1]')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
//                     _____                ___    __          __
//   _________  ____  / __(_)________ ___  /   |  / /__  _____/ /_
//  / ___/ __ \/ __ \/ /_/ / ___/ __ `__ \/ /| | / / _ \/ ___/ __/
// / /__/ /_/ / / / / __/ / /  / / / / / / ___ |/ /  __/ /  / /_
// \___/\____/_/ /_/_/ /_/_/  /_/ /_/ /_/_/  |_/_/\___/_/   \__/

/**
 * @file
 * <b class="subsection-title">Vue component</b><br>
 * 確認視窗組件<br>
 * <b class="subsection-title">Tag name</b><br>
 * confirm-alert<br>
 */

import debug from 'debug';
const log = debug('log');
/**
 * @class ConfirmAlert
 * @classdesc
 * <b class="subsection-title">Vue component</b><br>
 * 確認視窗組件<br>
 * <b class="subsection-title">mounted</b><br>
 * 會把 overflow 改成 hidden<br>
 * <b class="subsection-title">beforeDestroy</b><br>
 * 會把 overflow 改回原來狀態<br>
 * <b class="subsection-title">Tag name</b><br>
 * confirm-alert<br>
 */

export default {
    data: () => {
        return {}
    },
    computed: {},
    methods: {
        /**
         * 按下關閉
         * @fires close
         * @memberof ConfirmAlert#
         */
        close() {
            /**
             * @event ConfirmAlert#close
             * @description 按下關閉事件
             */
            this.$emit('close');
        },
        /**
         * 按下確定
         * @memberof ConfirmAlert#
         * @fires confirm
         */
        confirm() {
            /**
             * @event ConfirmAlert#confirm
             * @description 按下確定事件
             */
            this.$emit('confirm');
        },
    },
    created() {},
    mounted() {
        this.tmpOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    },
    beforeDestroy() {
        document.body.style.overflow = this.tmpOverflow;
    },
}
</script>
