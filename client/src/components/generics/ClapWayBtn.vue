<template>
  <v-btn
      x-large
      color="#fff"
      light
      height="65px"
      :href="clapLoginUrl"
  >
		<span
        style="color: #092C58;font-size: 1.6rem"
        class="ml-4"
    >התחברות</span>
    <v-img
        src="/ClapWay-light.svg"
        max-width="130"
    />
  </v-btn>
</template>

<script>
export default {
  name: "ClapWayBtn",
  data() {
    return {
      clapLoginUrl: ""
    }
  },
  async mounted() {
    this.clapLoginUrl = await this.$store.dispatch('auth/clapLogin')
  }
}
</script>
