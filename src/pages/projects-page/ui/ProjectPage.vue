<template>
    <section class="projects-page">
        <HeaderPage />
        <main class="wrapper">
            <div v-if="isLoading" class="projects-page__loading">Загрузка...</div>
            <template v-else>
                <CardProjectSmall
                    v-if="currentProject"
                    class="projects-page__current-project"
                    :data="{
                        id: currentProject.code,
                        title: currentProject.name,
                    }"
                />
                <div class="projects-page__filter">
                    <Title
                        :data="{
                            title: 'Проекты',
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
                <div class="projects-page__list">
                    <CardProjectSmall
                        v-for="project in projects"
                        :key="project.id"
                        :data="{
                            id: project.code,
                            title: project.name,
                        }"
                        @click="selectProject(project)"
                    />
                </div>
            </template>
        </main>
    </section>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { useRouter } from 'vue-router';
import { CardProjectSmall } from '@/entities/project-small';
import { Title } from '@/shared/ui/title';
import { IconBase } from '@/shared/ui/icon-base';
import { HeaderPage } from '@/entities/header-page';
import { projectsService, type Project } from '@/shared/api';

useHead({
  title: 'CRM - Projects'
});

const router = useRouter();

const projects = ref<Project[]>([]);
const currentProject = ref<Project | null>(null);
const isLoading = ref(true);

const loadProjects = async () => {
    isLoading.value = true;
    try {
        const response = await projectsService.getProjects();
        projects.value = response.data;
        if (projects.value.length > 0) {
            currentProject.value = projects.value[0];
        }
    } catch (error) {
        console.error('Failed to load projects:', error);
    } finally {
        isLoading.value = false;
    }
};

const selectProject = (project: Project) => {
    currentProject.value = project;
    router.push({ path: '/projects/details', query: { id: project.id } });
};

onMounted(() => {
    loadProjects();
});
</script>

<style lang="scss">
.projects-page {
  &__loading {
    padding: 20px;
    text-align: center;
    color: #7D8592;
  }
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
  &__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 60px;
  }
}
</style>
