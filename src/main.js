// import { createApp } from 'vue'
// import App from './App.vue'
// import Files from './components/Files.vue';

import HelloWorld from './components/HelloWorld.vue';

// // Store (Vuex)
// import store from './bootstrap/store.js';

// // API
// import * as api from './bootstrap/api.js';

// // i18n
// import * as en from './i18n/en.json';
// import * as de from './i18n/de.json';
// import * as ja from './i18n/ja.json';


SpPS.register({
    id: 'template'
});
SpPS.intoSlot({
    of: 'template',
    key: 'template',
    slot: 'tab',
    icon: 'fa-folder',
    label: 'template',
    component: HelloWorld,
    componentTag: 'tmp',
});
