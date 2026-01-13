<template>
    <section class="settings-page">
        <HeaderPage />
        <div class="wrapper">
            <article class="settings-page__card">
                <Title
                    :data="{
                        title: $t('settings.title'),
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
                                title: $t('settings.profile'),
                                marginBottom: 'small',
                            }"
                        />
                        <div class="settings-page__fields">
                            <UIInput
                                :data="{
                                    value: state.profile.firstName,
                                    type: 'text',
                                    name: 'firstName',
                                    title: $t('employees.firstName'),
                                }"
                                @onInput="(val) => state.profile.firstName = val"
                            />
                            <UIInput
                                :data="{
                                    value: state.profile.lastName,
                                    type: 'text',
                                    name: 'lastName',
                                    title: $t('employees.lastName'),
                                }"
                                @onInput="(val) => state.profile.lastName = val"
                            />
                            <UIInput
                                :data="{
                                    value: state.profile.email,
                                    type: 'email',
                                    name: 'email',
                                    title: $t('employees.email'),
                                    isReadonly: true,
                                }"
                            />
                            <UIInput
                                :data="{
                                    value: state.profile.phone,
                                    type: 'tel',
                                    name: 'phone',
                                    title: $t('employees.phone'),
                                }"
                                @onInput="(val) => state.profile.phone = val"
                            />
                        </div>
                    </div>

                    <hr class="settings-page__divider">

                    <!-- Language Settings -->
                    <div class="settings-page__section">
                        <Title
                            :data="{
                                title: $t('settings.language'),
                                marginBottom: 'small',
                            }"
                        />
                        <div class="settings-page__options">
                            <UISelect
                                @change="handleLanguageChange"
                                :data="{
                                    name: 'language',
                                    title: $t('settings.language'),
                                    options: languageOptions,
                                    value: state.language,
                                }"
                            />
                        </div>
                    </div>

                    <hr class="settings-page__divider">

                    <!-- Notification Settings -->
                    <div class="settings-page__section">
                        <Title
                            :data="{
                                title: $t('settings.notifications'),
                                marginBottom: 'small',
                            }"
                        />
                        <div class="settings-page__options">
                            <div class="settings-page__option">
                                <span>{{ $t('settings.emailNotifications') }}</span>
                                <UICheckbox
                                    :data="{
                                        checked: state.notifications.email,
                                        name: 'emailNotifications',
                                    }"
                                    @onChange="(val) => state.notifications.email = val"
                                />
                            </div>
                            <div class="settings-page__option">
                                <span>{{ $t('settings.pushNotifications') }}</span>
                                <UICheckbox
                                    :data="{
                                        checked: state.notifications.push,
                                        name: 'pushNotifications',
                                    }"
                                    @onChange="(val) => state.notifications.push = val"
                                />
                            </div>
                            <div class="settings-page__option">
                                <span>{{ $t('settings.taskNotifications') }}</span>
                                <UICheckbox
                                    :data="{
                                        checked: state.notifications.tasks,
                                        name: 'taskNotifications',
                                    }"
                                    @onChange="(val) => state.notifications.tasks = val"
                                />
                            </div>
                            <div class="settings-page__option">
                                <span>{{ $t('settings.eventNotifications') }}</span>
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
                                title: $t('settings.integrations'),
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
                                            {{ state.integrations.googleCalendar ? $t('common.connected') : $t('common.notConnected') }}
                                        </div>
                                    </div>
                                </div>
                                <UiButton
                                    :data="{
                                        title: state.integrations.googleCalendar ? $t('common.disconnect') : $t('common.connect'),
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
                                            {{ state.integrations.telegram ? $t('common.connected') : $t('common.notConnected') }}
                                        </div>
                                    </div>
                                </div>
                                <UiButton
                                    :data="{
                                        title: state.integrations.telegram ? $t('common.disconnect') : $t('common.connect'),
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
                                title: $t('settings.appearance'),
                                marginBottom: 'small',
                            }"
                        />
                        <div class="settings-page__options">
                            <div class="settings-page__option">
                                <span>{{ $t('settings.darkTheme') }}</span>
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
                            title: $t('settings.saveChanges'),
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
import { useI18n } from 'vue-i18n';
import { Title } from '@/shared/ui/title';
import { UIInput } from '@/shared/ui/input';
import { UiButton } from '@/shared/ui/button';
import { Checkbox as UICheckbox } from '@/shared/ui/checkbox';
import { IconBase } from '@/shared/ui/icon-base';
import { HeaderPage } from '@/entities/header-page';
import { authService, usersService } from '@/shared/api';
import { UISelect } from '@/shared/ui/select';
import { setLocale, type Locale } from '@/shared/i18n';

const { t, locale } = useI18n();

useHead({
    title: () => `CRM - ${t('settings.title')}`
});

const toast = useToast();

const languageOptions = [
    { value: 'ru', title: 'Русский' },
    { value: 'en', title: 'English' },
];

const state = reactive({
    isLoading: true,
    isSaving: false,
    userId: '',
    language: locale.value as Locale,
    profile: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
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

const handleLanguageChange = (value: string) => {
    state.language = value as Locale;
    setLocale(value as Locale);
};

const loadUserData = async () => {
    state.isLoading = true;
    try {
        const user = await authService.getCurrentUser();
        state.userId = user.id;
        state.profile.firstName = user.firstName;
        state.profile.lastName = user.lastName;
        state.profile.email = user.email;
        state.profile.phone = user.phone || '';
    } catch (error) {
        console.error('Failed to load user data:', error);
        toast.error(t('settings.profileLoadError'));
    } finally {
        state.isLoading = false;
    }
};

const toggleGoogleCalendar = () => {
    state.integrations.googleCalendar = !state.integrations.googleCalendar;
    if (state.integrations.googleCalendar) {
        toast.info(t('settings.googleCalendarRedirect'));
    }
};

const toggleTelegram = () => {
    state.integrations.telegram = !state.integrations.telegram;
    if (state.integrations.telegram) {
        toast.info(t('settings.telegramBot'));
    }
};

const toggleTheme = (value: boolean) => {
    state.theme = value ? 'dark' : 'light';
};

const saveSettings = async () => {
    if (state.isSaving) return;
    
    state.isSaving = true;
    try {
        await usersService.updateUser(state.userId, {
            firstName: state.profile.firstName,
            lastName: state.profile.lastName,
            phone: state.profile.phone,
        });
        toast.success(t('settings.settingsSaved'));
    } catch (error) {
        console.error('Failed to save settings:', error);
        toast.error(t('settings.settingsSaveError'));
    } finally {
        state.isSaving = false;
    }
};

onMounted(() => {
    loadUserData();
});
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
