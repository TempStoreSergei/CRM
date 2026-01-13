<template>
    <section class="notifications-page">
        <HeaderPage />
        <div class="wrapper">
            <div class="notifications-page__header">
                <Title
                    :data="{
                        title: 'Уведомления',
                        size: 'medium',
                        isHighLeading: true,
                    }"
                />
                <div class="notifications-page__actions">
                    <span 
                        v-if="unreadCount > 0"
                        class="notifications-page__badge"
                    >
                        {{ unreadCount }} непрочитанных
                    </span>
                    <button 
                        v-if="unreadCount > 0"
                        class="notifications-page__mark-all"
                        @click="markAllAsRead"
                    >
                        Отметить все как прочитанные
                    </button>
                </div>
            </div>

            <Tabs 
                :data="{
                    tabs: tabs,
                    activeTab: state.activeTab
                }" 
                @onTab="handleTabChange"
            >
                <template #Все>
                    <div class="notifications-page__list">
                        <NotificationItem
                            v-for="notification in filteredNotifications"
                            :key="notification.id"
                            :notification="notification"
                            @click="handleNotificationClick(notification)"
                            @delete="handleDelete(notification.id)"
                        />
                        <div v-if="filteredNotifications.length === 0" class="notifications-page__empty">
                            <IconBase :data="{ iconName: 'bell' }" />
                            <span>Нет уведомлений</span>
                        </div>
                    </div>
                </template>
                <template #Непрочитанные>
                    <div class="notifications-page__list">
                        <NotificationItem
                            v-for="notification in unreadNotifications"
                            :key="notification.id"
                            :notification="notification"
                            @click="handleNotificationClick(notification)"
                            @delete="handleDelete(notification.id)"
                        />
                        <div v-if="unreadNotifications.length === 0" class="notifications-page__empty">
                            <IconBase :data="{ iconName: 'check' }" />
                            <span>Все уведомления прочитаны</span>
                        </div>
                    </div>
                </template>
            </Tabs>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { useToast } from 'vue-toastification';
import { Title } from '@/shared/ui/title';
import { Tabs } from '@/shared/ui/tabs';
import { IconBase } from '@/shared/ui/icon-base';
import { HeaderPage } from '@/entities/header-page';
import NotificationItem from './NotificationItem.vue';
import type { Notification } from '@/shared/api';

useHead({
    title: 'CRM - Уведомления'
});

const toast = useToast();

const tabs = [
    { label: 'Все' },
    { label: 'Непрочитанные' }
];

const state = reactive({
    activeTab: 0,
    notifications: [
        {
            id: '1',
            type: 'task_assigned' as const,
            title: 'Новая задача',
            message: 'Вам назначена задача "Дизайн главной страницы"',
            data: { entityType: 'task' as const, entityId: '123' },
            read: false,
            createdAt: new Date().toISOString(),
        },
        {
            id: '2',
            type: 'event_reminder' as const,
            title: 'Напоминание',
            message: 'Встреча с командой через 30 минут',
            data: { entityType: 'event' as const, entityId: '456' },
            read: false,
            createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
        {
            id: '3',
            type: 'vacation_approved' as const,
            title: 'Отпуск одобрен',
            message: 'Ваша заявка на отпуск одобрена',
            data: { entityType: 'vacation' as const, entityId: '789' },
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: '4',
            type: 'message_received' as const,
            title: 'Новое сообщение',
            message: 'Иван Петров: "Привет! Как дела с проектом?"',
            data: { entityType: 'message' as const, entityId: '101' },
            read: true,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
    ] as Notification[],
});

const filteredNotifications = computed(() => state.notifications);

const unreadNotifications = computed(() => 
    state.notifications.filter(n => !n.read)
);

const unreadCount = computed(() => unreadNotifications.value.length);

const handleTabChange = (index: number) => {
    state.activeTab = index;
};

const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
        const idx = state.notifications.findIndex(n => n.id === notification.id);
        if (idx !== -1) {
            state.notifications[idx].read = true;
        }
    }
    // Navigate based on notification type
    // router.push(...)
};

const handleDelete = (id: string) => {
    state.notifications = state.notifications.filter(n => n.id !== id);
    toast.success('Уведомление удалено');
};

const markAllAsRead = () => {
    state.notifications = state.notifications.map(n => ({ ...n, read: true }));
    toast.success('Все уведомления отмечены как прочитанные');
};
</script>

<style lang="scss">
.notifications-page {
    &__header {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
    }
    
    &__actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    }
    
    &__badge {
        background: #3A89FF;
        color: white;
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 12px;
    }
    
    &__mark-all {
        background: none;
        border: none;
        color: #3A89FF;
        font-size: 14px;
        cursor: pointer;
        
        &:hover {
            text-decoration: underline;
        }
    }
    
    &__list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 60px;
    }
    
    &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 48px 24px;
        background: rgb(255, 255, 255);
        border-radius: 16px;
        box-shadow: 0 6px 58px 0 rgba(196, 203, 214, 0.1);
        color: #7D8592;
        
        svg {
            width: 48px;
            height: 48px;
            opacity: 0.5;
        }
    }
}
</style>
