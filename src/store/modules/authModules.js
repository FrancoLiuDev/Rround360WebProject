import {
    HAS_SES,
    LOGIN,
    LOGOUT,
    LOGIN_REP,
    CLEAR_LOGIN_ERROR,
} from 'types';
import axios from 'axios';
import md5 from 'md5';
export default {
    state: {
        //登入狀態 0未檢查 1登入檢查中 2已登入 3未登入 4登入中 5登入失敗 -1服務器失敗
        //6登出中
        adminStep: 0,
        loginResponse: null, //登入回傳值
    },
    getters: {
        isLogin: (state) => {
            return state.adminStep === 2 ? true : false;
        },
        /**
         * 錯誤訊息
         */
        loginErrorCode: (state) => {
            if (!state.loginResponse) {
                return ''
            }
            switch (state.loginResponse.code) {
                case '00.002': //空白
                    return state.loginResponse.code
                    break
                case '02.002':
                    return state.loginResponse.code
                    break
                case '01.005':
                    return state.loginResponse.code
                    break
                case '01.006':
                    return state.loginResponse.code
                    break
                default:
                    return '500'
            }
        },
    },
    mutations: {
        changeAdminStep(state, payload) {
            state.adminStep = payload;
        },
        loginRes(state, payload) {
            state.loginResponse = payload;
        },
    },
    actions: {
        async [HAS_SES]({ commit, rootState }) {
            rootState.isLoading = true; //全頁loading畫面
            commit('changeAdminStep', 1);
            try {
                let response = await axios({
                    url: ENV_CHKTEN_API,
                    method: 'get',
                    baseURL: ENV_SERVER,
                });
                if (response.data.result === true) {
                    commit('changeAdminStep', 2);
                } else {
                    commit('changeAdminStep', 3);
                }
            } catch (err) {
                commit('loginRes', err);
                commit('changeAdminStep', -1);
            }
            rootState.isLoading = false;
        },
        async [LOGIN]({ state, commit, rootState }, payload) {
            //登入欄位檢查
            if (payload.uid.length === 0) {
                commit('loginRes', '请输入您的帐号');
                return
            } else if (payload.ups.length === 0) {
                commit('loginRes', '请输入您的密码');
                return
            }
            commit('changeAdminStep', 4);
            rootState.isLoading = true;
            try {
                // let response = await axios.post('http://127.0.0.1/sigin/login');
                let response = await axios({
                    url: ENV_LOGIN_API,
                    method: 'post',
                    baseURL: ENV_SERVER,
                    data: {
                        uid: payload.uid,
                        ups: md5(payload.ups),
                    },
                });
                if (response.data && response.data.result === true) {
                    commit('changeAdminStep', 2);
                } else {
                    commit('loginRes', response.data);
                    commit('changeAdminStep', 5);
                }
            } catch (err) {
                commit('loginRes', err);
                commit('changeAdminStep', -1);
            }
            rootState.isLoading = false;
        },
        async [LOGOUT]({ commit, rootState }) {
            commit('changeAdminStep', 6);
            rootState.isLoading = true;
            try {
                await axios({
                    url: ENV_LOOUT_API,
                    method: 'get',
                    baseURL: ENV_SERVER,
                });
                commit('changeAdminStep', 3);
            } catch (err) {
                commit('loginRes', err);
                commit('changeAdminStep', -1);
            }
            rootState.isLoading = false;
        },
        //紀錄登入轉止
        [LOGIN_REP]({ state, commit, rootState }, payload) {
            rootState.loginReplace = payload;
        },
        //清空錯誤訊息
        [CLEAR_LOGIN_ERROR]({ commit }) {
            commit('loginRes', null);
        },
    },
}
