<template>
  <teleport to="body">
    <transition name="navigation">
      <aside  v-if="app.showNavigation" class="navigation" @keyup.esc="closeNavigation" @click.self="closeNavigation" >
        <div class="navigation__container">
          <NavigationToggle class="navigation__logo"/>
          <nav class="navigation__nav">
            <ul class="navigation__menu">
              <li class="navigation__list" v-for="(item, index) in menuItems" :key="index">
                <div class="navigation__item" :class="{'navigation__item_active': isCurrentRoute(item.route)}">
                  <IconBase :data="{
                    iconName: item.icon,
                    iconColor: colorItem(isCurrentRoute(item.route))
                  }"/>
                  <router-link class="navigation__router"
                               :to="item.route"
                               :class="{'navigation__router_active': isCurrentRoute(item.route)}"
                               @click="closeNavigation">
                    {{ item.label }}
                  </router-link>
                </div>
              </li>
            </ul>
          </nav>
          <UiButton class="navigation__button"
                    @click="showSupport"
                    :data="{
                      title: 'Support'
                    }"
          />
          <div class="navigation__logout">
            <IconBase :data="{
              iconName: 'logout'
            }"/>
            <button class="navigation__button_logout">
              Log out
            </button>
          </div>
        </div>
      </aside>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { UiButton } from '@/shared/ui/button'
import { menuItems } from '@/widgets/navigation'

const router = useRouter()

import { useAppModel } from '@/entities/app'
import { NavigationToggle } from '@/features/navigation'
import { IconBase } from "@/shared/ui/icon-base";
import { lock, unlock } from "@/shared/lib/utils/isBlockScroll";

const app = useAppModel()
const isCurrentRoute = (path: string) => router.currentRoute.value.path === path;
const colorItem = (value: boolean) => value ? '#3F8CFF' : '#7D8592'

const closeNavigation = () => {
  app.updateShowMenu(false)
};

const showSupport = () => {
  app.updateShowMenu(false)
  app.updateShowSupport(true)
}

watch(() => app.showNavigation, (value) => {
  if (value) {
    lock()
  } else {
    unlock()
  }
})

</script>


<style lang="scss">
@import "style.module";
</style>
