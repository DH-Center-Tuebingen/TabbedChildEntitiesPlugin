import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import packageJson from './package.json';

const pluginName = packageJson.pluginName;

if (!pluginName) {
    throw new Error('package.json is missing a pluginName');
}

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: 'src/main.js',
            name: pluginName,
            fileName: (format) => `spacialist_${pluginName.toLocaleLowerCase()}.${format}.js`
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
});
