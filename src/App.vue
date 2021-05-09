<template>
  <img
    alt="Vue logo"
    src="./assets/logo.png"
  >
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IUserService } from '/@/api/services/user'
import { useService } from '/@/hook/userService'
import HelloWorld from '/@/components/HelloWorld.vue'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  },
  created() {
    useService<IUserService>('user').info()
  }
})
</script>
