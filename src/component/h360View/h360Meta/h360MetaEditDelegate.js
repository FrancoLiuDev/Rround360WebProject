/**
 * H360 Meta Edit Delegate
 */

import Vuex from 'vuex';
import {
    H360_META,
    H360_META_EDIT,
    CHANGE_H360_ITEM,
} from 'types'
import H360Meta from './h360Meta.vue';
import H360MetaNameEdit from './h360MetaNameEdit.vue';
import H360MetaAboutEdit from './h360MetaAboutEdit.vue';
export default {
    data: function() {
        return {
            zipkey: '',
            showMeta: false,
            showNameEdit: false,
            showAboutEdit: false,
        }
    },
    computed: {
        itemName() {
            this['CHANGE_H360_ITEM']({
                zipkey: this.zipkey,
                meta: this['h360MetaModules'].meta,
            })
            return this['h360MetaModules'].meta.name
        },
        ...Vuex.mapState(['h360MetaModules']),
    },
    components: {
        'h360-meta': H360Meta,
        'h360-name-edit': H360MetaNameEdit,
        'h360-about-edit': H360MetaAboutEdit,
    },
    methods: {
        openMeta() {
            this.showMeta = !this.showMeta;
        },
        openEditName() {
            this.showNameEdit = true;
        },
        closeEditName() {
            this.showNameEdit = false;
        },
        editName(newName) {
            this.showNameEdit = false;
            this[H360_META_EDIT]({
                zipkey: this.zipkey,
                name: newName
            });
        },
        openEditAbout() {
            this.showAboutEdit = true;
        },
        closeEditAbout() {
            this.showAboutEdit = false;
        },
        editAbout(newAbout) {
            this.showAboutEdit = false;
            this[H360_META_EDIT]({
                zipkey: this.zipkey,
                about: newAbout
            });
        },
        ...Vuex.mapActions([H360_META, H360_META_EDIT, CHANGE_H360_ITEM]),
    },
    watch: {
        showNameEdit(val, old) {
            if (val) {
                this.showMeta = false;
            } else {
                this.showMeta = true;
            }
        },
        showAboutEdit(val, old) {
            if (val) {
                this.showMeta = false;
            } else {
                this.showMeta = true;
            }
        },
    },
    activated() {
        this.zipkey = this.$route.params.zipkey
        this[H360_META](this.zipkey);
    },
    deactivated() {
        this.showMeta = false;
    },
}
