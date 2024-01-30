/**
 * This file is a bit in limbo, as the symlink functionality is much needed, but
 * the symlinking of the directory is a leftover from the old plugin system.
 * 
 * This will be kept in place until the new structure is in place.
 */


import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import { join, sep } from 'path';
import pgPromise from 'pg-promise';


const { pluginName, packageName } = await getPackageJsonValues();


//// Cannot rename parent directory while running
renamePluginDirectoryPrompt(pluginName);

createSymlinkToJSFile();

const libDirName = 'lib';
const dirNames = await fs.readdir(join(import.meta.dirname, libDirName));
// Create symlink in parent directory
for(const dir of dirNames) {
    const base = import.meta.dirname;
    const srcPath = join(base, libDirName, dir);
    const destPath = join(base, dir);
    console.log(`Create symlink ${srcPath} -> ${destPath} ...`);
    try {
        await fs.symlink(srcPath, destPath);
        console.log(`Symlink successfully created for ${srcPath}!`);
    } catch(e) {
        console.error(`Failed to create symlink for ${srcPath}!`, e);
    }
}

async function getPackageJsonValues() {
    const pack = await readJsonFile(join(import.meta.dirname, 'package.json'), 'utf-8');
    if(!pack.pluginName) {
        throw new Error('pluginName not set in package.json');
    }
    const pluginName = pack.pluginName;

    if(!pack.name) {
        throw new Error('name not set in package.json');
    }
    const packageName = pack.name;

    return { pluginName, packageName };
}

async function createSymlinkToJSFile() {
    const uuid = await getPluginsUUID();
    const srcPath = join(import.meta.dirname, 'dist', packageName + '.umd.js');
    const destPath = getSpacialistPath('storage', 'app', 'public', 'plugins', `${pluginName.toLowerCase()}-${uuid}.js`);
    console.log(`Create symlink ${srcPath} -> ${destPath} ...`);
    await fs.symlink(srcPath, destPath);
}

function getSpacialistPath(...dest) {
    const spacialistRoot = join(import.meta.dirname, '..', '..', '..');
    return join(spacialistRoot, ...dest);
}

async function getPluginsUUID() {

    const programDotEnv = await fs.readFile(getSpacialistPath('.env'), 'utf-8');
    const programConfig = dotenv.parse(programDotEnv);

    const pgp = pgPromise();
    const db = pgp({
        host: programConfig.DB_HOST,
        port: programConfig.DB_PORT,
        database: programConfig.DB_DATABASE,
        user: programConfig.DB_USERNAME,
        password: programConfig.DB_PASSWORD,
    });

    const result = await db.oneOrNone('SELECT uuid FROM plugins where name=$1', [pluginName]);
    const isPackageInstalled = result == null ? false : true;

    if(!isPackageInstalled) {
        console.log('Package is not installed yet. You must install it manually in spacialist.');
        process.exit(0);
    }

    const uuid = result.uuid;
    return uuid;
}

async function renamePluginDirectoryPrompt(name) {

    const targetDirName = name[0].toUpperCase() + name.slice(1);

    const originalDir = import.meta.dirname;
    const parts = originalDir.split(sep);
    parts.pop();
    parts.push(targetDirName);
    const renamedDir = parts.join(sep);

    if(originalDir === renamedDir) {
        console.log(`Direcory name is corretly set!`);
    } else {
        //await fs.rename(originalDir, renamedDir)
        throw new Error(`You need to rename ${originalDir} to ${renamedDir} ...`);
    }
}


async function readJsonFile(path) {
    const txt = await fs.readFile(path, 'utf-8');
    return JSON.parse(txt);
}