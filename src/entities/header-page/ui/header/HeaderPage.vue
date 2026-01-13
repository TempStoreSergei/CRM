<template>
  <div class="wrapper wrapper_title">
    <Header
      :data="{
      title: getHeaderTitle
    }"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Header } from '@/shared/ui/header'

const { t } = useI18n()

type ConfigItem = { route: string; titleKey: string }
const config: ConfigItem[] = [
  { route: 'home', titleKey: 'pages.dashboard' },
  { route: 'nears-events', titleKey: 'pages.dashboard' },
  { route: 'calendar', titleKey: 'pages.calendar' },
  { route: 'projects', titleKey: 'pages.projects' },
  { route: 'vacations', titleKey: 'pages.vacations' },
  { route: 'employees', titleKey: 'pages.employees' },
  { route: 'messenger', titleKey: 'pages.messenger' },
  { route: 'profile', titleKey: 'pages.profile' },
  { route: 'my-profile', titleKey: 'pages.myProfile' },
]

const getHeaderTitle = computed(() =>{
  const router = useRouter()
  const currentRoute = router.currentRoute.value.name
  const titleConfig = config.find(item => item.route === currentRoute)

  return titleConfig ? t(titleConfig.titleKey) : t('pages.error')
})
</script>
