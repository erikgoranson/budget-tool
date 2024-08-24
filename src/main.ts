import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

//global layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import EmptyLayout from '@/layouts/EmptyLayout.vue';
import DashLayout from '@/layouts/DashLayout.vue';

import './assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component("DefaultLayout", DefaultLayout);
app.component("EmptyLayout", EmptyLayout);
app.component("DashLayout", DashLayout);

app.mount('#app');
