<template>
    <section class="projects-page">
        <HeaderPage />
        <div class="wrapper">
            <div v-if="isLoading" class="projects-page__loading">
                {{ $t('common.loading') }}
            </div>
            <div v-else-if="vacations.length === 0" class="projects-page__empty">
                {{ $t('vacations.noVacations') }}
            </div>
            <div v-else class="projects-page__employees">
                <CardEmployee
                    v-for="vacation in vacations"
                    :key="vacation.id"
                    :data="{
                        job: vacation.user.email,
                        name: vacation.user.name,
                        isShowLine: true,
                        isBorderRound: true,
                        isShadow: true,
                    }"
                >
                    <template #content>
                        <div class="projects-page__info">
                            <div class="projects-page__column">
                                <div class="projects-page__title">
                                    {{ $t('vacations.from') }}
                                </div>
                                <div class="projects-page__date">
                                    {{ formatDate(vacation.startDate) }}
                                </div>
                            </div>
                            <div class="projects-page__column">
                                <div class="projects-page__title">
                                    {{ $t('vacations.to') }}
                                </div>
                                <div class="projects-page__date">
                                    {{ formatDate(vacation.endDate) }}
                                </div>
                            </div>
                            <div class="projects-page__column">
                                <div class="projects-page__title">
                                    {{ $t('vacations.total') }}
                                </div>
                                <div class="projects-page__date">
                                    {{ vacation.totalDays }}
                                </div>
                            </div>
                        </div>
                    </template>
                </CardEmployee>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { useI18n } from 'vue-i18n';
import { CardEmployee } from '@/entities/employee';
import { HeaderPage } from '@/entities/header-page';
import { vacationsService, type Vacation } from '@/shared/api';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

const { t, locale } = useI18n();

useHead({
  title: () => `CRM - ${t('vacations.title')}`
});

const vacations = ref<Vacation[]>([]);
const isLoading = ref(true);

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dateLocale = locale.value === 'ru' ? ru : enUS;
    return format(date, 'd MMM yyyy', { locale: dateLocale });
};

const loadVacations = async () => {
    isLoading.value = true;
    try {
        const response = await vacationsService.getVacations();
        vacations.value = response.data;
    } catch (error) {
        console.error('Failed to load vacations:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    loadVacations();
});
</script>

<style lang="scss">
.projects-page {
  &__employees {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    margin-bottom: 50px;
  }
  &__loading,
  &__empty {
    padding: 20px;
    text-align: center;
    color: #7D8592;
  }
  &__info {
    display: flex;
    margin-top: 24px;
    justify-content: space-between;
  }
  &__title {
    margin-bottom: 4px;
  }
  &__date {
    font-size: 16px;
    color: rgb(10, 22, 41);
    line-height: 150%;
  }
}
</style>
