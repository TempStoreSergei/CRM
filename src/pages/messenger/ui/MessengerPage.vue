<template>
  <section class="messenger-page">
    <HeaderPage />
    <div class="wrapper">
      <div class="messenger-page__content">
        <div class="messenger-page__header">
          <Title :data="{
            isHighLeading: true,
            size: 'medium',
            title: 'Мессенджер',
          }"/>
          <div class="messenger-page__tabs">
            <button 
              :class="['messenger-page__tab', { 'messenger-page__tab--active': activeTab === 'telegram' }]"
              @click="activeTab = 'telegram'"
            >
              <IconBase :data="{ iconName: 'message' }"/>
              Telegram
            </button>
            <button 
              :class="['messenger-page__tab', { 'messenger-page__tab--active': activeTab === 'whatsapp' }]"
              @click="activeTab = 'whatsapp'"
            >
              <IconBase :data="{ iconName: 'messenger' }"/>
              WhatsApp
            </button>
          </div>
        </div>
        
        <!-- Connection status -->
        <div v-if="!connectionStatus.connected" class="messenger-page__connect">
          <div class="messenger-page__connect-info">
            <IconBase :data="{ iconName: activeTab === 'telegram' ? 'message' : 'messenger' }"/>
            <span>{{ activeTab === 'telegram' ? 'Telegram' : 'WhatsApp' }} не подключен</span>
          </div>
          <UiButton
            @click="connectPlatform"
            :data="{
              title: 'Подключить',
              type: 'button',
            }"
          />
        </div>

        <!-- Contacts list -->
        <div v-else class="messenger-page__main">
          <div class="messenger-page__contacts">
            <div class="messenger-page__contacts-header">
              <span>Контакты</span>
              <button class="messenger-page__add-btn" @click="showAddContact = true">
                <IconBase :data="{ iconName: 'addEmployee' }"/>
              </button>
            </div>
            <div v-if="isLoading" class="messenger-page__loading">Загрузка...</div>
            <div v-else class="messenger-page__contacts-list">
              <div 
                v-for="contact in contacts" 
                :key="contact.id"
                :class="['messenger-page__contact', { 'messenger-page__contact--active': selectedContact?.id === contact.id }]"
                @click="selectContact(contact)"
              >
                <div class="messenger-page__contact-avatar">
                  {{ contact.name.charAt(0) }}
                </div>
                <div class="messenger-page__contact-info">
                  <div class="messenger-page__contact-name">{{ contact.name }}</div>
                  <div class="messenger-page__contact-phone">{{ contact.phone }}</div>
                  <div v-if="contact.lastMessage" class="messenger-page__contact-last">
                    {{ contact.lastMessage.text.substring(0, 30) }}...
                  </div>
                </div>
              </div>
              <div v-if="contacts.length === 0" class="messenger-page__no-contacts">
                Нет контактов. Добавьте первый контакт!
              </div>
            </div>
          </div>

          <!-- Chat area -->
          <div class="messenger-page__chat">
            <template v-if="selectedContact">
              <div class="messenger-page__chat-header">
                <div class="messenger-page__chat-avatar">
                  {{ selectedContact.name.charAt(0) }}
                </div>
                <div class="messenger-page__chat-info">
                  <div class="messenger-page__chat-name">{{ selectedContact.name }}</div>
                  <div class="messenger-page__chat-platform">{{ activeTab === 'telegram' ? 'Telegram' : 'WhatsApp' }}</div>
                </div>
              </div>
              <div class="messenger-page__messages" ref="messagesContainer">
                <div 
                  v-for="message in messages" 
                  :key="message.id"
                  :class="['messenger-page__message', { 'messenger-page__message--outgoing': !message.isIncoming }]"
                >
                  <div class="messenger-page__message-text">{{ message.text }}</div>
                  <div class="messenger-page__message-time">
                    {{ formatTime(message.timestamp) }}
                    <span v-if="!message.isIncoming" class="messenger-page__message-status">
                      {{ message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓' }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="messenger-page__input-area">
                <input 
                  v-model="messageText"
                  type="text"
                  placeholder="Введите сообщение..."
                  class="messenger-page__input"
                  @keyup.enter="sendMessage"
                />
                <button class="messenger-page__send-btn" @click="sendMessage" :disabled="!messageText.trim() || isSending">
                  <IconBase :data="{ iconName: 'arrowRight' }"/>
                </button>
              </div>
            </template>
            <div v-else class="messenger-page__no-chat">
              Выберите контакт для начала переписки
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Contact Modal -->
    <PopUp
      @onClose="showAddContact = false"
      :data="{
        title: 'Добавить контакт',
        open: showAddContact,
      }"
    >
      <template #content>
        <form class="messenger-page__add-form" @submit.prevent="addContact">
          <UIInput
            @onInput="(val) => newContact.name = val"
            :data="{
              type: 'text',
              title: 'Имя',
              placeholder: 'Иван Иванов',
              name: 'name',
              value: newContact.name,
            }"
          />
          <UIInput
            @onInput="(val) => newContact.phone = val"
            :data="{
              type: 'tel',
              title: 'Телефон',
              placeholder: '+7 999 123-45-67',
              name: 'phone',
              value: newContact.phone,
            }"
          />
          <UIInput
            v-if="activeTab === 'telegram'"
            @onInput="(val) => newContact.telegramUsername = val"
            :data="{
              type: 'text',
              title: 'Telegram username (опционально)',
              placeholder: '@username',
              name: 'username',
              value: newContact.telegramUsername,
            }"
          />
        </form>
      </template>
      <template #bottom>
        <UiButton
          @click="addContact"
          :data="{
            title: isAddingContact ? 'Добавление...' : 'Добавить',
            type: 'button',
            isFull: true,
          }"
        />
      </template>
    </PopUp>
  </section>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import { Title } from '@/shared/ui/title'
import { IconBase } from '@/shared/ui/icon-base'
import { HeaderPage } from '@/entities/header-page'
import { UiButton } from '@/shared/ui/button'
import { UIInput } from '@/shared/ui/input'
import { PopUp } from '@/entities/popup'
import { 
  integrationsService, 
  type TelegramContact, 
  type WhatsAppContact, 
  type IntegrationMessage 
} from '@/shared/api'

useHead({
  title: 'CRM - Мессенджер'
})

const toast = useToast()

const activeTab = ref<'telegram' | 'whatsapp'>('telegram')
const isLoading = ref(false)
const isSending = ref(false)
const showAddContact = ref(false)
const isAddingContact = ref(false)

const connectionStatus = ref({ connected: false })
const contacts = ref<(TelegramContact | WhatsAppContact)[]>([])
const selectedContact = ref<TelegramContact | WhatsAppContact | null>(null)
const messages = ref<IntegrationMessage[]>([])
const messageText = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const newContact = reactive({
  name: '',
  phone: '',
  telegramUsername: '',
})

const formatTime = (timestamp: string) => {
  try {
    return format(new Date(timestamp), 'HH:mm')
  } catch {
    return ''
  }
}

const checkConnectionStatus = async () => {
  try {
    if (activeTab.value === 'telegram') {
      connectionStatus.value = await integrationsService.getTelegramStatus()
    } else {
      connectionStatus.value = await integrationsService.getWhatsAppStatus()
    }
  } catch (error) {
    console.error('Error checking connection status:', error)
    connectionStatus.value = { connected: false }
  }
}

const loadContacts = async () => {
  if (!connectionStatus.value.connected) return
  
  isLoading.value = true
  try {
    if (activeTab.value === 'telegram') {
      contacts.value = await integrationsService.getTelegramContacts()
    } else {
      contacts.value = await integrationsService.getWhatsAppContacts()
    }
  } catch (error) {
    console.error('Error loading contacts:', error)
    toast.error('Не удалось загрузить контакты')
  } finally {
    isLoading.value = false
  }
}

const selectContact = async (contact: TelegramContact | WhatsAppContact) => {
  selectedContact.value = contact
  try {
    if (activeTab.value === 'telegram') {
      messages.value = await integrationsService.getTelegramMessages(contact.id)
    } else {
      messages.value = await integrationsService.getWhatsAppMessages(contact.id)
    }
    // Scroll to bottom
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  } catch (error) {
    console.error('Error loading messages:', error)
  }
}

const sendMessage = async () => {
  if (!messageText.value.trim() || !selectedContact.value) return
  
  isSending.value = true
  try {
    const message = await integrationsService.sendMessage({
      contactId: selectedContact.value.id,
      text: messageText.value,
      platform: activeTab.value,
    })
    messages.value.push(message)
    messageText.value = ''
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  } catch (error) {
    console.error('Error sending message:', error)
    toast.error('Не удалось отправить сообщение')
  } finally {
    isSending.value = false
  }
}

const connectPlatform = async () => {
  try {
    if (activeTab.value === 'telegram') {
      const result = await integrationsService.connectTelegram()
      toast.info(`Откройте Telegram и найдите бота. Код верификации: ${result.verificationCode}`)
    } else {
      const result = await integrationsService.connectWhatsApp()
      toast.info('Отсканируйте QR-код в WhatsApp')
    }
  } catch (error) {
    console.error('Error connecting:', error)
    toast.error('Ошибка подключения')
  }
}

const addContact = async () => {
  if (!newContact.name || !newContact.phone) {
    toast.error('Заполните имя и телефон')
    return
  }
  
  isAddingContact.value = true
  try {
    if (activeTab.value === 'telegram') {
      const contact = await integrationsService.addTelegramContact({
        name: newContact.name,
        phone: newContact.phone,
        telegramUsername: newContact.telegramUsername,
      })
      contacts.value.push(contact)
    } else {
      const contact = await integrationsService.addWhatsAppContact({
        name: newContact.name,
        phone: newContact.phone,
      })
      contacts.value.push(contact)
    }
    toast.success('Контакт добавлен!')
    showAddContact.value = false
    newContact.name = ''
    newContact.phone = ''
    newContact.telegramUsername = ''
  } catch (error) {
    console.error('Error adding contact:', error)
    toast.error('Ошибка добавления контакта')
  } finally {
    isAddingContact.value = false
  }
}

watch(activeTab, () => {
  selectedContact.value = null
  messages.value = []
  checkConnectionStatus()
  loadContacts()
})

onMounted(() => {
  checkConnectionStatus()
  loadContacts()
})
</script>

<style lang="scss">
.messenger-page {
  &__content {
    background: white;
    border-radius: 24px;
    box-shadow: 0 6px 58px 0 rgba(196, 203, 214, 0.1);
    margin-bottom: 60px;
    min-height: 70vh;
  }

  &__header {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E6EDF5;
  }

  &__tabs {
    display: flex;
    gap: 8px;
  }

  &__tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: none;
    border-radius: 12px;
    background: #F5F7FA;
    color: #7D8592;
    cursor: pointer;
    transition: all 0.2s;

    &--active {
      background: #3A89FF;
      color: white;
    }
  }

  &__connect {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 20px;
  }

  &__connect-info {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    color: #7D8592;
  }

  &__main {
    display: flex;
    min-height: 500px;
  }

  &__contacts {
    width: 300px;
    border-right: 1px solid #E6EDF5;
  }

  &__contacts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    font-weight: 600;
    color: #0A1629;
  }

  &__add-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background: #3A89FF;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__contacts-list {
    max-height: 450px;
    overflow-y: auto;
  }

  &__contact {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #F5F7FA;
    }

    &--active {
      background: #E6EDF5;
    }
  }

  &__contact-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #3A89FF;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
  }

  &__contact-info {
    flex: 1;
    overflow: hidden;
  }

  &__contact-name {
    font-weight: 600;
    color: #0A1629;
  }

  &__contact-phone {
    font-size: 12px;
    color: #7D8592;
  }

  &__contact-last {
    font-size: 12px;
    color: #7D8592;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__no-contacts {
    padding: 40px 20px;
    text-align: center;
    color: #7D8592;
  }

  &__chat {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__chat-header {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid #E6EDF5;
  }

  &__chat-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #3A89FF;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  &__chat-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__chat-name {
    font-weight: 600;
    color: #0A1629;
  }

  &__chat-platform {
    font-size: 12px;
    color: #7D8592;
  }

  &__messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__message {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 16px;
    background: #F5F7FA;
    align-self: flex-start;

    &--outgoing {
      background: #3A89FF;
      color: white;
      align-self: flex-end;
    }
  }

  &__message-text {
    margin-bottom: 4px;
  }

  &__message-time {
    font-size: 10px;
    opacity: 0.7;
    text-align: right;
  }

  &__message-status {
    margin-left: 4px;
  }

  &__input-area {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid #E6EDF5;
  }

  &__input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #E6EDF5;
    border-radius: 12px;
    outline: none;

    &:focus {
      border-color: #3A89FF;
    }
  }

  &__send-btn {
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 12px;
    background: #3A89FF;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__no-chat {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7D8592;
  }

  &__loading {
    padding: 40px;
    text-align: center;
    color: #7D8592;
  }

  &__add-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
