<template>
  <section class="login-page">
    <LogIn />
  </section>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n';
import LogIn from "@/widgets/logIn/ui/logIn.vue";

const { t } = useI18n();

useHead({
  title: () => `CRM - ${t('auth.signIn')}`
})
</script>

<style lang="scss">
.login-page {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  
  @media (min-width: 1024px) {
    max-width: 480px;
  }
}
</style>
