<template>
  <section class="employees-page">
    <HeaderPage />
    <div class="wrapper">
      <div v-if="store.isLoading" class="employees-page__loading">
        Загрузка...
      </div>
      <Tabs v-else :data="{
        tabs: tabs,
        activeTab: store.activeTab
      }" @onTab="handlerChangeTab">
        <template #Activity>
          <div class="employees-page__employees">
            <Card
              v-for="employee in list"
              :key="employee.id"
              :data="{
                isWhite: false,
                isBox: true,
                fullName: `${employee.firstName} ${employee.lastName}`,
                tag: employee.level || 'Employee',
                job: employee.position || 'Сотрудник',
                image: employee.avatar || 'https://via.placeholder.com/150',
              }"
            >
              <template #content>
                <div class="employees-page__task">
                  <div class="employees-page__column employees-page__column_center">
                    <div class="employees-page__date employees-page__date_big">{{ employee.workload?.backlogTasks || 0 }}</div>
                    <div class="employees-page__about">Backlog tasks</div>
                  </div>
                  <div class="employees-page__column employees-page__column_center">
                    <div class="employees-page__date employees-page__date_big">{{ employee.workload?.inProgressTasks || 0 }}</div>
                    <div class="employees-page__about">Tasks In Progress</div>
                  </div>
                  <div class="employees-page__column employees-page__column_center">
                    <div class="employees-page__date employees-page__date_big">{{ employee.workload?.inReviewTasks || 0 }}</div>
                    <div class="employees-page__about">Tasks In Review</div>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </template>
        <template #List>
          <div class="employees-page__employees">
            <CardEmployee
              v-for="employee in list"
              :key="employee.id"
              :data="{
                job: employee.email,
                name: `${employee.firstName} ${employee.lastName}`,
                isShowLine: true,
                isBorderRound: true,
                isShadow: true,
              }"
            >
              <template #content>
                <div class="employees-page__info">
                  <div class="employees-page__column">
                    <div class="employees-page__title">Отдел</div>
                    <div class="employees-page__date">{{ employee.department || '-' }}</div>
                  </div>
                  <div class="employees-page__column">
                    <div class="employees-page__title">Дата рождения</div>
                    <div class="employees-page__date">{{ employee.birthday || '-' }}</div>
                  </div>
                  <div class="employees-page__column">
                    <div class="employees-page__title">Статус</div>
                    <div class="employees-page__date">{{ employee.status || 'active' }}</div>
                  </div>
                </div>
                <div class="employees-page__job">
                  <div class="employees-page__title">
                    Должность
                  </div>
                  <div class="employees-page__position">
                    <span class="employees-page__description">
                      {{ employee.position || 'Сотрудник' }}
                    </span>
                    <Tag :data="{
                      text: employee.level || 'Employee'
                    }"/>
                  </div>
                </div>
              </template>
            </CardEmployee>
          </div>
        </template>
      </Tabs>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { Header } from '@/shared/ui/header'
import { CardEmployee } from '@/entities/employee'
import { Tag } from '@/shared/ui/tag'
import { Tabs } from '@/shared/ui/tabs'
import { Card } from '@/entities/user'
import { HeaderPage } from '@/entities/header-page'
import { employeesService, type Employee } from '@/shared/api'

useHead({
  title: 'CRM - Employees'
})

const tabs = [
  { label: 'Activity' },
  { label: 'List' }
]

const store = reactive({
  activeTab: 0,
  isLoading: true,
  employees: [] as Employee[],
})

const list = computed(() => store.employees.map((emp, i) => ({ id: i + 1, ...emp })))

const loadEmployees = async () => {
  store.isLoading = true
  try {
    const response = await employeesService.getEmployees()
    store.employees = response.data
  } catch (error) {
    console.error('Failed to load employees:', error)
  } finally {
    store.isLoading = false
  }
}

const handlerChangeTab = (value: number) => {
  store.activeTab = value;
}

onMounted(() => {
  loadEmployees()
})
</script>

<style lang="scss">
.employees-page {
  &__employees {
    height: 100%;
    margin-bottom: 52px;
  }
  &__info {
    display: flex;
    margin: 24px 0;
    justify-content: space-between;
  }
  &__title {
    margin-bottom: 4px;
  }
  &__date {
    font-size: 16px;
    color: rgb(10, 22, 41);
    line-height: 150%;
    &_big {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 12px;
    }
  }
  &__position {
    display: flex;
    column-gap: 12px;
    align-items: center;
  }
  &__column {
    &_center {
      text-align: center;
    }
  }
  &__description {
    color: rgb(10, 22, 41);
    font-size: 16px;
    line-height: 150%;
  }
  &__task {
    margin-top: 24px;
    display: flex;
    justify-content: space-around;
  }
}
</style>
