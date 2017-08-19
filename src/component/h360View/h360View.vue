<style>
#h360View {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
}

#h360Viewer {
    width: 100%;
    height: 100%;
}
</style>
<template>
    <div id="h360View">
        <div id="h360Viewer"></div>
        <tool-bar @openMeta="openMeta" @clickDelItem="onClickDelItem"></tool-bar>
        <h360-meta v-if="showMeta" @editName="openEditName" @editAbout="openEditAbout">
            <span slot="til">{{itemName}}</span>
            <code slot="detail">{{h360MetaModules.meta.about}}</code>
        </h360-meta>
        <h360-name-edit :item-name="h360MetaModules.meta.name" v-if="showNameEdit" @close="closeEditName" @confirm="editName"></h360-name-edit>
        <h360-about-edit :about="h360MetaModules.meta.about" max="100" v-if="showAboutEdit" @close="closeEditAbout" @confirm="editAbout"></h360-about-edit>
    </div>
</template>
<script>
import Vuex from 'vuex'
import H360Viewer from './viewer.js';
import H360ViewerToolBar from './h360ViewerToolBar.vue';
import H360MetaEditDelegate from './h360Meta/h360MetaEditDelegate.js';
import {
    STAGE_LOADING,
    MESSAGE,
} from 'types';
/**
 * @class H360Viewer
 * @classdesc
 * H360 Viwer VueComponent
 */

export default {
    mixins: [H360MetaEditDelegate],
    data: function() {
        return {
            zipkey: '',
        }
    },
    components: {
        'tool-bar': H360ViewerToolBar,
    },
    methods: {
        /**
         * 刪除本物件事件
         * @memberof H360Viewer#
         * @fires clickDelItem
         */
        onClickDelItem() {
            this.$emit('delH360', {
                zipkey: this.zipkey,
            })

        },
    },
    activated() {
        this.$store.dispatch(STAGE_LOADING, true)
        document.body.style.overflow = 'hidden';
        document.oncontextmenu = () => false; //鎖右鍵
        this.view = new H360Viewer('h360Viewer', this);
        this.view.onLoading = (step, rate) => {
            if (step === 'loading') {
                this.$store.dispatch(STAGE_LOADING, true)
            } else {
                this.$store.dispatch(STAGE_LOADING, false)
            }
            this.$store.dispatch(MESSAGE, step + ' ' + rate + '...')
        }
    },
    deactivated() {
        this.view.onLoading = () => {}
        this.view.die();
        document.body.style.overflow = 'auto';
        document.oncontextmenu = () => true; //開右鍵
    },
}
</script>
