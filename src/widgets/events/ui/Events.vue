<template>
  <div class="wrapper_big-margin">
    <section class="event-container">
      <TitleWithLink :data="{
        title: {
          title: 'Events'
        },
        link: {
          title: 'View all',
          to: '/nears-events'
        },
        class: 'wrapper events__title'
      }">
        <template #content>
          <div v-if="isLoading" class="events__loading">Загрузка...</div>
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
import { useRouter } from 'vue-router'
import { TitleWithLink } from '@/entities/grop-title'
import CardEvent from '@/entities/event/ui/card/CardEvent.vue'
import { eventsService, type Event } from '@/shared/api'
import { format, differenceInHours, isToday, isTomorrow } from 'date-fns'
import { ru } from 'date-fns/locale'

const router = useRouter()

const events = ref<Event[]>([])
const isLoading = ref(true)

const formatDay = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) return 'Сегодня'
    if (isTomorrow(date)) return 'Завтра'
    return format(date, 'd MMM', { locale: ru })
}

const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm')
}

const calculateDuration = (start: string, end: string) => {
    const hours = differenceInHours(new Date(end), new Date(start))
    return `${hours}ч`
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
