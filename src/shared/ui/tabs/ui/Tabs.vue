<template>
  <article class="tab">
    <div :class="classes">
      <button v-for="(tab, index) in data.tabs"
              class="tab__button"
              :key="index" @click="changeTab(index)"
              :class="{ 'tab__button_active': data.activeTab === index }">
        <span class="tab__button-text">
          {{ tab.label }}
        </span>
      </button>
    </div>
    <transition name="fade" mode="out-in">
      <div :key="data.activeTab" class="tab__content">
        <slot :name="data.tabs[data.activeTab].label"/>
      </div>
    </transition>
  </article>
</template>

<script setup lang="ts">
import type { ITabs } from "@/shared/ui/tabs";

const emit = defineEmits(['onTab'])

const props = defineProps<{
  data: ITabs
}>()

const classes = computed(() => {
  const temp = [];
  temp.push('tab__buttons')
  switch (props.data.marginCorner) {
    case 'medium':
      temp.push('tab__buttons_medium')
      break;
    case 'small':
      temp.push('tab__buttons_small')
      break;
  }
  return temp;
})

const changeTab = (index: number) => {
  emit('onTab', index)
};
</script>

<style lang="scss">
 @import "styles.module";
</style>
