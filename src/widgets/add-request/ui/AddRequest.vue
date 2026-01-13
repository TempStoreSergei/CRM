<template>
  <PopUp @onClose="closeAddRequest"
         @onOpen="openAddRequest"
         :data="{
            title: 'Add Request?',
            open: state.showAddRequest
          }">
    <template #content>
        <div class="add-request__radio">
          <Radio
            :data="{
                    categories: ['Vacation', 'Stick Leave'],
                    title: 'Request Type',
                }"
          />
        </div>
        <Tabs
          :data="{
            tabs: tabs,
            marginCorner: 'medium',
            activeTab: store.activeTab
          }"
          @onTab="handlerChangeTab"
        >
          <template #Days>
            <hr>
            <DataPiker :data="{}"/>
            <hr>
          </template>
          <template #Hours>
            <hr>
            <DataPiker :data="{}"/>
            <hr>
            <div class="add-request__time">
              <UIInput
                    :data="{
                  type: 'text',
                  title: 'From',
                  placeholder: '9:00 AM',
                  iconName: 'clock',
                  isReadonly: true,
                  name: 'from'
                }"
              />
              <UIInput
                :data="{
                  type: 'text',
                  title: 'To',
                  placeholder: '1:00 AM',
                  iconName: 'clock',
                  isReadonly: true,
                  name: 'from'
                }"
              />
            </div>
          </template>
        </Tabs>
    </template>
    <template #bottom>
      <div class="add-request__actions">
        <ActionButton
          class="add-request__comment"
          :data="{
             iconName: 'edit'
          }"/>
        <UiButton
          :data="{
            type: 'button',
            isFull: true,
            title: 'Send Request'
          }"/>
      </div>
    </template>
  </PopUp>
</template>

<script setup lang="ts">
import { PopUp } from '@/entities/popup'
import { UiButton } from '@/shared/ui/button'
import { lock, unlock } from "@/shared/lib/utils/isBlockScroll";
import { useModalStore } from '@/entities/add-modal'
import { storeToRefs } from 'pinia'
import { Tabs } from '@/shared/ui/tabs'
import { UIInput } from '@/shared/ui/input'
import { DataPiker } from '@/shared/ui/data-picker'
import { ActionButton } from '@/shared/ui/action-button'
import { Radio } from '@/shared/ui/radio'

const modalStore = useModalStore();

const { state } = storeToRefs(modalStore);

const store = reactive({
  activeTab: 0
})

const tabs = [
  { label: 'Days' },
  { label: 'Hours' }
]

const handlerChangeTab = (value: number) => {
  store.activeTab = value;
}

const closeAddRequest = () => {
  state.value.showAddRequest = false
  unlock()
};

const openAddRequest = () => {
  lock()
};
</script>


<style lang="scss">
  @import "style.module";
</style>
