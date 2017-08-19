<style>
.v360-view {
    min-height: 480px;
    width: 100%;
    .mv {
        position: relative;
        width: 100%;
        height: 480px;
        background-color: #000000;
    }
}
</style>
<template>
    <div class="v360-view">
        <div class="row" v-if="isPreview">
            <div class="col-md-6">
                <button class="btn btn-warning btn-lg btn-block" @click="backToEdit">{{ $t('v360View.backToEdit') }}</button>
            </div>
            <div class="col-md-6">
                <button class="btn btn-success btn-lg btn-block" @click="addNew">{{ $t('v360View.next') }}</button>
            </div>
        </div>
        <h3>{{v360MetaModules.meta.name}}</h3>
        <div class="mv">
            <load-ing v-if="status!==0">{{status===2?$t('v360View.message[0]'):$t('v360View.message[1]')}}</load-ing>
            <video width="100%" height="480px" v-else controls autoplay loop>
                <source :src="mp4Path" type="video/mp4">
            </video>
        </div>
        <div>
            {{ $t('v360View.about') }} : {{v360MetaModules.meta.about}}
        </div>
        <img :src="logoPath" alt="" v-if="!isV360MetaLoading">
    </div>
</template>
<script>
import Vuex from 'vuex'
import LoadIng from 'component/loadIng.vue'
import {
    V360_META,
    STAGE_LOADING,
    EDIT_V360_CLEAR,
    V360_DEL,
} from 'types'
export default {
    data: function() {
        return {
            mp4key: '',
            isPreview: false,
            isDel: true,
        }
    },
    computed: {
        status() {
            return this['v360MetaModules'].meta.status
        },
        mp4Path() {
            return ENV_SERVER + ENV_V360_FP_API + this.mp4key
        },
        logoPath() {
            return ENV_SERVER + ENV_V360_FP_API + this['v360MetaModules'].meta.thumbkey
        },
        ...Vuex.mapState(['v360MetaModules']),
        ...Vuex.mapGetters(['isV360MetaLoading']),
    },
    components: {
        'load-ing': LoadIng,
    },
    methods: {
        addNew() {
            this.isDel = false
            this.$router.push({
                name: 'v360',
            })
        },
        backToEdit() {
            this.$router.go(-1)
        },
        ...Vuex.mapActions([V360_META, EDIT_V360_CLEAR, V360_DEL]),
    },
    watch: {
        '$store.state.pushMessage' (val) {
            if (val.mp4 === this.mp4key) {
                this[V360_META](val.mp4)
            }
        },
        isV360MetaLoading(val) {
            this.$store.dispatch(STAGE_LOADING, val)
        },
    },
    created() {
        this.mp4key = this.$route.params.mp4key
    },
    mounted() {
        this.$store.dispatch(STAGE_LOADING, true)
        this[V360_META](this.mp4key)
    },
    beforeRouteEnter(to, from, next) {
        if (from.name === 'v360Edit') {
            next(vm => vm.$nextTick(() => vm.isPreview = true))
        } else {
            next()
        }
    },
    beforeRouteLeave(to, from, next) {
        if (to.name !== 'v360Edit') {
            this[EDIT_V360_CLEAR]()
        }
        if (this.isPreview && this.isDel) {
            this['V360_DEL'](this.mp4key)
        }
        next()
    },
}
</script>
