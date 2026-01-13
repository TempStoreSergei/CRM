<template>
    <div class="wrapper">
        <section class="login">
            <Title
                class="login__title"
                :data="{
                    title: 'Sign In to CRM',
                    size: 'medium',
                    isHighLeading: true,
                    marginBottom: 'medium',
                }"
            />
            <form
                class="login__form"
                @submit.prevent="submitForm"
            >
                <UIInput
                    class="login__email"
                    @onInput="handlerEmail"
                    :data="{
                        title: 'Email Address',
                        name: 'email',
                        type: 'email',
                        placeholder: 'youremail@gmail.com',
                        value: state.fromData.email,
                    }"
                />
                <UIInput
                    class="login__password"
                    @onInput="handlerPassword"
                    :data="{
                        title: 'Password',
                        name: 'password',
                        type: 'password',
                        placeholder: '••••••••',
                        value: state.fromData.password,
                        iconName: 'eye',
                    }"
                >
                    <template #icon>
                        <ArrowRightLongIcon />
                    </template>
                </UIInput>
                <div class="login__action">
                    <button
                        class="login__reset"
                        type="reset"
                    >
                        Reset All Field
                    </button>

                    <router-link
                        to="/forgot"
                        class="login__forgot"
                    >
                        Forgot Password?
                    </router-link>
                </div>
                <UiButton
                    class="login__button"
                    :data="{
                        title: 'Sign In',
                        type: 'submit',
                        iconNameRight: 'Arrow Right',
                        isFull: true,
                    }"
                >
                    <template #icon-right>
                        <ArrowRightLongIcon />
                    </template>
                </UiButton>
                <Link
                    class="login__link"
                    :data="{
                        title: 'Нет аккаунта? Зарегистрироваться',
                        to: '/register',
                    }"
                />
            </form>
        </section>
    </div>
    <PopUp
        :data="{
            title: 'Allow notification?',
            open: isSupported && !permissionGranted && state.chose,
        }"
    >
        <template #content>
            <div class="login__pop-up">
                <UiButton
                    class="login__choise"
                    :data="{
                        type: 'button',
                        title: 'Yes',
                    }"
                    @click="handlerPermission(true)"
                />
                <UiButton
                    class="login__choise"
                    :data="{
                        type: 'button',
                        title: 'No',
                    }"
                    @click="handlerPermission(false)"
                />
            </div>
        </template>
    </PopUp>
</template>

<script setup>

import { useToast } from 'vue-toastification';
import { router } from '@/app/providers';
import { authService } from '@/shared/api';
import { Title } from '@/shared/ui/title';
import { UIInput } from '@/shared/ui/input';
import { UiButton } from '@/shared/ui/button';
import Link from '@/shared/ui/link/ui/Link.vue';
import ArrowRightLongIcon from '@/shared/assets/icons/arrowRightLong.vue';
import { accessTokenLocalStorage, refreshTokenLocalStorage } from '@/shared/lib/utils/isAutorise';
import { useCustomWebNotification } from '@/shared/lib/utils/notification';
import { PopUp } from '@/entities/popup';

const toast = useToast();

const state = reactive({
  fromData: {
    email: '',
    password: '',
    agent: navigator.userAgent
  },
  chose: true,
  isLoading: false,
});

const submitForm = async () => {
  if (state.isLoading) return;
  
  state.isLoading = true;
  try {
    const response = await authService.login(state.fromData);
    accessTokenLocalStorage.value = response.accessToken;
    refreshTokenLocalStorage.value = response.refreshToken;
    toast.success('Успешный вход!');
    await router.push({ path: '/' });
  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error('Ошибка входа. Проверьте данные.');
  } finally {
    state.isLoading = false;
  }
};

const { isSupported, show: showNotification, permissionGranted } = useCustomWebNotification();

const handlerCreateUser = async () => {
  if (state.isLoading) return;
  
  state.isLoading = true;
  try {
    await authService.signUp(state.fromData);
    const response = await authService.login(state.fromData);
    accessTokenLocalStorage.value = response.accessToken;
    refreshTokenLocalStorage.value = response.refreshToken;
    toast.info('Вы успешно зарегистрировались!!!');
    router.push({ path: '/' });
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error('Ошибка регистрации.');
  } finally {
    state.isLoading = false;
  }
};

const handlerEmail = event => {
  state.fromData.email = event;
};

const handlerPermission = value => {
  if (value) {
    alert('Пока не работает');
  } else {
    state.chose = false;
  }
};

const handlerPassword = event => {
  state.fromData.password = event;
};
</script>

<style scoped lang="scss">
  @import "style.module";
</style>
