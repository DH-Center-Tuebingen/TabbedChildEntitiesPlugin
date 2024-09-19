import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { XMLParser } from 'fast-xml-parser';
import { readFileSync } from 'fs';



function loadData() {
    const xmlParser = new XMLParser();

    const manifestText = readManifest();
    if (!manifestText) throw new Error('manifest.xml not found');

    const manifest = xmlParser.parse(manifestText);
    let pluginName = manifest?.info?.name;

    if (!pluginName) {
        throw new Error('manifest.xml does not contain a name');
    }

    return { manifest, pluginName };
}


function readManifest() {
    let manifest;
    const locations = ['manifest.xml', 'App/info.xml'];

    for (const location of locations) {
        try {
            manifest = readFileSync(location, 'utf8');
            break;
        } catch (e) {
            continue;
        }
    }

    return manifest;
}

const { pluginName } = loadData();

export default defineConfig({
    plugins: [vue()],
    build: {
        minify: false,
        lib: {
            entry: 'src/main.js',
            name: pluginName,
            fileName: (format) => `script.${format}.js`
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
