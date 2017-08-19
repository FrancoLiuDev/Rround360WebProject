import axios from 'axios'
import {
    H360_META,
    H360_META_EDIT,
} from 'types';
export default {
    state: {
        //狀態旗標 0未查詢 -1服務error 1查詢中 2已完成 3錯誤訊息
        step: 0,
        //返回資料
        data: null,
        //mata
        meta: {
            name: 'loading..',
            about: 'loading..',
        }
    },
    mutations: {
        changeStep(state, step) {
            state.step = step;
        },
        setData(state, data) {
            state.data = data;
        },
        setMata(state, data) {
            state.meta = data;
        },
    },
    getters: {
        //h360 meta 是否查詢/修改中
        isH360MetaLoading(state) {
            return state.step === 1;
        },
        //是否有錯誤訊息，有的話請輸出state.data
        isH360MetaError(state) {
            return state.step === 3 || state.step === -1;
        },
    },
    actions: {
        //查詢H360 meta
        async [H360_META]({ state, commit, rootState }, zipkey) {
            commit('changeStep', 1);
            try {
                let response = await axios({
                    url: '/api/detail/' + zipkey,
                    method: 'get',
                    baseURL: ENV_SERVER,
                })
                if (response.data.result) {
                    commit('setMata', response.data.data.data);
                    commit('changeStep', 2);
                } else {
                    commit('setData', response);
                    commit('changeStep', 3);
                }
            } catch (err) {
                commit('setData', err);
                commit('changeStep', -1);
            }
        },
        //修改360 meta
        async [H360_META_EDIT]({ state, commit, rootState }, {
            zipkey,
            name,
            about,
        }) {
            commit('changeStep', 1);
            let post = {};
            if (name) {
                post.name = name;
            }
            if (about) {
                post.about = about;
            }
            try {
                let response = await axios({
                    url: '/api/detail_edit/' + zipkey,
                    method: 'post',
                    baseURL: ENV_SERVER,
                    data: post,
                })
                if (response.data.result) {
                    //修改成功後取回新資料
                    let response = await axios({
                        url: '/api/detail/' + zipkey,
                        method: 'get',
                        baseURL: ENV_SERVER,
                    })
                    if (response.data.result) {
                        commit('setMata', response.data.data.data);
                        commit('changeStep', 2);
                    } else {
                        commit('setData', response.data.data);
                        commit('changeStep', 3);
                    }
                } else {
                    commit('setData', response.data.data);
                    commit('changeStep', 3);
                }
            } catch (err) {
                commit('setData', err);
                commit('changeStep', -1);
            }
        },
    }
}
