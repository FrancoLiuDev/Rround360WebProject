import "babel-polyfill";
import "style/vue-animation.less";
import IndexPage from 'component/IndexPage.vue';
import LoginPage from 'component/loginPage.vue';
import H360Page from 'component/h360Page.vue';
import R360Page from 'component/r360Page.vue';
import V360Page from 'component/v360Page.vue';
import V360Edit from 'component/v360Edit/v360Edit.vue'
import V360View from 'component/v360View/v360View.vue'
import HeadComponent from 'component/head.vue';
import LoginComponent from 'component/login.vue';
import ConfirmAlert from 'component/confirmAlert/confirmAlert.vue';
import StageLoading from 'component/stageLoading.vue'
import Message from 'component/message.vue'
import AuthModules from 'modules/authModules.js';
import H360Modules from 'modules/h360Modules.js';
import H360MetaModules from 'modules/h360DetailModules.js';
import R360Modules from 'modules/r360Modules.js'
import EditV360Modules from 'modules/editV360Modules.js'
import V360Modules from 'modules/v360Modules.js'
import V360MetaModules from 'modules/v360DetailModules.js'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import I18nPlugin from './i18nPlugin.js'
import {
    HAS_SES,
    LOGIN_REP,
    STAGE_LOADING,
    MESSAGE,
    RESIZE,
    PUSH_MESSAGE,
} from 'types';

async function main() {
    Vue.component('oview-head', HeadComponent);
    Vue.component('oview-login', LoginComponent);
    Vue.component('confirm-alert', ConfirmAlert);
    Vue.component('stage-loading', StageLoading);
    Vue.component('message', Message);
    Vue.use(VueRouter);
    const router = new VueRouter({
        routes: [
            { path: '/', name: 'home', component: IndexPage },
            { path: '/login', name: 'login', component: LoginPage },
            { path: '/h360', name: 'h360', component: H360Page },
            { path: '/h360/:zipkey', name: 'h360View', component: H360Page },
            { path: '/r360', name: 'r360', component: R360Page },
            { path: '/r360/:zipkey', name: 'r360View', component: R360Page },
            { path: '/v360', name: 'v360', component: V360Page }, { path: '/v360/edit', name: 'v360Edit', component: V360Edit }, { path: '/v360/viewer/:mp4key', name: 'v360View', component: V360View },

            { path: '*', redirect: { name: 'home' } },
        ]
    });


    Vue.use(Vuex);

    const store = new Vuex.Store({
        state: {
            isLoading: false,
            message: '',
            pushMessage: null,
            loginReplace: '',
            //需重新驗證Token
            reTaken: 0,
            windowSize: {
                ww: 0,
                hh: 0,
            },
        },
        mutations: {
            setLoading(state, isLoading) {
                state.isLoading = isLoading
            },
            setMessage(state, message) {
                state.message = message
            },
            setWindowSize(state, newsize) {
                state.windowSize = newsize
            },
            pushMessage(state, message) {
                state.pushMessage = message
            },
        },
        actions: {
            [STAGE_LOADING]({ state, commit, rootState }, isLoading) {
                commit('setLoading', isLoading)
            },
            [MESSAGE]({ state, commit, rootState }, messgae) {
                commit('setMessage', messgae)
            },
            [PUSH_MESSAGE]({ state, commit, rootState }, messgae) {
                commit('pushMessage', messgae)
            },
            [RESIZE]({ state, commit, rootState }, newsize) {
                commit('setWindowSize', newsize)
            },
        },
        modules: {
            authModules: AuthModules,
            h360Modules: H360Modules,
            h360MetaModules: H360MetaModules,
            r360Modules: R360Modules,
            editV360Modules: EditV360Modules,
            v360MetaModules: V360MetaModules,
            v360Modules: V360Modules,
        }
    });

    //多語系
    Vue.use(VueI18n)
    let i18nPlugin = new I18nPlugin('zh-CN')
    let i18n = await i18nPlugin.initIn18nSync(VueI18n, 'zh-CN')

    const vm = new Vue({
        el: '#app',
        router,
        store,
        i18n,
        computed: {
            isLoading() {
                return this.$store.state.isLoading
            },
            ...Vuex.mapState(['authModules']),
            ...Vuex.mapGetters(['isLogin']),
        },
        methods: {
            onResize() {
                this[RESIZE]({
                    ww: window.innerWidth,
                    hh: window.innerHeight
                })
            },
            ...Vuex.mapActions([
                HAS_SES,
                LOGIN_REP,
                RESIZE,
                PUSH_MESSAGE,
            ]),
        },
        watch: {
            'authModules.adminStep': function(val, old) {
                //如果未登入到就首頁
                if (old === 1 && val !== 2) {
                    router.replace({ name: 'home' });
                }
                //登入導頁
                else if (old === 4 && val === 2) {
                    router.replace(
                        store.state.loginReplace === '' ? { name: 'home' } : store.state.loginReplace
                    );
                }
                //登出導頁
                else if (old === 6 && val === 3) {
                    router.replace({ name: 'home' });
                }
            },
            //Token失效，重登，導頁
            '$store.state.reTaken': function(val) {
                this[LOGIN_REP]({ name: this.$route.name });
                router.replace({ name: 'login' });
            },
        },
        created() {
            this[HAS_SES]();
        },
        mounted() {
            //全站載入效果出場
            document.getElementById('init').style.display = 'none'
            window.onresize = this.onResize
            this.onResize()
            let socket = io.connect(ENV_SERVER);
            socket.on('data', (data) => {
                this[PUSH_MESSAGE](data)
            })
        },
    });

    //全局钩子
    router.beforeEach((to, from, next) => {
        //如果沒登入只能到首頁或登入頁，否則一律進入登入頁
        if (to.name !== 'login' && to.name !== 'home' && !vm.isLogin) {
            vm[LOGIN_REP]({ name: to.name });
            router.replace({ name: 'login' });
        } else {
            next();
        }
    });

}
main()
