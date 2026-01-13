<template>
    <div class="wrapper wrapper_big-margin">
        <section class="workload">
            <TitleWithLink
                :data="{
                    title: {
                        title: 'Workload',
                    },
                    link: {
                        title: 'View all',
                        to: '/employees',
                    },
                }"
            >
                <template #content>
                    <div v-if="isLoading" class="workload__loading">Загрузка...</div>
                    <div v-else class="workload__employees">
                        <Card
                            v-for="employee in employees"
                            :key="employee.id"
                            @click="goToProfile(employee.id)"
                            :data="{
                                isWhite: false,
                                isBox: false,
                                fullName: `${employee.firstName} ${employee.lastName}`,
                                tag: employee.level || 'Employee',
                                job: employee.position || 'Сотрудник',
                                image: employee.avatar || 'https://via.placeholder.com/150',
                            }"
                        />
                    </div>
                </template>
            </TitleWithLink>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Card } from '@/entities/user';
import { TitleWithLink } from '@/entities/grop-title';
import { employeesService, type Employee } from '@/shared/api';

const router = useRouter();

const employees = ref<Employee[]>([]);
const isLoading = ref(true);

const loadEmployees = async () => {
    isLoading.value = true;
    try {
        const response = await employeesService.getEmployees({ limit: 6 });
        employees.value = response.data;
    } catch (error) {
        console.error('Failed to load employees:', error);
    } finally {
        isLoading.value = false;
    }
};

const goToProfile = (id?: string) => {
    router.push({ path: '/profile', query: id ? { id } : {} });
};

onMounted(() => {
    loadEmployees();
});
</script>

<style lang="scss">
  @import "style.module";
</style>
