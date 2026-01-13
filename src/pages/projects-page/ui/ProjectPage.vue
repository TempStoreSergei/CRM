<template>
    <section class="projects-page">
        <HeaderPage />
        <main class="wrapper">
            <CardProjectSmall
                class="projects-page__current-project"
                :data="{
                    id: 'PN0001245',
                    title: 'Medical App (iOS native)',
                }"
            />
            <div class="projects-page__filter">
                <Title
                    :data="{
                        title: 'Tasks',
                        isHighLeading: true,
                    }"
                />
                <div class="projects-page__filter-icon">
                    <IconBase
                        :data="{
                            iconName: 'search',
                        }"
                    />
                </div>
            </div>
            <GroupProject />
        </main>
        <PopUp
            :data="{
                open: false,
                title: 'Select project',
            }"
        >
            <template #content />
        </PopUp>
    </section>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { PopUp } from '@/entities/popup';
import { CardProjectSmall } from '@/entities/project-small';
import { Title } from '@/shared/ui/title';
import { IconBase } from '@/shared/ui/icon-base';
import { HeaderPage } from '@/entities/header-page';
import { GroupProject } from '@/widgets/group-project'

useHead({
  title: 'CRM - Projects'
});

</script>

<style lang="scss">
.projects-page {
  &__current-project {
    margin-bottom: 32px;
  }
  &__filter {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    align-items: center;
  }
  &__filter-icon {
    align-self: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    box-shadow: 0 6px 58px 0 rgba(196, 203, 214, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
  }
}
</style>
