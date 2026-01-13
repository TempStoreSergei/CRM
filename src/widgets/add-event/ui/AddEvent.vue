<template>
    <PopUp
        @onClose="closeAddEvent"
        @onOpen="openAddTask"
        :data="{
            title: 'Add Event?',
            open: state.showAddEvent,
        }"
    >
        <template #content>
            <form
                class="add-task__form"
                action=""
            >
                <UIInput
                    :data="{
                        type: 'text',
                        title: 'Event Name',
                        placeholder: 'Event Name',
                        name: 'event',
                        value: '',
                    }"
                />
                <UISelect
                    :data="{
                        title: 'Event Category',
                        name: 'category',
                        options: [],
                    }"
                />
                <UISelect
                    :data="{
                        title: 'Priority',
                        name: 'priority',
                        options: [],
                    }"
                />
                <InputTime />
                <UIInput
                    :data="{
                        type: 'text',
                        title: 'Date',
                        placeholder: '1:00 AM',
                        iconName: 'clock',
                        isReadonly: true,
                        name: 'task',
                        value: '',
                    }"
                />
                <UiTextArea
                    :data="{
                        name: 'event',
                        title: 'Description',
                        placeholder: 'Add some description of the event',
                    }"
                />
            </form>
        </template>
        <template #bottom>
            <div class="add-task__save">
                <UiButton
                    :data="{
                        title: 'Save Event',
                        type: 'submit',
                        isFull: true,
                    }"
                />
            </div>
        </template>
    </PopUp>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { PopUp } from '@/entities/popup';
import { UiButton } from '@/shared/ui/button';
import { UISelect } from '@/shared/ui/select';
import { lock, unlock } from '@/shared/lib/utils/isBlockScroll';
import { useModalStore } from '@/entities/add-modal';
import { UIInput } from '@/shared/ui/input';
import { UiTextArea } from '@/shared/ui/textarea';
import { InputTime } from '@/shared/ui/time-picker'

const modalStore = useModalStore();

const { state } = storeToRefs(modalStore);
const closeAddEvent = () => {
  state.value.showAddEvent = false;
  unlock();
};
const openAddTask = () => {
  lock();
};
</script>

<style lang="scss">
  @import "style.module";

</style>
