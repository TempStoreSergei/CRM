<template>
    <div class="wrapper">
        <section class="calendar">
            <DataPiker
                :data="{
                    events: state.events,
                }"
                @dateSelect="handleDateSelect"
            />
            <hr>
            <Title
                v-if="state.selectedDate"
                class="calendar__title"
                :data="{
                    title: formatSelectedDate(state.selectedDate),
                    size: 'small',
                    isHighLeading: true,
                    marginBottom: 'medium',
                }"
            />

            <div v-if="isLoadingEvents" class="calendar__loading">
                {{ $t('common.loading') }}
            </div>
            <div v-else-if="state.selectedEvents.length === 0" class="calendar__no-events">
                {{ $t('calendar.noEvents') }}
            </div>
            <div v-else class="calendar__events">
                <article
                    class="event-label calendar__event"
                    v-for="event in state.selectedEvents"
                    :key="event.id"
                >
                    <div class="event-label__content">
                        <Title
                            :data="{
                                title: event.title,
                                size: 'small',
                                isHighLeading: true,
                            }"
                        />
                        <div class="event-label__status">
                            <span class="event-label__time">{{ formatEventTime(event) }}</span>
                            <IconBase
                                :data="{
                                    iconName: 'arrowDown',
                                }"
                            />
                        </div>
                    </div>
                </article>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { DataPiker } from '@/shared/ui/data-picker';
import { Title } from '@/shared/ui/title';
import { IconBase } from '@/shared/ui/icon-base';
import { eventsService, type Event } from '@/shared/api';
import { format, differenceInHours, startOfDay, endOfDay } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

const { t, locale } = useI18n();

const state = reactive({
  events: new Map<number, number>(),
  selectedDate: new Date() as Date | null,
  selectedEvents: [] as Event[],
  allEvents: [] as Event[],
});

const isLoadingEvents = ref(false);

const getDateLocale = () => locale.value === 'ru' ? ru : enUS;

const formatSelectedDate = (date: Date) => {
    return format(date, 'MMMM d, yyyy', { locale: getDateLocale() });
};

const formatEventTime = (event: Event) => {
    const hours = differenceInHours(new Date(event.endDate), new Date(event.startDate));
    const hourLabel = locale.value === 'ru' ? 'ч' : 'h';
    return hours > 0 ? `${hours}${hourLabel}` : `1${hourLabel}`;
};

const handleDateSelect = (date: Date) => {
    state.selectedDate = date;
    filterEventsForDate(date);
};

const filterEventsForDate = (date: Date) => {
    const dayStart = startOfDay(date).getTime();
    const dayEnd = endOfDay(date).getTime();
    
    state.selectedEvents = state.allEvents.filter(event => {
        const eventStart = new Date(event.startDate).getTime();
        return eventStart >= dayStart && eventStart <= dayEnd;
    });
};

const loadEvents = async () => {
    isLoadingEvents.value = true;
    try {
        // Get events for the current month
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        
        const response = await eventsService.getEvents({
            startDate: monthStart.toISOString(),
            endDate: monthEnd.toISOString(),
        });
        
        state.allEvents = response.data;
        
        // Build event count map for calendar dots
        const eventCounts = new Map<number, number>();
        state.allEvents.forEach((event) => {
            const startTime = new Date(event.startDate);
            const dayTimestamp = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate()).getTime();
            
            if (eventCounts.has(dayTimestamp)) {
                eventCounts.set(dayTimestamp, eventCounts.get(dayTimestamp)! + 1);
            } else {
                eventCounts.set(dayTimestamp, 1);
            }
        });
        
        state.events = eventCounts;
        
        // Filter events for today by default
        if (state.selectedDate) {
            filterEventsForDate(state.selectedDate);
        }
    } catch (error) {
        console.error('Failed to load events:', error);
    } finally {
        isLoadingEvents.value = false;
    }
};

onMounted(() => {
    loadEvents();
});
</script>

<style lang="scss">
  @import "style.module";

  .date-selector {
    display: flex;
    justify-content: space-between;
  }
  
  .calendar__loading,
  .calendar__no-events {
    padding: 20px;
    text-align: center;
    color: #7D8592;
  }
</style>
