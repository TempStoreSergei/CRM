<template>
    <div class="wrapper wrapper_big-margin">
        <section class="projects-container">
            <TitleWithLink
                :data="{
                    title: {
                        title: $t('projects.title'),
                    },
                    link: {
                        title: $t('common.viewAll'),
                        to: '/projects',
                    },
                }"
            >
                <template #content>
                    <div v-if="isLoading" class="projects__loading">{{ $t('common.loading') }}</div>
                    <section v-else class="projects">
                        <CardProject
                            v-for="project in projects"
                            :key="project.id"
                            @click="goToProject(project.id)"
                            :data="{
                                name: project.name,
                                code: project.code,
                                progress: project.progress,
                                status: project.status,
                                team: project.team,
                            }"
                        />
                    </section>
                </template>
            </TitleWithLink>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { TitleWithLink } from '@/entities/grop-title';
import CardProject from '@/entities/project/ui/card/CardProject.vue';
import { projectsService, type Project } from '@/shared/api';

const router = useRouter();

const projects = ref<Project[]>([]);
const isLoading = ref(true);

const loadProjects = async () => {
    isLoading.value = true;
    try {
        const response = await projectsService.getProjects({ limit: 4 });
        projects.value = response.data;
    } catch (error) {
        console.error('Failed to load projects:', error);
    } finally {
        isLoading.value = false;
    }
};

const goToProject = (id?: string) => {
    router.push({ path: '/projects/details', query: id ? { id } : {} });
};

onMounted(() => {
    loadProjects();
});
</script>

<style scoped lang="scss">
  @import "style.module";
</style>
