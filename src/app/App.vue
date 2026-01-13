<template>
    <section
        class="no-auth"
        v-if="!isAuthenticated"
    >
        <div class="wrapper">
            <aside class="no-auth__header">
                <div class="no-auth__logo">
                    <img
                        src="@/shared/assets/specialIcons/logo.svg"
                        alt="logo"
                        class="login__image"
                    >
                </div>
                <span class="no-auth__title">CRM</span>
            </aside>
        </div>
        <main class="no-auth__content">
            <router-view v-slot="{ Component }">
                <transition
                    name="page"
                    mode="out-in"
                >
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>
    </section>
    <section
        class="app"
        v-else
    >
        <!-- Desktop Sidebar -->
        <aside class="app__sidebar">
            <div class="app__sidebar-header">
                <img
                    src="@/shared/assets/specialIcons/logo.svg"
                    alt="logo"
                    class="app__sidebar-logo"
                >
                <span class="app__sidebar-title">CRM</span>
            </div>
            <nav class="app__sidebar-nav">
                <ul class="app__sidebar-menu">
                    <li class="app__sidebar-item" v-for="(item, index) in menuItems" :key="index">
                        <router-link 
                            class="app__sidebar-link"
                            :to="item.route"
                            :class="{'app__sidebar-link_active': isCurrentRoute(item.route)}"
                        >
                            <IconBase :data="{
                                iconName: item.icon,
                                iconColor: isCurrentRoute(item.route) ? '#3F8CFF' : '#7D8592'
                            }"/>
                            <span>{{ $t(item.labelKey) }}</span>
                        </router-link>
                    </li>
                </ul>
            </nav>
            <div class="app__sidebar-footer">
                <UiButton
                    class="app__sidebar-support"
                    @click="showSupport"
                    :data="{
                        title: $t('common.support')
                    }"
                />
                <div class="app__sidebar-logout" @click="handleLogout">
                    <IconBase :data="{
                        iconName: 'logout'
                    }"/>
                    <span>{{ $t('common.logout') }}</span>
                </div>
            </div>
        </aside>
        
        <!-- Main Content Area -->
        <div class="app__main">
            <Panel />
            <main class="app__content">
                <router-view v-slot="{ Component }">
                    <transition
                        name="page"
                        mode="out-in"
                    >
                        <component :is="Component" />
                    </transition>
                </router-view>
            </main>
        </div>
        
        <ActionPlus />
        <Navigation />
        <FabBottomSheet />
        <Support />
        <AddEmployee />
        <AddRequest />
        <AddTask />
        <AddEvent />
    </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Panel } from '@/widgets/panel';
import { Navigation } from '@/widgets/navigation';
import { FabBottomSheet } from '@/widgets/fab';
import { ActionPlus } from '@/features/action-plus';
import { Support } from '@/widgets/support';
import { isAuthenticated } from '@/shared/lib/utils/isAutorise';
import { AddEmployee } from '@/widgets/add-employee';
import { AddRequest } from '@/widgets/add-request'
import { AddTask } from '@/widgets/add-task'
import { AddEvent } from '@/widgets/add-event'
import { menuItems } from '@/widgets/navigation';
import { IconBase } from '@/shared/ui/icon-base';
import { UiButton } from '@/shared/ui/button';
import { useAppModel } from '@/entities/app';

const router = useRouter();
const app = useAppModel();

const isCurrentRoute = (path: string) => router.currentRoute.value.path === path;

const showSupport = () => {
    app.updateShowSupport(true);
};

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
};
</script>

<style lang="scss">
  @import 'index.scss';

  .no-auth {
    margin-top: 56px;
    &__header {
      display: flex;
      align-items: center;
      column-gap: 16px;
      justify-content: center;
    }
    &__title {
      color: rgb(58, 137, 255);
      font-size: 20px;
      font-weight: 700;
      line-height: 150%;
    }
  }
  
  // Desktop layout
  .app {
    display: flex;
    min-height: 100vh;
    
    &__sidebar {
      display: none;
      width: 280px;
      min-width: 280px;
      background: #fff;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
      flex-direction: column;
      padding: 24px 16px;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 100;
      
      @media (min-width: 1024px) {
        display: flex;
      }
    }
    
    &__sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 12px;
      margin-bottom: 32px;
    }
    
    &__sidebar-logo {
      width: 40px;
      height: 40px;
    }
    
    &__sidebar-title {
      color: #3F8CFF;
      font-size: 24px;
      font-weight: 700;
    }
    
    &__sidebar-nav {
      flex: 1;
    }
    
    &__sidebar-menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    &__sidebar-item {
      list-style: none;
    }
    
    &__sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      text-decoration: none;
      color: #7D8592;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.2s ease;
      
      &:hover {
        background: #F4F9FD;
        color: #3F8CFF;
      }
      
      &_active {
        background: #E8F1FF;
        color: #3F8CFF;
      }
    }
    
    &__sidebar-footer {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 16px;
      border-top: 1px solid #E6EDF5;
    }
    
    &__sidebar-support {
      width: 100%;
    }
    
    &__sidebar-logout {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      color: #7D8592;
      font-size: 16px;
      transition: all 0.2s ease;
      
      &:hover {
        color: #FF3B30;
      }
    }
    
    &__main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      
      @media (min-width: 1024px) {
        margin-left: 280px;
      }
    }
    
    &__content {
      flex: 1;
      padding-bottom: 80px;
      
      @media (min-width: 1024px) {
        padding-bottom: 24px;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
      }
    }
  }
  
  // Hide mobile navigation on desktop
  @media (min-width: 1024px) {
    .navigation,
    .fab-container,
    .action-plus {
      display: none !important;
    }
  }
</style>
