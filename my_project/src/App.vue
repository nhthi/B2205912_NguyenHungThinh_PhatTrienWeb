<template>
  <v-app>
    <BorrowerHeader />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import BorrowerHeader from '@/components/BorrowerHeader.vue'

export default {

  components: {
    BorrowerHeader,

  }
};
</script>
