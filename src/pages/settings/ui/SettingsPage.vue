<template>
    <section class="settings-page">
        <HeaderPage />
        <div class="wrapper">
            <article class="settings-page__card">
                <Title
                    :data="{
                        title: 'Настройки',
                        size: 'medium',
                        isHighLeading: true,
                        marginBottom: 'medium',
                    }"
                />
                
                <div class="settings-page__sections">
                    <!-- Profile Settings -->
                    <div class="settings-page__section">
                        <Title
                            :data="{
                                title: 'Профиль',
                                marginBottom: 'small',
                            }"
                        />
                        <div class="settings-page__fields">
                            <UIInput
                                :data="{
                                    value: state.profile.firstName,
                                    type: 'text',
                                    name: 'firstName',
                                    title: 'Имя',
                                }"
                                @onInput="(val) => state.profile.firstName = val"
                            />
                            <UIInput
                                :data="{
                                    value: state.profile.lastName,
                                    type: 'text',
                                    name: 'lastName',
                                    title: 'Фамилия',
                                }"
                                @onInput="(val) => state.profile.lastName = val"
                            />
                            <UIInput
                                :data="{
                                    value: state.profile.email,
                                    type: 'email',
                                    name: 'email',
                                    title: 'Email',
                                    isReadonly: true,
                                }"
                            />
                            <UIInput
                                :data="{
                                    value: state.profile.phone,
                                    type: 'tel',
                                    name: 'phone',
                                    title: 'Телефон',
                                }"
                                @onInput="(val) => state.profile.phone = val"
                            />
                        </div>
                    </div>

                    <hr class="settings-page__divider">

                    <!-- Notification Settings -->
                    <div class="settings-page__section">
                        <Title
                            :data="{
                                title: 'Уведомления',
                                marginBottom: 'small',
                            }"
                        />
                        <div class="settings-page__options">
                            <div class="settings-page__option">
                                <span>Email уведомления</span>
                                <UICheckbox
                                    :data="{
                                        checked: state.notifications.email,
                                        name: 'emailNotifications',
                                    }"
                                    @onChange="(val) => state.notifications.email = val"
                                />
                            </div>
                            <div class="settings-page__option">
                                <span>Push уведомления</span>
                                <UICheckbox
                                    :data="{
                                        checked: state.notifications.push,
                                        name: 'pushNotifications',
                                    }"
                                    @onChange="(val) => state.notifications.push = val"
                                />
                            </div>
                            <div class="settings-page__option">
                                <span>Уведомления о задачах</span>
                                <UICheckbox
                                    :data="{
                                        checked: state.notifications.tasks,
                                        name: 'taskNotifications',
                                    }"
                                    @onChange="(val) => state.notifications.tasks = val"
                                />
                            </div>
                            <div class="settings-page__option">
                                <span>Уведомления о событиях</span>
                                <UICheckbox
                                    :data="{
                                        checked: state.notifications.events,
                                        name: 'eventNotifications',
                                    }"
                                    @onChange="(val) => state.notifications.events = val"
                                />
                            </div>
                        </div>
                    </div>

                    <hr class="settings-page__divider">

                    <!-- Integrations -->
                    <div class="settings-page__section">
                        <Title
                            :data="{
                                title: 'Интеграции',
                                marginBottom: 'small',
                            }"
                        />
                        <div class="settings-page__integrations">
                            <div class="settings-page__integration">
                                <div class="settings-page__integration-info">
                                    <IconBase :data="{ iconName: 'calendar' }" />
                                    <div>
                                        <div class="settings-page__integration-name">Google Calendar</div>
                                        <div class="settings-page__integration-status">
                                            {{ state.integrations.googleCalendar ? 'Подключен' : 'Не подключен' }}
                                        </div>
                                    </div>
                                </div>
                                <UiButton
                                    :data="{
                                        title: state.integrations.googleCalendar ? 'Отключить' : 'Подключить',
                                        type: 'button',
                                    }"
                                    @click="toggleGoogleCalendar"
                                />
                            </div>
                            <div class="settings-page__integration">
                                <div class="settings-page__integration-info">
                                    <IconBase :data="{ iconName: 'message' }" />
                                    <div>
                                        <div class="settings-page__integration-name">Telegram</div>
                                        <div class="settings-page__integration-status">
                                            {{ state.integrations.telegram ? 'Подключен' : 'Не подключен' }}
                                        </div>
                                    </div>
                                </div>
                                <UiButton
                                    :data="{
                                        title: state.integrations.telegram ? 'Отключить' : 'Подключить',
                                        type: 'button',
                                    }"
                                    @click="toggleTelegram"
                                />
                            </div>
                        </div>
                    </div>

                    <hr class="settings-page__divider">

                    <!-- Theme Settings -->
                    <div class="settings-page__section">
                        <Title
                            :data="{
                                title: 'Внешний вид',
                                marginBottom: 'small',
                            }"
                        />
                        <div class="settings-page__options">
                            <div class="settings-page__option">
                                <span>Тёмная тема</span>
                                <UICheckbox
                                    :data="{
                                        checked: state.theme === 'dark',
                                        name: 'darkTheme',
                                    }"
                                    @onChange="toggleTheme"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-page__actions">
                    <UiButton
                        :data="{
                            title: 'Сохранить изменения',
                            type: 'button',
                            isFull: true,
                        }"
                        @click="saveSettings"
                    />
                </div>
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { useToast } from 'vue-toastification';
import { Title } from '@/shared/ui/title';
import { UIInput } from '@/shared/ui/input';
import { UiButton } from '@/shared/ui/button';
import { Checkbox as UICheckbox } from '@/shared/ui/checkbox';
import { IconBase } from '@/shared/ui/icon-base';
import { HeaderPage } from '@/entities/header-page';

useHead({
    title: 'CRM - Настройки'
});

const toast = useToast();

const state = reactive({
    profile: {
        firstName: 'Evan',
        lastName: 'Yates',
        email: 'evanyates@gmail.com',
        phone: '+1 675 346 23-10',
    },
    notifications: {
        email: true,
        push: true,
        tasks: true,
        events: true,
    },
    integrations: {
        googleCalendar: false,
        telegram: false,
    },
    theme: 'light' as 'light' | 'dark',
});

const toggleGoogleCalendar = () => {
    state.integrations.googleCalendar = !state.integrations.googleCalendar;
    if (state.integrations.googleCalendar) {
        toast.info('Перенаправление на Google для авторизации...');
    }
};

const toggleTelegram = () => {
    state.integrations.telegram = !state.integrations.telegram;
    if (state.integrations.telegram) {
        toast.info('Откройте Telegram и найдите бота @CRMBot');
    }
};

const toggleTheme = (value: boolean) => {
    state.theme = value ? 'dark' : 'light';
};

const saveSettings = () => {
    toast.success('Настройки сохранены!');
};
</script>

<style lang="scss">
.settings-page {
    &__card {
        background: rgb(255, 255, 255);
        border-radius: 24px;
        box-shadow: 0 6px 58px 0 rgba(196, 203, 214, 0.1);
        padding: 24px 20px;
        margin-bottom: 52px;
    }
    
    &__sections {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
    
    &__section {
        display: flex;
        flex-direction: column;
    }
    
    &__fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    &__divider {
        margin: 0;
        border: none;
        border-top: 1px solid #E6EDF5;
    }
    
    &__options {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    &__option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        
        span {
            color: #0A1629;
            font-size: 16px;
        }
    }
    
    &__integrations {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    &__integration {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background: #F5F7FA;
        border-radius: 14px;
    }
    
    &__integration-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    &__integration-name {
        font-size: 16px;
        font-weight: 500;
        color: #0A1629;
    }
    
    &__integration-status {
        font-size: 14px;
        color: #7D8592;
    }
    
    &__actions {
        margin-top: 32px;
    }
}
</style>
