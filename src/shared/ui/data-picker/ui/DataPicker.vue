<template>
  <article class="date-picker">
    <header class="date-picker__header" v-if="curentMonth">
      <transition name="fade" mode="out-in">
        <Title :key="curentMonth"
               class="date-picker__title"
               ref="reference"
               :data="{
                  title: curentMonth,
                  size: 'medium',
                  isHighLeading: true
               }"
        />
      </transition>
      <IconBase
        class="date-picker__arrow_left"
        @click="handlePrevMonth"
        :data="{
          iconName: 'arrowLeftLong'
        }"/>
      <IconBase
        class="date-picker__arrow_right"
        @click="handleNextMonth"
        :data="{
          iconName: 'arrowRightLong'
        }"/>
    </header>
    <table class="date-picker__data">
      <thead>
      <tr class="date-picker__days-name">
        <td class="date-picker__day-name">{{ $t('calendar.days.mon') }}</td>
        <td class="date-picker__day-name">{{ $t('calendar.days.tue') }}</td>
        <td class="date-picker__day-name">{{ $t('calendar.days.wed') }}</td>
        <td class="date-picker__day-name">{{ $t('calendar.days.thu') }}</td>
        <td class="date-picker__day-name">{{ $t('calendar.days.fri') }}</td>
      </tr>
      </thead>
      <transition name="fade" mode="out-in">
        <tbody class="date-picker__month" :key="curentMonth">
          <tr v-for="(row, rowIndex) in curentDates" :key="rowIndex" class="date-picker__days">
            <td v-for="date in row" 
                :key="date.day" 
                :class="getDateClasses(date)"
                @click="handleDateClick(date)">
              {{ date.day }}
              <div class="date-picker__event"
                   v-for="dotIndex in getCountOfEventInDay(date.timestamp)"
                   :key="dotIndex"/>
            </td>
          </tr>
        </tbody>
      </transition>
    </table>
    <hr class="date-picker__line">
  </article>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { type IDatePicker } from '../../link'
import { Title } from '@/shared/ui/title';
import { Calendar, DateInfo } from "./../index";
import { IconBase } from '@/shared/ui/icon-base'
import { useFloating } from '@floating-ui/vue'
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

const { locale } = useI18n();

const reference = ref(null);
const floating = ref(null);
const {floatingStyles} = useFloating(reference, floating);

const emit = defineEmits<{
  dateSelect: [date: Date]
}>();

const calendar = reactive(new Calendar());
const selectedTimestamp = ref<number | null>(null);

const curentDates = computed(() => calendar.getCalendar());
const curentMonth = computed(() => {
  const dateLocale = locale.value === 'ru' ? ru : enUS;
  return format(calendar.getCurrentDate(), 'MMMM, yyyy', { locale: dateLocale });
});

const getDateClasses = (date: DateInfo) => {
  return {
    'date-picker__day': true,
    'date-picker__day_prev-month': date.isPrevMonth,
    'date-picker__day_selected': date.timestamp === selectedTimestamp.value,
    'date-picker__day_next-month': date.isNextMonth,
  };
};

const getCountOfEventInDay = (timestamp: number) => {
  if (props.data.events.has(timestamp)) {
    return props.data.events.get(timestamp)
  } else {
    return 0
  }
};

const handleDateClick = (date: DateInfo) => {
  selectedTimestamp.value = date.timestamp;
  emit('dateSelect', new Date(date.timestamp));
};

const handlePrevMonth = () => {
  calendar.goToPreviousMonth();
};

const handleNextMonth = () => {
  calendar.goToNextMonth();
};

const props = defineProps<{
  data: IDatePicker
}>();

// Select today by default
onMounted(() => {
  const today = new Date();
  const todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  selectedTimestamp.value = todayTimestamp;
  emit('dateSelect', today);
});

</script>


<style lang="scss">
 @import "style.module";
</style>
