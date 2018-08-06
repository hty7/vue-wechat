<template>
  <v-app id="inspire" :dark="controlsOption.hints">
    <Vheader></Vheader>
    <Vmenu></Vmenu>
    <v-content ref="mainContent">
      <v-container fluid ref="mainContainer">
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import {mapGetters} from 'vuex'
import Vheader from '@/components/header'
import Vmenu from './menu'
export default {
  components: {
    Vheader, Vmenu
  },
  data: () => ({}),
  computed: {
    ...mapGetters(['controlsOption'])
  },
  methods: {
  }
}
</script>
