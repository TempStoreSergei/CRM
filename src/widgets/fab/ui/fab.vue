<template>
    <BottomSheet
        @onClose="close"
        @onOpen="open"
        :data="{
            open: state.showAdd,
            title: 'Add..',
        }"
    >
        <template #content>
            <section class="fab-content">
                <ul class="fab-content__list">
                    <li
                        v-for="(item, index) in fabConfig"
                        :key="index"
                        @click="addSomething"
                        class="fab-content__element"
                    >
                        <div class="fab-content__image-container">
                            <IconBase
                                :data="{
                                    iconName: item.icon,
                                    iconColor: '#3F8CFF',
                                }"
                            />
                        </div>
                        <span class="fab-content__text">{{ item.text }}</span>
                    </li>
                </ul>
            </section>
        </template>
    </BottomSheet>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { BottomSheet } from '@/entities/bottom-sheet';
import { fabConfig } from '@/widgets/fab';
import { IconBase } from '@/shared/ui/icon-base';
import { lock, unlock } from '@/shared/lib/utils/isBlockScroll';
import { useModalStore } from '@/entities/add-modal';

const modalStore = useModalStore();

const { state } = storeToRefs(modalStore);

const open = () => {
  lock();
};

const addSomething = () => {
  state.value.showAddEmployee = true;
  close();
};

const close = () => {
  state.value.showAdd = false;
  unlock();
};
</script>

<style scoped lang="scss">
  @import "style.module";
</style>
