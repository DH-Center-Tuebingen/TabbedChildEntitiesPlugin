import { computed, reactive, ref, watch } from 'vue';
// import App from './App.vue'
// import Files from './components/Files.vue';
import DataModelOptionsToggle from './components/DataModelOptionsToggle.vue';
import TabbedChildTab from './components/TabbedChildTab.vue';
import TabbedChildEntity from './components/TabbedChildEntity.vue';
import SelectTitle from './components/SelectTitle.vue';

// // Store (Vuex)
// import store from './bootstrap/store.js';

// // API
// import * as api from './bootstrap/api.js';

// // i18n
import en from '../i18n/en.json';
import de from '../i18n/de.json';

const pluginName = 'tabbed_child_entities';

// const vBind = reactive({
//     value: true
// });

// function setData(data) {
//     vBind.value = data.tabbed;
// }

function getData() {
    return {
        tabbed: vBind.value
    };
}

const vOn = {
    update: (checked) => vBind.value = checked
};

// watch(vBind, (value) => {
//     console.log('watch', value);
// });



SpPS.register({
    id: pluginName,
});

SpPS.registerI18n(
    pluginName,
    {
        en,
        de,
    }
)

SpPS.registerPreference({
    of: pluginName,
    key: "preference.title",
    data: "v-model",
    label: "plugin.tabbed_child_entities.preference.title",
    category: "system",
    subcategory: "interface",
    component: SelectTitle,
    default_value: 'entity_name'
})

const data = ref([]);

SpPS.registerDynalot({
    of: pluginName,
    slot: 'entity-detail-tabs',
    update: async ({ entity, response = null }) => {
        const nextData = [];
        if (response && response.tabbed_child_entities) {
            console.log('Received response with tabbed_child_entities:', response.tabbed_child_entities);
            for (const childData of response.tabbed_child_entities) {
                nextData.push({
                    id: childData.id,
                    value: childData
                });
            }
        }
        data.value = nextData
    },
    getData() {
        return data.value;
    },
    getComponent(name) {
        switch (name) {
            case 'tab': return TabbedChildTab;
            case 'panel': return TabbedChildEntity;
            default: throw new Error(`Unknown component ${name}`);
        }
    }
});
