<template>
    <UIInput
        @click="handlerOpenSelectTime"
        :data="{
            type: 'text',
            title: 'Time',
            placeholder: 'Select time',
            iconName: 'clock',
            isReadonly: true,
            name: 'task',
            value: selectTime,
        }"
    />
    <BottomSheet
        :data="{
            title: 'Time',
            open: state.open,
            notDraggable: true
        }"
        @onClose="close"
        @onOpen="open"
    >
        <template #content>
          <Tabs
            @onTab="handlerChangeTab"
            :data="{
                    tabs,
                    activeTab: state.activeTab,
                }"
          >
            <template #From>
              <div class="date-selector">
                <TimePicker
                  :data="{
                        source: generateHours(),
                        count: 24,
                        value: state.fromHour,
                        sensitivity: 0.8,
                    }"
                  @onChange="setHoursFrom($event)"
                />
                <TimePicker
                  :data="{
                        source: generateMinutes(),
                        count: 20,
                        sensitivity: 0.8,
                        value: state.fromMinutes,
                    }"
                  @onChange="setMinutesFrom($event)"
                />
              </div>
            </template>
            <template #To>
              <div class="date-selector">
                <TimePicker
                  :data="{
                        source: generateHours(),
                        count: 24,
                        value: state.toHour,
                        maxScrollValue: 24,
                        minScrollValue: state.fromHour,
                        sensitivity: 0.8,
                    }"
                  @onChange="setHoursTo($event)"
                />
                <TimePicker
                  :data="{
                        source: generateMinutes(),
                        count: 20,
                        sensitivity: 0.8,
                        maxScrollValue: 60,
                        minScrollValue: state.fromMinutes + 5,
                        value: state.toMinutes,
                    }"
                  @onChange="setMinutesTo($event)"
                />
              </div>
            </template>
          </Tabs>
        </template>
        <template #actions>
          <UiButton :data="{
            type: 'button',
            title: 'Select time',
            isFull: true,
          }"/>
        </template>
    </BottomSheet>
</template>

<script setup lang="ts">
import { TimePicker } from '@/shared/ui/time-picker';
import { BottomSheet } from '@/entities/bottom-sheet';
import { UIInput } from '@/shared/ui/input';
import { lock, unlock } from '@/shared/lib/utils/isBlockScroll'
import { Tabs } from '@/shared/ui/tabs'
import { UiButton } from '@/shared/ui/button'

const tabs = [
  { label: 'From' },
  { label: 'To' }
]

const state = reactive({
  open: false,
  fromHour: 0,
  fromMinutes: 0,
  toHour: 0,
  toMinutes: 0,
  activeTab: 0,
});

const handlerChangeTab = (value: number) => {
  state.activeTab = value;
}
const setCurrentTime = () => {
  const now = new Date();
  state.fromHour = now.getHours();
  state.fromMinutes = now.getMinutes();
  state.toHour = now.getHours();
  state.toMinutes = (state.fromMinutes + 5) & 60;
};

const selectTime = computed(() => `from ${state.fromHour}:${state.fromMinutes} to ${state.toHour}:${state.toMinutes}`)

const handlerOpenSelectTime = () => {
  state.open = true;
}

const setHoursFrom = (hour: number) => {
  state.fromHour = hour;
};

const setMinutesFrom = (minutes: number) => {
  state.fromMinutes = minutes;
};

const setHoursTo = (hour: number) => {
  state.toHour = hour;
};

const setMinutesTo = (minutes: number) => {
  state.toMinutes = minutes;
};
const generateHours = () => new Array(24).fill(1).map((v, i) => ({ value: i, text: i }));

const generateMinutes = () => new Array(60).fill(1).map((v, i) => ({ value: i, text: i }));

const open = () => {
  lock();
};
const close = () => {
  state.open = false;
  unlock();
};

onMounted(() => setCurrentTime());
</script>
