<style>
#indexPage {}
</style>
<template>
    <div id="indexPage">
        <h1>{{ $t('indexPage.til')}}</h1>
        <h2 v-if="isLogin">{{ $t('indexPage.loginMessage[0]')}}</h2>
        <h2 v-else>{{ $t('indexPage.loginMessage[1]')}}</h2>
        <h4>{{ $t('message.hello') }}</h4>
    </div>
</template>
<script>
import Vuex from 'vuex';
export default {
    data: function() {
        return {}
    },
    computed: {
        ...Vuex.mapGetters(['isLogin']),
    },
    methods: {}
}
</script>
