<style>
#login {
    padding: 200px 0px 0px 0px;
}
</style>
<template>
    <div id="login">
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <div class="form-group">
                    <input type="text" class="form-control" id="exampleInputEmail1" :placeholder="$t('login.uid')" maxlength="32" onpaste="return false" v-model.trim="loginVal.uid" @click="clearLoginError">
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" id="exampleInputEmail1" :placeholder="$t('login.upw')" onpaste="return false" v-model.trim="loginVal.ups" @click="clearLoginError">
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-primary btn-lg btn-block" @click="login">{{ $t('login.login')}}</button>
                </div>
                <transition name="fadeOut">
                    <div class="alert alert-danger" v-if="loginErrorMessage"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> <strong>{{loginErrorMessage}}</strong></div>
                </transition>
                <!-- <code>{{authModules.loginResponse}}</code> -->
            </div>
        </div>
    </div>
</template>
<script>
import Vuex from 'vuex';
import {
    HAS_SES,
    LOGIN,
    LOGOUT,
    CLEAR_LOGIN_ERROR,
} from 'types';
export default {
    data: function() {
        return {
            loginVal: {
                uid: 'leedian',
                ups: '1234',
            }
        }
    },
    computed: {
        loginErrorMessage() {
            switch (this.loginErrorCode) {
                case '00.002': //空白
                    return this.$t("login.code.00_002")
                    break
                case '02.002':
                    return this.$t("login.code.02_002")
                    break
                case '01.005':
                    return this.$t("login.code.01_005")
                    break
                case '01.006':
                    return this.$t("login.code.01_006")
                    break
                case '500':
                    return this.$t("login.code.01_006")
                    break
                default:
                    return ''
            }
        },
        ...Vuex.mapState(['authModules']),
        ...Vuex.mapGetters(['loginErrorCode']),
    },
    methods: {
        login() {
            this[LOGIN](this.loginVal);
        },
        logout() {
            this[LOGOUT]();
        },
        hasSES() {
            this[HAS_SES]();
        },
        clearLoginError() {
            this['CLEAR_LOGIN_ERROR']()
        },
        ...Vuex.mapActions([LOGIN, HAS_SES, LOGOUT, CLEAR_LOGIN_ERROR]),
    }
}
</script>
