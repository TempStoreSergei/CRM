<template>
    <div class="wrapper">
        <section class="register">
            <Title
                class="register__title"
                :data="{
                    title: $t('auth.registerTitle'),
                    size: 'medium',
                    isHighLeading: true,
                    marginBottom: 'medium',
                }"
            />
            <form
                class="register__form"
                @submit.prevent="submitForm"
            >
                <UIInput
                    class="register__input"
                    @onInput="(val) => state.formData.firstName = val"
                    :data="{
                        title: $t('employees.firstName'),
                        name: 'firstName',
                        type: 'text',
                        placeholder: $t('auth.enterFirstName'),
                        value: state.formData.firstName,
                    }"
                />
                <UIInput
                    class="register__input"
                    @onInput="(val) => state.formData.lastName = val"
                    :data="{
                        title: $t('employees.lastName'),
                        name: 'lastName',
                        type: 'text',
                        placeholder: $t('auth.enterLastName'),
                        value: state.formData.lastName,
                    }"
                />
                <UIInput
                    class="register__input"
                    @onInput="(val) => state.formData.email = val"
                    :data="{
                        title: $t('auth.email'),
                        name: 'email',
                        type: 'email',
                        placeholder: 'youremail@gmail.com',
                        value: state.formData.email,
                    }"
                />
                <UIInput
                    class="register__input"
                    @onInput="(val) => state.formData.password = val"
                    :data="{
                        title: $t('auth.password'),
                        name: 'password',
                        type: 'password',
                        placeholder: '••••••••',
                        value: state.formData.password,
                        iconName: 'eye',
                    }"
                />
                <UIInput
                    class="register__input"
                    @onInput="(val) => state.formData.confirmPassword = val"
                    :data="{
                        title: $t('auth.confirmPassword'),
                        name: 'confirmPassword',
                        type: 'password',
                        placeholder: '••••••••',
                        value: state.formData.confirmPassword,
                        iconName: 'eye',
                    }"
                />
                <div v-if="state.error" class="register__error">
                    {{ state.error }}
                </div>
                <UiButton
                    class="register__button"
                    :data="{
                        title: state.isLoading ? $t('auth.registering') : $t('auth.signUp'),
                        type: 'submit',
                        isFull: true,
                    }"
                />
                <div class="register__login">
                    <span>{{ $t('auth.haveAccount') }}</span>
                    <router-link to="/login" class="register__login-link">
                        {{ $t('auth.signIn') }}
                    </router-link>
                </div>
            </form>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Title } from '@/shared/ui/title';
import { UIInput } from '@/shared/ui/input';
import { UiButton } from '@/shared/ui/button';
import { authService } from '@/shared/api';
import { accessTokenLocalStorage, refreshTokenLocalStorage } from '@/shared/lib/utils/isAutorise';

const { t } = useI18n();

useHead({
    title: () => `CRM - ${t('auth.register')}`
});

const toast = useToast();
const router = useRouter();

const state = reactive({
    formData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agent: navigator.userAgent
    },
    isLoading: false,
    error: '',
});

const validateForm = () => {
    if (!state.formData.firstName.trim()) {
        state.error = t('auth.enterFirstName');
        return false;
    }
    if (!state.formData.lastName.trim()) {
        state.error = t('auth.enterLastName');
        return false;
    }
    if (!state.formData.email.trim()) {
        state.error = t('auth.enterEmail');
        return false;
    }
    if (!state.formData.password) {
        state.error = t('auth.enterPassword');
        return false;
    }
    if (state.formData.password.length < 6) {
        state.error = t('auth.passwordMinLength');
        return false;
    }
    if (state.formData.password !== state.formData.confirmPassword) {
        state.error = t('auth.passwordsNotMatch');
        return false;
    }
    state.error = '';
    return true;
};

const submitForm = async () => {
    if (state.isLoading) return;
    if (!validateForm()) return;

    state.isLoading = true;
    state.error = '';
    
    try {
        await authService.signUp({
            firstName: state.formData.firstName,
            lastName: state.formData.lastName,
            email: state.formData.email,
            password: state.formData.password,
            agent: state.formData.agent,
        });
        
        const loginResponse = await authService.login({
            email: state.formData.email,
            password: state.formData.password,
            agent: state.formData.agent,
        });
        
        accessTokenLocalStorage.value = loginResponse.accessToken;
        refreshTokenLocalStorage.value = loginResponse.refreshToken;
        
        toast.success(t('auth.registerSuccess'));
        router.push({ path: '/' });
    } catch (error: any) {
        console.error('Registration error:', error);
        state.error = error.response?.data?.message || t('auth.registerError');
        toast.error(state.error);
    } finally {
        state.isLoading = false;
    }
};
</script>

<style scoped lang="scss">
.register {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px 0;
    
    &__title {
        text-align: center;
    }
    
    &__form {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    &__input {
        width: 100%;
    }
    
    &__error {
        color: #C62828;
        font-size: 14px;
        text-align: center;
        padding: 8px;
        background: #FFEBEE;
        border-radius: 8px;
    }
    
    &__button {
        margin-top: 8px;
    }
    
    &__login {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 16px;
        font-size: 14px;
        color: #7D8592;
    }
    
    &__login-link {
        color: #3A89FF;
        text-decoration: none;
        
        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
