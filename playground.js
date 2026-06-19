import { usePlayground } from 'spacialist-plugin-playground';
import TabbedChildEntity from './src/components/TabbedChildEntity.vue';
import { defineComponent, h, ref } from 'vue';

usePlayground({
    http(verb, url, data, external = false, withHeaders = false) {

        if (url.endsWith("/entity_detail")){

            return {
                "1": {
                    "id": 10,
                    "entity_id": 1,
                    "attribute_id": 2,
                    "certainty": null,
                    "user_id": 2,
                    "value": "16805",
                    "attribute": {
                        "id": 1,
                        "thesaurus_url": "https:\/\/spacialist.escience.uni-tuebingen.de\/acad\/inv-number#20240301130408",
                        "datatype": "stringf",
                        "text": null,
                        "is_system": false,
                    }
                },
                "2": {
                    "id": 11,
                    "entity_id": 1,
                    "attribute_id": 2,
                    "certainty": null,
                    "user_id": 2,
                    "value": {
                        "id": 19,
                        "concept_url": "https:\/\/spacialist.escience.uni-tuebingen.de\/acad\/ceramic#20240122085928",
                        "concept_scheme": "no scheme",
                        "is_top_concept": false,
                        "created_at": "2024-01-22T08:59:28.000000Z",
                        "updated_at": "2024-01-22T08:59:28.000000Z",
                        "user_id": 2
                    },
                    "attribute": {
                        "id": 2,
                        "thesaurus_url": "https:\/\/spacialist.escience.uni-tuebingen.de\/acad\/inv-number#20240301130408",
                        "datatype": "string-sc",
                        "text": null,
                        "is_system": false,
                    }
                },
            }
        }

        throw new Error(`Unknown endpoint ${verb} ${url}`);
    }
});


const WrappedTabbedChildEntity = defineComponent({
    name: 'WrappedTabbedChildEntity',
    setup() {
        return () =>
            h(TabbedChildEntity, {
                id: '123',
            });
    }
});

SpPS.intoSlot({
    of: 'tabbed_child_entities',
    slot: 'tab',
    component: WrappedTabbedChildEntity,
})