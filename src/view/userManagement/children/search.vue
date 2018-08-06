<template>
  <v-form v-model="valid">
    <v-layout row wrap>
      <v-flex md3 xs12>
          <v-text-field solo v-model="params.userName" :label="$t('message.name')" single-line clearable></v-text-field>
      </v-flex>&nbsp;
        <v-flex md3 xs12>
          <v-select solo item-text="roleName" item-value="roleId" :items="roleAllList" v-model="params.roleId" label="角色类型"></v-select>
      </v-flex>
      <v-btn color="info" @click="search">
        {{$t('buttom.search')}}
      </v-btn>
    </v-layout>
  </v-form>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data: () => ({
    valid: false,
    params: {
      userName: '',
      roleId: ''
    }
  }),
  watch: {},
  computed: {
    ...mapGetters(['roleAllList'])
  },
  methods: {
    search () {
      this.$emit('search', this.params)
    }
  }
}
</script>

<style scoped>

</style>
