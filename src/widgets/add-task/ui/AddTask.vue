<template>
    <PopUp
        @onClose="closeAddTask"
        @onOpen="openAddTask"
        :data="{
            title: 'Создать задачу',
            open: state.showAddTask,
        }"
    >
        <template #content>
            <form
                class="add-task__form"
                @submit.prevent="handleSubmit"
            >
                <UIInput
                    @onInput="(val) => formData.title = val"
                    :data="{
                        type: 'text',
                        title: 'Название задачи',
                        placeholder: 'Введите название',
                        name: 'title',
                        value: formData.title,
                    }"
                />
                <UISelect
                    @change="(val) => formData.priority = val"
                    :data="{
                        name: 'priority',
                        title: 'Приоритет',
                        options: priorityOptions,
                    }"
                />
                <UISelect
                    @change="(val) => formData.projectId = val"
                    :data="{
                        name: 'project',
                        title: 'Проект',
                        options: projectOptions,
                    }"
                />
                <UISelect
                    @change="(val) => formData.assigneeId = val"
                    :data="{
                        name: 'assignee',
                        title: 'Исполнитель',
                        options: employeeOptions,
                    }"
                />
                <UIInput
                    @onInput="(val) => formData.dueDate = val"
                    :data="{
                        type: 'date',
                        title: 'Срок выполнения',
                        placeholder: '',
                        name: 'dueDate',
                        value: formData.dueDate,
                    }"
                />
                <UIInput
                    @onInput="(val) => formData.estimatedHours = parseInt(val, 10) || 0"
                    :data="{
                        type: 'number',
                        title: 'Оценка времени (часы)',
                        placeholder: '8',
                        name: 'estimatedHours',
                        value: String(formData.estimatedHours),
                    }"
                />
                <UiTextArea
                    @onInput="(val) => formData.description = val"
                    :data="{
                        name: 'description',
                        title: 'Описание',
                        placeholder: 'Добавьте описание задачи',
                        value: formData.description,
                    }"
                />
            </form>
        </template>
        <template #bottom>
            <div class="add-task__save">
                <UiButton
                    @click="handleSubmit"
                    :data="{
                        title: isLoading ? 'Сохранение...' : 'Сохранить задачу',
                        type: 'button',
                        isFull: true,
                    }"
                />
            </div>
        </template>
    </PopUp>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { PopUp } from '@/entities/popup';
import { UiButton } from '@/shared/ui/button';
import { UISelect } from '@/shared/ui/select';
import { lock, unlock } from '@/shared/lib/utils/isBlockScroll';
import { useModalStore } from '@/entities/add-modal';
import { UIInput } from '@/shared/ui/input';
import { UiTextArea } from '@/shared/ui/textarea';
import { tasksService, projectsService, employeesService } from '@/shared/api';

const toast = useToast();
const modalStore = useModalStore();
const { state } = storeToRefs(modalStore);

const isLoading = ref(false);

const formData = reactive({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    projectId: '',
    assigneeId: '',
    dueDate: '',
    estimatedHours: 0,
});

const priorityOptions = [
    { value: 'low', title: 'Низкий' },
    { value: 'medium', title: 'Средний' },
    { value: 'high', title: 'Высокий' },
    { value: 'critical', title: 'Критический' },
];

const projectOptions = ref<{ value: string; title: string }[]>([]);
const employeeOptions = ref<{ value: string; title: string }[]>([]);

const loadOptions = async () => {
    try {
        const [projectsResponse, employeesResponse] = await Promise.all([
            projectsService.getProjects(),
            employeesService.getEmployees(),
        ]);
        
        projectOptions.value = projectsResponse.data.map(p => ({
            value: p.id,
            title: p.name,
        }));
        
        employeeOptions.value = employeesResponse.data.map(e => ({
            value: e.id,
            title: `${e.firstName} ${e.lastName}`,
        }));
    } catch (error) {
        console.error('Error loading options:', error);
    }
};

const resetForm = () => {
    formData.title = '';
    formData.description = '';
    formData.priority = 'medium';
    formData.projectId = '';
    formData.assigneeId = '';
    formData.dueDate = '';
    formData.estimatedHours = 0;
};

const handleSubmit = async () => {
    if (!formData.title) {
        toast.error('Введите название задачи');
        return;
    }
    
    isLoading.value = true;
    try {
        await tasksService.createTask({
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            projectId: formData.projectId || undefined,
            assigneeId: formData.assigneeId || undefined,
            dueDate: formData.dueDate || undefined,
            estimatedHours: formData.estimatedHours || undefined,
        });
        toast.success('Задача успешно создана!');
        resetForm();
        closeAddTask();
    } catch (error) {
        console.error('Error creating task:', error);
        toast.error('Ошибка при создании задачи');
    } finally {
        isLoading.value = false;
    }
};

const closeAddTask = () => {
    state.value.showAddTask = false;
    unlock();
};

const openAddTask = () => {
    lock();
    loadOptions();
};
</script>

<style lang="scss">
@import "style.module";

.add-task__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
