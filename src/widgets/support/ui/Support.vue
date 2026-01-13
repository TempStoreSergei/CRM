<template>
    <PopUp
        @onClose="closeSupport"
        @onOpen="openSupport"
        :data="{
            title: 'Need some Help?',
            open: app.showSupport,
        }"
    >
        <template #content>
            <form class="support">
                <p class="support__text">
                    Describe your question and our specialists will answer you within 24 hours.
                </p>
                <UISelect
                    class="support__select"
                    data=""
                />
                <UiTextArea
                    class="support__textarea"
                    :data="{
                        name: 'problem',
                        title: 'Description',
                        placeholder: 'Add some description of the request',
                    }"
                />
                <UiButton
                    :data="{
                        title: 'Send request',
                        type: 'submit',
                    }"
                />
            </form>
        </template>
    </PopUp>
</template>

<script setup lang="ts">
import { useAppModel } from '@/entities/app';
import { PopUp } from '@/entities/popup';
import { UiTextArea } from '@/shared/ui/textarea';
import { UiButton } from '@/shared/ui/button';
import { UISelect } from '@/shared/ui/select';
import { lock, unlock } from '@/shared/lib/utils/isBlockScroll';

const app = useAppModel();

const closeSupport = () => {
  app.updateShowSupport(false);
  unlock();
};

const openSupport = () => {
  lock();
};
</script>

<style lang="scss">
  @import "style.module";

</style>
