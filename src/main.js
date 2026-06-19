import { computed, reactive, ref, watch } from 'vue';
// import App from './App.vue'
// import Files from './components/Files.vue';
import DataModelOptionsToggle from './components/DataModelOptionsToggle.vue';
import TabbedChildTab from './components/TabbedChildTab.vue';
import TabbedChildEntity from './components/TabbedChildEntity.vue';

// // Store (Vuex)
// import store from './bootstrap/store.js';

// // API
// import * as api from './bootstrap/api.js';

// // i18n
// import * as en from './i18n/en.json';
// import * as de from './i18n/de.json';
// import * as ja from './i18n/ja.json';

const pluginName = 'tabbed_child_entities';

const vBind = reactive({
    value: true
});

function setData(data) {
    vBind.value = data.tabbed;
}

function getData() {
    return {
        tabbed: vBind.value
    };
}

const vOn = {
    update: (checked) => vBind.value = checked
};

watch(vBind, (value) => {
    console.log('watch', value);
});



SpPS.register({
    id: pluginName,
});

SpPS.intoSlot({
    of: pluginName,
    key: pluginName,
    slot: 'dataModelOptions',
    component: DataModelOptionsToggle,
    componentTag: 'DataModelOptionsToggle',
    vBind: vBind,
    vOn: vOn,
    methods: {
        getData,
        setData,
    }
});


const data = ref([]);

SpPS.registerDynalot({
    of: pluginName,
    slot: 'entity-detail-tabs',
    update: async ({ entity, response = null }) => {
        const nextData = [];
        if (response && response.tabbed_child_entities) {
            for (const { id, name, type } of response.tabbed_child_entities) {
                nextData.push({
                    id,
                    name,
                    type,
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
