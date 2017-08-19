import Vuex from 'vuex'
import {
    EDIT_V360_ADD,
    EDIT_V360_DEL,
    EDIT_V360_CLEAR,
    EDIT_V360_META,
    STAGE_LOADING
} from 'types'
export default {
    computed: {
        ...Vuex.mapState(['editV360Modules']),
        ...Vuex.mapGetters(['isV360EditIng']),
    },
    methods: {
        postV360() {
            this[EDIT_V360_META]({
                name: this.$refs.meta.v360From.name,
                about: this.$refs.meta.v360From.about,
                cover: this.$refs.meta.cover,
            })
        },
        ...Vuex.mapActions([
            EDIT_V360_ADD,
            EDIT_V360_DEL,
            EDIT_V360_CLEAR,
            EDIT_V360_META,
        ]),
    },
    watch: {
        ['editV360Modules.postStep'](val) {
            this.$store.dispatch(STAGE_LOADING, this.isV360EditIng)
            if (val === 2) {
                this.$router.push({
                    name: 'v360View',
                    params: {
                        mp4key: this['editV360Modules'].mp4key
                    },
                })
            }
        }
    },
    mounted() {
        this.$store.dispatch(STAGE_LOADING, this.isV360EditIng)
        this.$refs.selecter.$on('select', this[EDIT_V360_ADD])
        this.$refs.editer.$on('del', this[EDIT_V360_DEL])
    },
}
