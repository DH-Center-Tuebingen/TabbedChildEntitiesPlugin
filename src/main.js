import { computed, reactive, ref, watch } from 'vue';
// import App from './App.vue'
// import Files from './components/Files.vue';
import DataModelOptionsToggle from './components/DataModelOptionsToggle.vue';

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


const entityDetail = reactive({
    tabs: [],
});

// :style="{
//     color: getEntityColors(child.entity_type_id).backgroundColor,
//     textShadow: '0 0 1px rgba(0, 0, 0, 0.3)',
// }"
// href="#"
// @click.prevent="setEntityView(child)"
// >
// <i class="fas fa-fw fa-cube" />
// <span>{{ child.name }}</span>
// <span> {{ getEntityTypeName(child.entity_type_id) ?? child.entity_type_id }}</span>
// </a>

SpPS.subscribe({
    of: pluginName,
    topic: 'entityDetail',
    update: async (entity) => {
        entityDetail.tabs = [];
        console.log('entityDetail', entity);
        let children = entity.children;
        if (!entity.childrenLoaded) {
            console.log(SpPS.api.store);
            children = await SpPS.api.store.dispatch('fetchEntityChildren', entity.id);
        }

        entityDetail.tabs = children.map(val => val.name);
    },
    components: reactive({
        tabs: computed(() => {
            console.log(entityDetail);
            return entityDetail.tabs.map(val => {
                return {
                    component: {
                        template: `<div>
                        <i class="fas fa-fw fa-cube" />
                        <span>${val}</span>
                        </div>`
                    },
                    view: `entity-${val}`
                };
            });
        }),
        panels: computed(() => {
            console.log(entityDetail);
            return entityDetail.tabs.map(val => {
                return {
                    component: { template: `<div>${val}</div>` },
                    view: `entity-${val}`
                };
            });
        })
    })
});
