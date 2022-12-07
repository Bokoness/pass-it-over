<template>
  <div class="center-all-col page">
    <div class="center-all-col">
      <v-img
          src="/logo.png"
      />
      <clap-way-btn class="mt-10"/>
    </div>
  </div>
</template>

<script>
import ClapWayBtn from "@/components/generics/ClapWayBtn"

export default {
  name: "WelcomeView",
  components: {ClapWayBtn},
}
</script>

<style scoped>
.page {
  background-color: #092C58;
  height: 100%;
  width: 100%;
}
</style>
