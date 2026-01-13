<template>
    <article 
        class="notification-item"
        :class="{ 'notification-item--unread': !notification.read }"
        @click="$emit('click')"
    >
        <div class="notification-item__icon" :class="`notification-item__icon--${notification.type}`">
            <IconBase :data="{ iconName: iconName }" />
        </div>
        <div class="notification-item__content">
            <div class="notification-item__header">
                <span class="notification-item__title">{{ notification.title }}</span>
                <span class="notification-item__time">{{ formattedTime }}</span>
            </div>
            <div class="notification-item__message">
                {{ notification.message }}
            </div>
        </div>
        <button 
            class="notification-item__delete"
            @click.stop="$emit('delete')"
        >
            <IconBase :data="{ iconName: 'close' }" />
        </button>
    </article>
</template>

<script setup lang="ts">
import { IconBase } from '@/shared/ui/icon-base';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Notification } from '@/shared/api';

const props = defineProps<{
    notification: Notification;
}>();

defineEmits<{
    (e: 'click'): void;
    (e: 'delete'): void;
}>();

const iconName = computed(() => {
    const icons: Record<string, string> = {
        task_assigned: 'check',
        event_reminder: 'calendar',
        vacation_approved: 'calendar',
        message_received: 'message',
    };
    return icons[props.notification.type] || 'bell';
});

const formattedTime = computed(() => {
    try {
        return formatDistanceToNow(new Date(props.notification.createdAt), { 
            addSuffix: true, 
            locale: ru 
        });
    } catch {
        return '';
    }
});
</script>

<style lang="scss">
.notification-item {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: rgb(255, 255, 255);
    border-radius: 16px;
    box-shadow: 0 6px 58px 0 rgba(196, 203, 214, 0.1);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(196, 203, 214, 0.2);
    }
    
    &--unread {
        border-left: 3px solid #3A89FF;
        
        .notification-item__title {
            font-weight: 600;
        }
    }
    
    &__icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        
        &--task_assigned {
            background: #E3F2FD;
            color: #1976D2;
        }
        
        &--event_reminder {
            background: #FFF3E0;
            color: #EF6C00;
        }
        
        &--vacation_approved {
            background: #E8F5E9;
            color: #388E3C;
        }
        
        &--message_received {
            background: #F3E5F5;
            color: #7B1FA2;
        }
    }
    
    &__content {
        flex: 1;
        min-width: 0;
    }
    
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 4px;
    }
    
    &__title {
        font-size: 14px;
        color: #0A1629;
    }
    
    &__time {
        font-size: 12px;
        color: #7D8592;
        white-space: nowrap;
    }
    
    &__message {
        font-size: 13px;
        color: #7D8592;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    
    &__delete {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: #7D8592;
        opacity: 0;
        transition: opacity 0.2s;
        
        &:hover {
            color: #F44336;
        }
    }
    
    &:hover &__delete {
        opacity: 1;
    }
}
</style>
