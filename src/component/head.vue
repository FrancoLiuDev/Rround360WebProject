<style>
#head {
    &.navbar {
        border-radius: 0px;
    }
}
</style>
<template>
    <nav class="navbar navbar-inverse" id="head">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="/">OverView Pro W2</a>
            </div>
            <ul class="nav navbar-nav">
                <li>
                    <router-link :to="{name:'r360'}">R360</router-link>
                </li>
                <li>
                    <router-link :to="{name:'h360'}">H360</router-link>
                </li>
                <li>
                    <router-link :to="{name:'v360'}">V360</router-link>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li v-if="loginStep===1">
                    <router-link :to="{name:'login'}"><span class="glyphicon glyphicon-user"></span> Login</router-link>
                </li>
                <li v-if="loginStep===2"><a href="#" @click.prevent="logOut"><span class="glyphicon glyphicon-log-in"></span> LogOut</a></li>
            </ul>
        </div>
        <confirm-alert v-if="showlogoutAlert" @confirm="onOutConfirm" @close="onOutClose">{{ $t('head.isLogOut')}}</confirm-alert>
    </nav>
</template>
<script>
import Vuex from 'vuex';
import {
    LOGOUT,
} from 'types';
export default {
    data: function() {
        return {
            showlogoutAlert: false,
        }
    },
    computed: {
        //登入顯示狀態 0-loading 1未登入 2登入中
        loginStep() {
            switch (this['authModules'].adminStep) {
                case 0: //未檢查
                    return 0
                case 1: //登入檢查中
                    return 0
                case 2: //已登入
                    return 2
                case 3: //未登入
                    return 1
                case 4: //登入中
                    return 0
                case 5: //登入失敗
                    return 1
                case 6: //登出中
                    return 0
            }
        },
        ...Vuex.mapState(['authModules']),
    },
    methods: {
        //按下登出
        logOut() {
            this.showlogoutAlert = true;
        },
        //登出alert退出
        onOutClose() {
            this.showlogoutAlert = false;
        },
        //確定登出
        onOutConfirm() {
            this.showlogoutAlert = false;
            this[LOGOUT]();
        },
        ...Vuex.mapActions([LOGOUT]),
    }
}
</script>
