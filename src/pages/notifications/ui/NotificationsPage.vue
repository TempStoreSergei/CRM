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
import { notificationsService, type Notification } from '@/shared/api';

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
    isLoading: true,
    notifications: [] as Notification[],
});

const filteredNotifications = computed(() => state.notifications);

const unreadNotifications = computed(() => 
    state.notifications.filter(n => !n.read)
);

const unreadCount = computed(() => unreadNotifications.value.length);

const handleTabChange = (index: number) => {
    state.activeTab = index;
};

const loadNotifications = async () => {
    state.isLoading = true;
    try {
        const response = await notificationsService.getNotifications();
        state.notifications = response.data;
    } catch (error) {
        console.error('Failed to load notifications:', error);
        toast.error('Не удалось загрузить уведомления');
    } finally {
        state.isLoading = false;
    }
};

const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
        try {
            await notificationsService.markAsRead(notification.id);
            const idx = state.notifications.findIndex(n => n.id === notification.id);
            if (idx !== -1) {
                state.notifications[idx].read = true;
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    }
};

const handleDelete = async (id: string) => {
    try {
        await notificationsService.deleteNotification(id);
        state.notifications = state.notifications.filter(n => n.id !== id);
        toast.success('Уведомление удалено');
    } catch (error) {
        console.error('Failed to delete notification:', error);
        toast.error('Не удалось удалить уведомление');
    }
};

const markAllAsRead = async () => {
    try {
        await notificationsService.markAllAsRead();
        state.notifications = state.notifications.map(n => ({ ...n, read: true }));
        toast.success('Все уведомления отмечены как прочитанные');
    } catch (error) {
        console.error('Failed to mark all as read:', error);
        toast.error('Не удалось отметить уведомления');
    }
};

onMounted(() => {
    loadNotifications();
});
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
