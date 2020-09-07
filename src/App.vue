<template>
  <div id="app">
    <span v-if='usersLoadingState'>Loading users...</span>
    <autocomplete v-else :items="userList" :selected="true" :avatar='true' @selected='getSelectedItem' />
  </div>
</template>

<script>
import autocomplete from './components/Autocomplete.vue'
import {mapGetters, mapActions} from 'vuex' 
export default {
  name: 'App',
  components: {
    autocomplete
  },
  data() {
    return {
      selectedItem: null
    }
  },
  computed: {
    ...mapGetters(['users', 'usersLoadingState']),
    userList(){
      return this.users.map(user=>{
        return {
          text: user.name,
          value: user.id,
          avatar: user.avatar
        }
      })
    }
  },
  methods: {
    ...mapActions(['getUsers']),
    getSelectedItem(item){
      this.selectedItem = item
    }
  },
  created(){
    this.getUsers()    
  }
}
</script>

<style>

body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
</style>
