<style>
#v360Page {}
</style>
<template>
    <div id="v360Page">
        <v360-edit v-if="deitMode"></v360-edit>
        <div v-else>
            <button class="btn btn-success btn-lg btn-block" @click="gotoEdit">{{ $t('v360Page.gotoEdit') }}</button>
            <v360-list @openV360Viewer="openV360Viewer" @delV360="delV360"></v360-list>
        </div>
        <confirm-alert v-if="showDelAlert" @confirm="onDelConfirm" @close="onDelClose">{{ $t('v360Page.delAlert') }}</confirm-alert>
    </div>
</template>
<script>
import Vuex from 'vuex'
import V360List from 'component/v360List/v360List.vue'
import {
    STAGE_LOADING,
    V360_DEL,
} from 'types';
export default {
    data: function() {
        return {
            deitMode: false,
            showDelAlert: false,
            delV360Tmp: '',
        }
    },
    computed: {
        ...Vuex.mapState(['v360Modules']),
        ...Vuex.mapGetters(['isV360ListLoading']),
    },
    components: {
        'v360-list': V360List,
    },
    watch: {
        'v360Modules.status': function() {
            this.$store.dispatch(STAGE_LOADING, this.isV360ListLoading)
        },
    },
    methods: {
        openV360Viewer(mp4key) {
            this.$router.push({
                name: 'v360View',
                params: {
                    mp4key: mp4key
                },
            })
        },
        delV360(mp4key) {
            this.delV360Tmp = mp4key
            this.showDelAlert = true
        },
        onDelClose() {
            this.delV360Tmp = ''
            this.showDelAlert = false
        },
        onDelConfirm() {
            this.showDelAlert = false
            this[V360_DEL](this.delV360Tmp)
        },
        gotoEdit() {
            this.$router.push({
                name: 'v360Edit',
            })
            this.deitMode = true
        },
        ...Vuex.mapActions([V360_DEL]),
    },
    created() {
        if (this.$route.name === 'v360Edit') {
            this.deitMode = true
        }
    },
}
</script>
