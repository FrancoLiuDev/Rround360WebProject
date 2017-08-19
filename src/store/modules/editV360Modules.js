import Lazy from 'lazy.js'
import axios from 'axios'

import {
    EDIT_V360_ADD,
    EDIT_V360_DEL,
    EDIT_V360_CLEAR,
    EDIT_V360_META,
} from 'types';
export default {
    state: {
        //送出狀態 -1錯誤 0無狀態 1送出中 2送出完成
        postStep: 0,
        v360List: [],
        name: '',
        about: '',
        cover: '',
        message: '',
        mp4key: '',
    },
    getters: {
        h360List(state) {
            return Lazy(state.v360List).pluck('zipkey').value()
        },
        isV360EditIng(state) {
            return state.postStep === 1 ? true : false
        },
    },
    mutations: {
        clear(state) {
            state.v360List = []
            state.name = ''
            state.about = ''
            state.cover = ''
            state.message = ''
            state.postStep = 0
        },
        add(state, item) {
            item.rad = '' + ~~(Math.random() * 1000) + new Date().getTime()
            state.v360List.push(item)
        },
        del(state, rad) {
            let key = Lazy(state.v360List)
                .map((item) => {
                    return item.rad
                })
                .indexOf(rad)
            if (key !== -1) {
                state.v360List.splice(key, 1)
            }
        },
        setMessage(state, message) {
            state.message = message
        },
        setMeta(state, meta) {
            if (meta.name.length === 0) {
                state.message = '請輸入名稱'
                state.postStep = -1
                return
            }
            if (meta.name.length > 20) {
                state.message = '名稱不能超過20字'
                state.postStep = -1
                return
            }
            if (meta.name.about > 100) {
                state.message = '說明不能超過100字'
                state.postStep = -1
                return
            }
            if (!meta.cover) {
                state.message = '請上傳封面圖'
                state.postStep = -1
                return
            }
            if (state.v360List.length === 0) {
                state.message = '請選擇至少一個H360'
                state.postStep = -1
                return
            }
            state.name = meta.name
            state.about = meta.about
            state.cover = meta.cover
        },
        setPostStep(state, key) {
            state.postStep = key
        },
        setMessage(state, message) {
            state.message = message
        },
        resMp4Kay(state, resData) {
            state.mp4key = resData.mp4
        },
    },
    actions: {
        [EDIT_V360_ADD]({ state, commit, rootState }, item) {
            commit('add', item);
        },
        [EDIT_V360_DEL]({ state, commit, rootState }, item) {
            commit('del', item.rad);
        },
        [EDIT_V360_CLEAR]({ commit }) {
            commit('clear')
            commit('setPostStep', 0)
        },
        async [EDIT_V360_META]({ state, commit, rootState }, meta) {
            commit('setPostStep', 1)
            await new Promise(resolve => {
                setTimeout(() => resolve(), 1)
            })
            commit('setMeta', meta)
            if (state.postStep === 1) {
                try {
                    let response = await axios({
                        url: '/api/h360/v360',
                        method: 'post',
                        data: {
                            name: state.name,
                            about: state.about,
                            cover: state.cover,
                            list: Lazy(state.v360List).pluck('zipkey').value(),
                        },
                        baseURL: ENV_SERVER,
                    })
                    if (response.data.result) {
                        commit('resMp4Kay', response.data)
                        commit('setPostStep', 2)
                    } else {
                        commit('setMessage', response.data)
                        commit('setPostStep', -1)
                    }
                } catch (err) {
                    commit('setMessage', err)
                    commit('setPostStep', -1)
                }
            }
        },
    },
}
