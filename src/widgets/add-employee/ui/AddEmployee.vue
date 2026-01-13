<template>
    <PopUp
        @onClose="closeAddEmployee"
        @onOpen="openAddEmployee"
        :data="{
            title: $t('employees.addEmployee'),
            open: state.showAddEmployee,
        }"
    >
        <template #content>
            <form class="add-employee__form" @submit.prevent="handleSubmit">
                <UIInput
                    @onInput="(val) => formData.firstName = val"
                    :data="{
                        type: 'text',
                        title: $t('employees.firstName'),
                        placeholder: $t('employees.firstName'),
                        name: 'firstName',
                        value: formData.firstName,
                    }"
                />
                <UIInput
                    @onInput="(val) => formData.lastName = val"
                    :data="{
                        type: 'text',
                        title: $t('employees.lastName'),
                        placeholder: $t('employees.lastName'),
                        name: 'lastName',
                        value: formData.lastName,
                    }"
                />
                <UIInput
                    @onInput="(val) => formData.email = val"
                    :data="{
                        type: 'email',
                        title: $t('employees.email'),
                        placeholder: 'email@example.com',
                        name: 'email',
                        value: formData.email,
                    }"
                />
                <UIInput
                    @onInput="(val) => formData.phone = val"
                    :data="{
                        type: 'tel',
                        title: $t('employees.phone'),
                        placeholder: '+7 999 123-45-67',
                        name: 'phone',
                        value: formData.phone,
                    }"
                />
                <UISelect
                    @change="(val) => formData.department = val"
                    :data="{
                        name: 'department',
                        title: $t('employees.department'),
                        options: departmentOptions,
                    }"
                />
                <UIInput
                    @onInput="(val) => formData.position = val"
                    :data="{
                        type: 'text',
                        title: $t('employees.position'),
                        placeholder: $t('employees.position'),
                        name: 'position',
                        value: formData.position,
                    }"
                />
                <UISelect
                    @change="(val) => formData.level = val"
                    :data="{
                        name: 'level',
                        title: $t('employees.level'),
                        options: levelOptions,
                    }"
                />
            </form>
        </template>
        <template #bottom>
            <div class="add-employee__approve">
                <UiButton
                    @click="handleSubmit"
                    :data="{
                        title: isLoading ? $t('employees.adding') : $t('employees.addEmployee'),
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
import { useI18n } from 'vue-i18n';
import { PopUp } from '@/entities/popup';
import { UiButton } from '@/shared/ui/button';
import { UISelect } from '@/shared/ui/select';
import { UIInput } from '@/shared/ui/input';
import { lock, unlock } from '@/shared/lib/utils/isBlockScroll';
import { useModalStore } from '@/entities/add-modal';
import { usersService } from '@/shared/api';

const { t } = useI18n();
const toast = useToast();
const modalStore = useModalStore();
const { state } = storeToRefs(modalStore);

const isLoading = ref(false);

const formData = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    level: 'Junior' as 'Junior' | 'Middle' | 'Senior' | 'Lead',
});

const departmentOptions = computed(() => [
    { value: 'development', title: t('departments.development') },
    { value: 'design', title: t('departments.design') },
    { value: 'marketing', title: t('departments.marketing') },
    { value: 'hr', title: t('departments.hr') },
    { value: 'sales', title: t('departments.sales') },
    { value: 'support', title: t('departments.support') },
]);

const levelOptions = [
    { value: 'Junior', title: 'Junior' },
    { value: 'Middle', title: 'Middle' },
    { value: 'Senior', title: 'Senior' },
    { value: 'Lead', title: 'Lead' },
];

const resetForm = () => {
    formData.firstName = '';
    formData.lastName = '';
    formData.email = '';
    formData.phone = '';
    formData.department = '';
    formData.position = '';
    formData.level = 'Junior';
};

const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error(t('employees.fillRequired'));
        return;
    }
    
    isLoading.value = true;
    try {
        await usersService.createUser({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            department: formData.department,
            position: formData.position,
            level: formData.level,
        });
        toast.success(t('employees.addedSuccess'));
        resetForm();
        closeAddEmployee();
    } catch (error) {
        console.error('Error adding employee:', error);
        toast.error(t('employees.addError'));
    } finally {
        isLoading.value = false;
    }
};

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

.add-employee__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
