<template>
    <div class="form-check form-switch">
        <input
            id="entity-type-tabbed-child-toggle"
            :value="value"
            class="form-check-input"
            type="checkbox"
            :checked="value"
            @change="emitter"
        >
        <!-- <label
            class="form-check-label"
            for="entity-type-tabbed-child-toggle"
        >
            {{ t('main.datamodel.detail.properties.tabbed-children') }}
        </label> -->
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            required: true
        },
    },
    emits: ['update'],
    setup(props, context) {
        const emitter = (e) => {
            context.emit('update', e.target.checked);
        };
        return { emitter };
    }
};
</script>