<template>
    <section class="analytics-page">
        <HeaderPage />
        <div class="wrapper">
            <!-- Summary Cards -->
            <div class="analytics-page__summary">
                <div class="analytics-page__card analytics-page__card--projects">
                    <div class="analytics-page__card-icon">
                        <IconBase :data="{ iconName: 'folder' }" />
                    </div>
                    <div class="analytics-page__card-content">
                        <div class="analytics-page__card-value">{{ state.data.projects.total }}</div>
                        <div class="analytics-page__card-label">Всего проектов</div>
                    </div>
                    <div class="analytics-page__card-stats">
                        <span class="analytics-page__stat analytics-page__stat--success">
                            {{ state.data.projects.active }} активных
                        </span>
                        <span class="analytics-page__stat analytics-page__stat--muted">
                            {{ state.data.projects.completed }} завершено
                        </span>
                    </div>
                </div>
                
                <div class="analytics-page__card analytics-page__card--tasks">
                    <div class="analytics-page__card-icon">
                        <IconBase :data="{ iconName: 'check' }" />
                    </div>
                    <div class="analytics-page__card-content">
                        <div class="analytics-page__card-value">{{ state.data.tasks.total }}</div>
                        <div class="analytics-page__card-label">Всего задач</div>
                    </div>
                    <div class="analytics-page__card-stats">
                        <span class="analytics-page__stat analytics-page__stat--success">
                            {{ state.data.tasks.completed }} выполнено
                        </span>
                        <span class="analytics-page__stat analytics-page__stat--warning">
                            {{ state.data.tasks.inProgress }} в работе
                        </span>
                        <span class="analytics-page__stat analytics-page__stat--danger">
                            {{ state.data.tasks.overdue }} просрочено
                        </span>
                    </div>
                </div>
                
                <div class="analytics-page__card analytics-page__card--team">
                    <div class="analytics-page__card-icon">
                        <IconBase :data="{ iconName: 'user' }" />
                    </div>
                    <div class="analytics-page__card-content">
                        <div class="analytics-page__card-value">{{ state.data.team.totalEmployees }}</div>
                        <div class="analytics-page__card-label">Сотрудников</div>
                    </div>
                    <div class="analytics-page__card-stats">
                        <span class="analytics-page__stat analytics-page__stat--muted">
                            {{ state.data.team.onVacation }} в отпуске
                        </span>
                        <span class="analytics-page__stat analytics-page__stat--warning">
                            {{ state.data.team.onSickLeave }} на больничном
                        </span>
                    </div>
                </div>
            </div>

            <!-- Task Progress -->
            <article class="analytics-page__section">
                <Title
                    :data="{
                        title: 'Прогресс выполнения задач',
                        marginBottom: 'small',
                    }"
                />
                <div class="analytics-page__progress-bars">
                    <div class="analytics-page__progress-item">
                        <div class="analytics-page__progress-header">
                            <span>Выполнено</span>
                            <span>{{ taskCompletionPercent }}%</span>
                        </div>
                        <div class="analytics-page__progress-bar">
                            <div 
                                class="analytics-page__progress-fill analytics-page__progress-fill--success"
                                :style="{ width: taskCompletionPercent + '%' }"
                            ></div>
                        </div>
                    </div>
                    <div class="analytics-page__progress-item">
                        <div class="analytics-page__progress-header">
                            <span>В работе</span>
                            <span>{{ taskInProgressPercent }}%</span>
                        </div>
                        <div class="analytics-page__progress-bar">
                            <div 
                                class="analytics-page__progress-fill analytics-page__progress-fill--warning"
                                :style="{ width: taskInProgressPercent + '%' }"
                            ></div>
                        </div>
                    </div>
                    <div class="analytics-page__progress-item">
                        <div class="analytics-page__progress-header">
                            <span>Просрочено</span>
                            <span>{{ taskOverduePercent }}%</span>
                        </div>
                        <div class="analytics-page__progress-bar">
                            <div 
                                class="analytics-page__progress-fill analytics-page__progress-fill--danger"
                                :style="{ width: taskOverduePercent + '%' }"
                            ></div>
                        </div>
                    </div>
                </div>
            </article>

            <!-- Upcoming Events -->
            <article class="analytics-page__section">
                <Title
                    :data="{
                        title: 'Ближайшие события',
                        marginBottom: 'small',
                    }"
                />
                <div class="analytics-page__events">
                    <div 
                        v-for="event in state.data.upcomingEvents" 
                        :key="event.id"
                        class="analytics-page__event"
                    >
                        <div class="analytics-page__event-date">
                            {{ formatDate(event.date) }}
                        </div>
                        <div class="analytics-page__event-title">
                            {{ event.title }}
                        </div>
                    </div>
                    <div v-if="state.data.upcomingEvents.length === 0" class="analytics-page__empty">
                        Нет запланированных событий
                    </div>
                </div>
            </article>

            <!-- Recent Activity -->
            <article class="analytics-page__section">
                <Title
                    :data="{
                        title: 'Последняя активность',
                        marginBottom: 'small',
                    }"
                />
                <div class="analytics-page__activities">
                    <div 
                        v-for="activity in state.data.recentActivity" 
                        :key="activity.id"
                        class="analytics-page__activity"
                    >
                        <div class="analytics-page__activity-icon">
                            <IconBase :data="{ iconName: getActivityIcon(activity.type) }" />
                        </div>
                        <div class="analytics-page__activity-content">
                            <div class="analytics-page__activity-text">
                                {{ activity.description }}
                            </div>
                            <div class="analytics-page__activity-meta">
                                <span>{{ activity.user.name }}</span>
                                <span>•</span>
                                <span>{{ formatDate(activity.timestamp) }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-if="state.data.recentActivity.length === 0" class="analytics-page__empty">
                        Нет активности
                    </div>
                </div>
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { Title } from '@/shared/ui/title';
import { IconBase } from '@/shared/ui/icon-base';
import { HeaderPage } from '@/entities/header-page';
import { analyticsService, type DashboardAnalytics } from '@/shared/api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

useHead({
    title: 'CRM - Аналитика'
});

const state = reactive({
    isLoading: false,
    data: {
        projects: { total: 15, active: 10, completed: 5 },
        tasks: { total: 150, completed: 80, inProgress: 50, overdue: 10 },
        team: { totalEmployees: 50, onVacation: 5, onSickLeave: 2 },
        upcomingEvents: [
            { id: '1', title: 'Встреча с командой', date: new Date().toISOString() },
            { id: '2', title: 'Дедлайн проекта', date: new Date(Date.now() + 86400000 * 3).toISOString() },
        ],
        recentActivity: [
            { id: '1', type: 'task_completed', description: 'Задача "Дизайн главной страницы" выполнена', user: { id: '1', name: 'Иван Петров' }, timestamp: new Date().toISOString() },
            { id: '2', type: 'project_created', description: 'Создан новый проект "Mobile App"', user: { id: '2', name: 'Мария Иванова' }, timestamp: new Date(Date.now() - 3600000).toISOString() },
        ],
    } as DashboardAnalytics,
});

const taskCompletionPercent = computed(() => {
    if (state.data.tasks.total === 0) return 0;
    return Math.round((state.data.tasks.completed / state.data.tasks.total) * 100);
});

const taskInProgressPercent = computed(() => {
    if (state.data.tasks.total === 0) return 0;
    return Math.round((state.data.tasks.inProgress / state.data.tasks.total) * 100);
});

const taskOverduePercent = computed(() => {
    if (state.data.tasks.total === 0) return 0;
    return Math.round((state.data.tasks.overdue / state.data.tasks.total) * 100);
});

const formatDate = (dateString: string) => {
    try {
        return format(new Date(dateString), 'd MMM, HH:mm', { locale: ru });
    } catch {
        return dateString;
    }
};

const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
        task_completed: 'check',
        project_created: 'folder',
        user_joined: 'user',
    };
    return icons[type] || 'info';
};

const loadData = async () => {
    state.isLoading = true;
    try {
        const data = await analyticsService.getDashboard();
        state.data = data;
    } catch (error) {
        console.error('Failed to load analytics:', error);
    } finally {
        state.isLoading = false;
    }
};

onMounted(() => {
    // Uncomment when backend is ready
    // loadData();
});
</script>

<style lang="scss">
.analytics-page {
    &__summary {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
    }
    
    &__card {
        background: rgb(255, 255, 255);
        border-radius: 16px;
        box-shadow: 0 6px 58px 0 rgba(196, 203, 214, 0.1);
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: center;
    }
    
    &__card-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #E6EDF5;
    }
    
    &__card-content {
        flex: 1;
        min-width: 100px;
    }
    
    &__card-value {
        font-size: 28px;
        font-weight: 700;
        color: #0A1629;
    }
    
    &__card-label {
        font-size: 14px;
        color: #7D8592;
    }
    
    &__card-stats {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        width: 100%;
    }
    
    &__stat {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 6px;
        
        &--success {
            background: #E3F5E1;
            color: #2E7D32;
        }
        
        &--warning {
            background: #FFF3E0;
            color: #EF6C00;
        }
        
        &--danger {
            background: #FFEBEE;
            color: #C62828;
        }
        
        &--muted {
            background: #F5F7FA;
            color: #7D8592;
        }
    }
    
    &__section {
        background: rgb(255, 255, 255);
        border-radius: 16px;
        box-shadow: 0 6px 58px 0 rgba(196, 203, 214, 0.1);
        padding: 20px;
        margin-bottom: 20px;
    }
    
    &__progress-bars {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    &__progress-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    &__progress-header {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #0A1629;
    }
    
    &__progress-bar {
        height: 8px;
        background: #E6EDF5;
        border-radius: 4px;
        overflow: hidden;
    }
    
    &__progress-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
        
        &--success {
            background: #4CAF50;
        }
        
        &--warning {
            background: #FF9800;
        }
        
        &--danger {
            background: #F44336;
        }
    }
    
    &__events {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    &__event {
        display: flex;
        gap: 16px;
        padding: 12px;
        background: #F5F7FA;
        border-radius: 12px;
    }
    
    &__event-date {
        font-size: 12px;
        color: #7D8592;
        min-width: 80px;
    }
    
    &__event-title {
        font-size: 14px;
        color: #0A1629;
    }
    
    &__activities {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    &__activity {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: #F5F7FA;
        border-radius: 12px;
    }
    
    &__activity-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: #E6EDF5;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    
    &__activity-content {
        flex: 1;
    }
    
    &__activity-text {
        font-size: 14px;
        color: #0A1629;
        margin-bottom: 4px;
    }
    
    &__activity-meta {
        font-size: 12px;
        color: #7D8592;
        display: flex;
        gap: 6px;
    }
    
    &__empty {
        padding: 24px;
        text-align: center;
        color: #7D8592;
        font-size: 14px;
    }
}
</style>
