<style>
#v360MetaFrom {
    textarea {
        width: 100%;
        height: 152px;
        resize: none;
    }
}
</style>
<template>
    <div class="row" id="v360MetaFrom">
        <div class="col-md-8">
            <div class="form-group">
                <input type="text" class="form-control" :placeholder="$t('v360Edit.from.name')" maxlength="20" v-model="v360From.name">
            </div>
            <div class="form-group">
                <textarea class="form-control" wrap="Virtual" :placeholder="$t('v360Edit.from.about')" v-model="v360From.about"></textarea>
            </div>
        </div>
        <div class="col-md-4">
            <file-up ref="fileUp"></file-up>
        </div>
    </div>
</template>
<script>
import Vuex from 'vuex'
import FileUpMod from './fileUpMod.vue'
export default {
    data: function() {
        return {
            v360From: {
                name: '',
                about: '',
            },
        }
    },
    computed: {
        cover() {
            return this.$refs['fileUp'].imageData
        },
        ...Vuex.mapState(['editV360Modules']),
    },
    components: {
        'file-up': FileUpMod,
    },
    methods: {

    },
    mounted() {
        this.v360From.name = this['editV360Modules'].name
        this.v360From.about = this['editV360Modules'].about
        this.$refs['fileUp'].imageData = this['editV360Modules'].cover
    },
}
</script>
