<style>
#v360Edit {
    position: relative;
}
</style>
<template>
    <div class="row" id="v360Edit">
        <div class="col-md-4">
            <h360-select ref="selecter"></h360-select>
        </div>
        <div class="col-md-8">
            <edit-v360 ref="editer"></edit-v360>
            <mete-from ref="meta"></mete-from>
        </div>
        <div class="col-md-8">
            <button type="button" class="btn btn-primary btn-lg btn-block" @click="this.postV360">{{ $t('v360Edit.v360EditPost')}}</button>
        </div>
    </div>
</template>
<script>
import H360SelectMod from './h360SelectMod.vue'
import EditV360 from './editV360.vue'
import V360MetaFrom from './v360MetaFrom.vue'
import V360EditDelegate from './v360EditDelegate.js'
export default {
    mixins: [V360EditDelegate],
    data: function() {
        return {
            formName: '',
            fromAbout: '',
        }
    },
    computed: {},
    components: {
        'h360-select': H360SelectMod,
        'edit-v360': EditV360,
        'mete-from': V360MetaFrom,
    },
    methods: {},
}
</script>
