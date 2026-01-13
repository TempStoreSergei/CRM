<template>
    <PopUp
        @onClose="closeAddEmployee"
        @onOpen="openAddEmployee"
        :data="{
            title: 'Add Employee?',
            open: state.showAddEmployee,
        }"
    >
        <template #content>
            <div class="add-employee__list-member">
                <UISelect
                    :data="{
                        text: '',
                    }"
                />
            </div>
            <Link
                class="add-employee__add"
                :data="{
                    title: 'Add another Member',
                    to: '/',
                    iconLeft: 'addEmployee',
                }"
            />
        </template>
        <template #bottom>
            <div class="add-employee__approve">
                <UiButton
                    :data="{
                        title: 'Approve',
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

const modalStore = useModalStore();

const { state } = storeToRefs(modalStore);
const closeAddEmployee = () => {
  state.value.showAddEmployee = false;
  unlock();
};
const openAddEmployee = () => {
  lock();
};
</script>

<style lang="scss">
  @import "style.module";

</style>
