<template>
  <div class="wrapper_big-margin">
    <section class="event-container">
      <TitleWithLink :data="{
        title: {
          title: $t('events.title')
        },
        link: {
          title: $t('common.viewAll'),
          to: '/nears-events'
        },
        class: 'wrapper events__title'
      }">
        <template #content>
          <div v-if="isLoading" class="events__loading">{{ $t('common.loading') }}</div>
          <section v-else class="events">
            <CardEvent
              v-for="event in events"
              :key="event.id"
              :data="{
                day: formatDay(event.startDate),
                startTime: formatTime(event.startDate),
                title: event.title,
                time: calculateDuration(event.startDate, event.endDate),
                priority: event.type === 'deadline' ? 'high' : 'medium'
              }"
            />
          </section>
        </template>
      </TitleWithLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TitleWithLink } from '@/entities/grop-title'
import CardEvent from '@/entities/event/ui/card/CardEvent.vue'
import { eventsService, type Event } from '@/shared/api'
import { format, differenceInHours, isToday, isTomorrow } from 'date-fns'
import { ru, enUS } from 'date-fns/locale'

const { t, locale } = useI18n();

const events = ref<Event[]>([])
const isLoading = ref(true)

const getDateLocale = () => locale.value === 'ru' ? ru : enUS;

const formatDay = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) return t('calendar.today')
    if (isTomorrow(date)) return t('calendar.tomorrow')
    return format(date, 'd MMM', { locale: getDateLocale() })
}

const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm')
}

const calculateDuration = (start: string, end: string) => {
    const hours = differenceInHours(new Date(end), new Date(start))
    const hourLabel = locale.value === 'ru' ? 'ч' : 'h';
    return hours > 0 ? `${hours}${hourLabel}` : `1${hourLabel}`
}

const loadEvents = async () => {
    isLoading.value = true
    try {
        const now = new Date()
        const weekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const response = await eventsService.getEvents({
            startDate: now.toISOString(),
            endDate: weekLater.toISOString(),
        })
        events.value = response.data.slice(0, 7)
    } catch (error) {
        console.error('Failed to load events:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadEvents()
})
</script>


<style lang="scss">
  @import "style.module";
</style>
