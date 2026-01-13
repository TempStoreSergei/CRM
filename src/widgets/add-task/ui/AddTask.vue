<template>
    <PopUp
        @onClose="closeAddTask"
        @onOpen="openAddTask"
        :data="{
            title: 'Add Task?',
            open: state.showAddTask,
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
                        title: 'Task Name',
                        placeholder: '1:00 AM',
                        iconName: 'clock',
                        isReadonly: true,
                        name: 'task',
                    }"
                />
                <UISelect
                    :data="{
                        text: '',
                    }"
                />
                <UIInput
                    :data="{
                        type: 'text',
                        title: 'Task Name',
                        placeholder: '1:00 AM',
                        iconName: 'clock',
                        isReadonly: true,
                        name: 'task',
                    }"
                />
                <UIInput
                    :data="{
                        type: 'text',
                        title: 'Task Name',
                        placeholder: '1:00 AM',
                        iconName: 'clock',
                        isReadonly: true,
                        name: 'task',
                    }"
                />
                <UISelect
                    :data="{
                        text: '',
                    }"
                />
                <UISelect
                    :data="{
                        text: '',
                    }"
                />
                <UiTextArea
                    :data="{
                        name: 'task',
                        title: 'Description',
                        placeholder: 'Add some description of the request',
                    }"
                />
            </form>
        </template>
        <template #bottom>
            <div class="add-task__save">
                <UiButton
                    :data="{
                        title: 'Save Task',
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
import { Link } from '@/shared/ui/link';
import { UIInput } from '@/shared/ui/input';
import { UiTextArea } from '@/shared/ui/textarea';

const modalStore = useModalStore();

const { state } = storeToRefs(modalStore);
const closeAddTask = () => {
  state.value.showAddTask = false;
  unlock();
};
const openAddTask = () => {
  lock();
};
</script>

<style lang="scss">
  @import "style.module";

</style>
