import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        users: [],
        isUsersLoading: false,
    },
    getters: {
        users(state){
            return state.users
        },
        usersLoadingState(state){
            return state.isUsersLoading
        }
    },
    mutations: {
        setUsers(state, payload){
            state.users = payload
        },
        setUsersLoadingState(state, payload){
            state.isUsersLoading = payload
        }
    },
    actions: {
        async getUsers({state, commit}){
            commit('setUsersLoadingState', true)
            await axios('https://randomuser.me/api/?results=5000')
            .then((res)=>{
                let arr = []
                for(let i=0; i<=8; i++){
                    let mappedCopy = res.data.results.map(user=>{
                        return {
                            name: `${user.name.first} ${user.name.last} --${i+1}`,
                            id: uuidv4(),
                            avatar: user.picture.thumbnail
                        }
                    })
                    arr = arr.concat(mappedCopy)
                }
                commit('setUsers', arr)
            })
            .finally(()=>{
                commit('setUsersLoadingState', false)
            })
        }
    }
})
