import { CustomError } from 'ts-custom-error';
import fse from 'fs-extra';
import inquirer from 'inquirer';
import { getLogger } from 'log4js';
import { isAbsolute, join, relative, extname, basename, dirname, parse, format } from 'path';
import glob from 'micromatch';
import childProcess, { exec as exec$2 } from 'child_process';
import { diffLines } from 'diff';
import chalk from 'chalk';
import { isNil, prop, mergeDeepLeft, pick, clone, hasPath, T, identity as identity$1, unnest } from 'ramda';
import git from 'simple-git/promise';
import validateNpmPackageName from 'validate-npm-package-name';
import semver from 'semver';
import { promisify } from 'util';
import EventEmitter from 'events';
import yaml from 'js-yaml';
import cosmiconfig from 'cosmiconfig';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ejs$1 from 'ejs';
import merge from 'merge-deep';
import mustache$1 from 'mustache';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class MissingFileError extends CustomError {
    constructor(file) {
        super(`Cannot find ${file}`);
        this.file = file;
    }
}

const inquirerPrompter = (questions) => __awaiter(undefined, void 0, void 0, function* () { return yield inquirer.prompt(questions); });

const logger = getLogger('mili-core');
if (process.env.NODE_ENV === 'development')
    logger.level = 'debug';
else
    logger.level = 'info';

const execteFuncInSubproject = (func, dir, options, errors) => __awaiter(undefined, void 0, void 0, function* () {
    const stats = yield Effect.fs.stat(dir);
    if (!stats.isDirectory())
        return;
    if (yield Effect.fs.pathExists(join(dir, '.milirc.yml'))) {
        Effect.logger.info(`Find project ${dir}`);
        try {
            const newOptions = Object.assign({}, options, { cwd: dir });
            yield func(newOptions);
        }
        catch (e) {
            errors.push({ dir, message: e.message });
        }
        finally {
            console.log('\n');
        }
    }
    let folders = yield Effect.fs.readdir(dir);
    folders = folders
        .map(filename => join(dir, filename))
        .filter(filepath => !glob.isMatch(filepath, options.ignore));
    /**
     * NOTE: There should upgrade one by one,
     *       because it's possible that two of these projects were used same template,
     *       resulting in template download conflict.
     */
    for (const folder of folders) {
        yield execteFuncInSubproject(func, folder, options, errors);
    }
});
var recursiveExecte = (func) => (options) => __awaiter(undefined, void 0, void 0, function* () {
    const { cwd = process.cwd(), ignore = [], recursive = false, } = options;
    if (!recursive) {
        yield func(options);
    }
    else {
        const absolutePathIgnored = ignore.map((item) => {
            if (!isAbsolute(item))
                return join(cwd, item);
            return item;
        });
        const newOptions = Object.assign({}, options, { ignore: absolutePathIgnored });
        const errors = [];
        yield execteFuncInSubproject(func, cwd, newOptions, errors);
        if (errors.length) {
            errors.forEach(error => {
                Effect.logger.error([
                    '',
                    `Fail: ${error.dir}.`,
                    `Because: ${error.message}`,
                    '',
                ].join('\n'));
            });
            throw new Error('Please fix the error.');
        }
    }
});

var installDeps = (path) => new Promise((resolve, reject) => {
    logger.info('install template dependencies...');
    exec$2('npm install --production', { cwd: path }, (error, stdout, stderr) => {
        if (error) {
            logger.error('Unable install template dependencies');
            return reject(error);
        }
        // process.stdout.write(stdout)
        process.stderr.write(stderr);
        resolve();
    });
});

const createLineNumberFormater = (maxOldLineNumberLength, maxNewLineNumberLength) => (oldNumber, newNumber) => {
    const oldNumberStr = isNil(oldNumber) ? ' ' : String(oldNumber);
    const newNumberStr = isNil(newNumber) ? ' ' : String(newNumber);
    const oldN = oldNumberStr.padEnd(maxOldLineNumberLength, ' ');
    const newN = newNumberStr.padEnd(maxNewLineNumberLength, ' ');
    return `${oldN}|${newN} `;
};
const createLineFormater = (maxOldLineNumber, maxNewLineNumber) => {
    const maxOldLineNumberLength = String(maxOldLineNumber).length;
    const maxNewLineNumberLength = String(maxNewLineNumber).length;
    const formatLineNumber = createLineNumberFormater(maxOldLineNumberLength, maxNewLineNumberLength);
    return (oldNumber, newNumber, tag, str, fold) => {
        let lines = str.match(/((.*\n)|(.+$))/g) || [];
        lines = lines
            .map((line, i) => {
            const oldNumberWithOffset = oldNumber && oldNumber + i;
            const newNumberWithOffset = newNumber && newNumber + i;
            const lineNumber = formatLineNumber(oldNumberWithOffset, newNumberWithOffset);
            return `${lineNumber} ${tag} ${line.replace(/(\n$)/, '')}\n`;
        });
        if (fold && lines.length > 2) {
            const dot = '...\n'.padStart(maxOldLineNumberLength + 3, ' ');
            lines.splice(1, lines.length - 2, dot);
        }
        return lines.join('');
    };
};
const createEndLineValider = (diffPairs) => {
    const index = [...diffPairs].reverse().findIndex(item => !item.added && !item.removed);
    const count = diffPairs.length - 1;
    const lastSamePairIndex = index >= 0 ? count - index : index;
    return i => {
        if (lastSamePairIndex < i)
            return true;
        else if (lastSamePairIndex === diffPairs.length - 1 && lastSamePairIndex === i)
            return true;
        return false;
    };
};
function showDiff(filename, oldContent, newContent, options = {}) {
    let str = '';
    let oldLineNumber = 1;
    let newLineNumber = 1;
    const maxOldLineNumber = oldContent.split('\n').length;
    const maxNewLineNumber = oldContent.split('\n').length;
    const formatLine = createLineFormater(maxOldLineNumber, maxNewLineNumber);
    const diffPairs = diffLines(oldContent, newContent);
    const isEndLine = createEndLineValider(diffPairs);
    diffPairs.forEach(({ added, removed, value }, i) => {
        const needFillEndLine = isEndLine(i);
        const inc = value.split('\n').length - 1;
        if (added) {
            const strWithoutColor = formatLine(null, newLineNumber, '+', value);
            str += chalk.green(strWithoutColor);
            newLineNumber += inc;
        }
        else if (removed) {
            const strWithoutColor = formatLine(oldLineNumber, null, '-', value);
            str += chalk.red(strWithoutColor);
            oldLineNumber += inc;
        }
        else {
            const strWithoutColor = formatLine(oldLineNumber, newLineNumber, ' ', value, options.fold);
            str += chalk.grey(strWithoutColor);
            newLineNumber += inc;
            oldLineNumber += inc;
        }
        /**
         * Add an empty line,
         * if '\n' at the end of file.
         * So, It's easy to tell if the last line end with '\n'
         */
        if (needFillEndLine && /\n$/.test(value)) {
            if (added) {
                const strWithoutColor = formatLine(null, newLineNumber, '+', '\n');
                str += chalk.green(strWithoutColor);
                newLineNumber += 1;
            }
            else if (removed) {
                const strWithoutColor = formatLine(oldLineNumber, null, '-', '\n');
                str += chalk.red(strWithoutColor);
                oldLineNumber += 1;
            }
            else {
                const strWithoutColor = formatLine(oldLineNumber, newLineNumber, ' ', '\n');
                str += chalk.grey(strWithoutColor);
                newLineNumber += 1;
                oldLineNumber += 1;
            }
        }
    });
    const headerLength = filename.length + 4;
    const header = chalk.yellow([
        Array(headerLength).fill('=').join(''),
        `  ${filename}  `,
        Array(headerLength).fill('-').join(''),
    ].join('\n'));
    const footer = chalk.yellow(Array(headerLength).fill('=').join(''));
    return ['\n', header, str, footer].join('\n');
}

var isRelativePath = (path) => /^\.\.?\//.test(path);

var relativePath = (root, path) => `./${relative(root, path)}`;

var dirExist = (path) => __awaiter(undefined, void 0, void 0, function* () {
    const exist = yield Effect.fs.pathExists(path);
    if (!exist)
        return false;
    return yield isDirectory(path);
});

var isRootDirOfRepo = (path) => __awaiter(undefined, void 0, void 0, function* () {
    if (!(yield dirExist(path)))
        return false;
    if (!(yield git(path).checkIsRepo()))
        return false;
    const toplevel = yield git(path).revparse(['--show-toplevel']);
    if (toplevel.replace(/\n$/, '') !== path)
        return false;
    return true;
});

var isChildPathOf = (parent) => (child) => {
    if (child === parent)
        return false;
    const parentTokens = parent.split('/').filter(i => i.length);
    const childTokens = child.split('/').filter(i => i.length);
    return parentTokens.every((t, i) => childTokens[i] === t);
};

var isEmptyDir = (path) => __awaiter(undefined, void 0, void 0, function* () {
    const files = yield Effect.fs.readdir(path);
    return !files.length;
});

const reminder = [
    'This command may cause some files to be overwritten',
    "If you're sure you want to run this command, rerun it with --force.",
].join('\n');
const isWorkDirClean = (path) => __awaiter(undefined, void 0, void 0, function* () {
    const isRepo = yield git(path).checkIsRepo();
    if (!isRepo)
        throw new Error('The work directory checked should be an repository');
    const { files } = yield git(path).status();
    let toplevel = yield git(path).revparse(['--show-toplevel']);
    toplevel = toplevel.replace(/\n$/, '');
    return !files
        .map(file => join(toplevel, file.path))
        .filter(isChildPathOf(path))
        .length;
});
var checkWorkDir = (path) => __awaiter(undefined, void 0, void 0, function* () {
    const isRepo = yield git(path).checkIsRepo();
    if (!isRepo && !(yield isEmptyDir(path))) {
        throw new Error([
            'The project directory is not a git repository and is a non-empty folder.',
            reminder,
        ].join('\n'));
    }
    else if (isRepo && !(yield isWorkDirClean(path))) {
        throw new Error([
            'Git working directory not clean',
            reminder,
        ].join('\n'));
    }
});

const gitUrlRegexp = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?$/;
function validateGitRepoUrl (str) {
    return gitUrlRegexp.test(str);
}

function isDirectory (path) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = yield Effect.fs.stat(path);
        return stats.isDirectory();
    });
}

class Effect {
    static replace(options = {}) {
        if (options.fs)
            this.fs = options.fs;
        if (options.prompter)
            this.prompter = options.prompter;
        if (options.logger)
            this.logger = options.logger;
    }
}
Effect.fs = fse;
Effect.prompter = inquirerPrompter;
Effect.logger = logger;

class CompiledFile {
    constructor(templatePath, content, encoding, projectPath, resource, projectFileExisted) {
        /** Delete project file */
        this.deleted = false;
        /** Need to render file */
        this.renderable = true;
        /** Additional file information that added by handler */
        this.addition = {};
        this.templatePath = templatePath;
        this.projectPath = projectPath;
        this.projectFileExisted = projectFileExisted;
        this.encoding = encoding;
        this.content = content;
        this.resource = resource;
    }
    getProjectContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectPath, encoding } = this;
            if (!isNil(this.projectContent))
                return this.projectContent;
            if (!this.projectFileExisted)
                throw new Error(`Cannot get content from an unexisted file ${projectPath}.`);
            this.projectContent = yield Effect.fs.readFile(projectPath, encoding);
            return this.projectContent;
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deleted) {
                yield Effect.fs.remove(this.projectPath);
                return;
            }
            if (!this.renderable)
                return;
            const { projectPath, content, encoding } = this;
            yield Effect.fs.writeFile(projectPath, content, encoding);
        });
    }
    check(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectPath, deleted, renderable, projectFileExisted } = this;
            if (deleted && projectFileExisted)
                throw new Error(`${projectPath}: Should be removed`);
            if (!renderable)
                return true;
            if (!projectFileExisted)
                throw new Error(`${projectPath}: Not exist`);
            const projectContent = yield this.getProjectContent();
            if (this.content === projectContent)
                return true;
            if (options.showDiff) {
                const diff = showDiff(this.projectPath, projectContent, this.content, { fold: options.fold });
                throw new Error(diff);
            }
            else {
                throw new Error(`${projectPath}: Not match template.`);
            }
        });
    }
}

var Encoding;
(function (Encoding) {
    Encoding["UTF8"] = "utf8";
    Encoding["Binary"] = "binary";
    Encoding["Hex"] = "hex";
    Encoding["ASCII"] = "ascii";
})(Encoding || (Encoding = {}));

var UpgradeType;
(function (UpgradeType) {
    UpgradeType["Cover"] = "cover";
    UpgradeType["Keep"] = "keep";
    UpgradeType["Exist"] = "exist";
    UpgradeType["Merge"] = "merge";
})(UpgradeType || (UpgradeType = {}));

const TEMPLATE_STORAGE = join(__dirname, '../templates');

const binaryFileExtensitions = ['.jpeg', '.jpg', '.png', '.ico'];
const inferFileEncoding = path => {
    if (binaryFileExtensitions.includes(extname(path)))
        return Encoding.Binary;
    return Encoding.UTF8;
};

function inferEncodingByMapping (mapping) {
    const encodingRegExpMap = Object.entries(mapping)
        .map(([key, value]) => {
        if (typeof value === 'string') {
            const pattern = new RegExp(value);
            return { encoding: key, match: v => pattern.test(v) };
        }
        else if (typeof value === 'function') {
            return { encoding: key, match: v => value(v) };
        }
        throw new Error('Encoding mapping should be function or regexp');
    });
    return path => {
        const item = encodingRegExpMap.find(item => item.match(path));
        if (item && Object.values(Encoding).includes(item.encoding))
            return item.encoding;
        else
            return inferFileEncoding(path);
    };
}

function inferEncodingImmobile (encoding) {
    const inferEncoding = () => encoding;
    return inferEncoding;
}

class File {
    constructor(path, inferEncoding = inferFileEncoding, handler) {
        this.templatePath = path;
        this.inferEncoding = inferEncoding;
        this.handler = handler;
    }
    compile(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readTemplateFile();
            const { templatePath } = this;
            let projectPath = templatePath;
            projectPath = relative(resource.template.path, this.templatePath);
            projectPath = join(resource.project.path, projectPath);
            if (this.handler) {
                projectPath = yield this.handler.genPath(projectPath, resource);
            }
            const content = yield this.readTemplateFile();
            const encoding = this.inferEncoding(this.templatePath);
            const projectFileExisted = yield Effect.fs.pathExists(projectPath);
            const compiledFile = new CompiledFile(templatePath, content, encoding, projectPath, resource, projectFileExisted);
            if (this.handler)
                yield this.handler.genFile(compiledFile, resource);
            return compiledFile;
        });
    }
    readTemplateFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const { templatePath, inferEncoding } = this;
            const encoding = inferEncoding(templatePath);
            return yield Effect.fs.readFile(templatePath, encoding);
        });
    }
}

class Repository {
    constructor() {
        this.owner = '';
        this.name = '';
        this.versions = null;
    }
    static format(str) {
        return __awaiter(this, void 0, void 0, function* () {
            const githubSH = /^(github:)[-a-zA-Z0-9@:%._+~#=]+\/[-a-zA-Z0-9@:%._+~#=]+$/;
            const gitUrlRegexp = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?$/;
            let repo;
            if (isRelativePath(str) || isAbsolute(str)) {
                const localRepo = new LocalRepository(str);
                if (!(yield localRepo.existed())) {
                    throw new Error(`Template path cannot be found. Ensure it is an exist directory: ${localRepo.path}.`);
                }
                repo = localRepo;
            }
            else if (gitUrlRegexp.test(str)) {
                repo = new GitRepository(str);
            }
            else if (/^npm:/.test(str) && validateNpmPackageName(str.substring('npm:'.length))) {
                repo = new NpmRepository(str.substring('npm:'.length));
            }
            else if (githubSH.test(str)) {
                repo = new GitRepository(`https://github.com/${str.replace(/^github:/, '')}.git`);
            }
            else {
                throw new Error(`Invalid repository url: ${str}`);
            }
            if (!(yield repo.isVerioning()))
                logger.warn('The template repository is not versioned.');
            yield repo.checkout('latest');
            return repo;
        });
    }
    hasVersion(version) {
        return __awaiter(this, void 0, void 0, function* () {
            const versions = yield this.getVersions();
            return versions.includes(version);
        });
    }
    checkout(version = 'latest') {
        return __awaiter(this, void 0, void 0, function* () {
            if (version !== 'latest' && version !== 'default' && !semver.valid(version)) {
                throw new Error('Semantic version expected.');
            }
            const versions = yield this.getVersions();
            if (version === 'default') {
                this.version = 'default';
            }
            else if (version === 'latest') {
                if (versions.length)
                    this.version = versions[0];
                else
                    this.version = undefined;
            }
            else if (versions.includes(version)) {
                this.version = version;
            }
            else {
                throw new Error(`Cannot find template for the version ${version} `);
            }
        });
    }
    isVerioning() {
        return __awaiter(this, void 0, void 0, function* () {
            const versions = yield this.getVersions();
            if (versions.length)
                return true;
            return false;
        });
    }
    isLatest() {
        return __awaiter(this, void 0, void 0, function* () {
            const versions = yield this.getVersions();
            if (versions.length && this.version === versions[0])
                return true;
            return false;
        });
    }
    installDeps() {
        return __awaiter(this, void 0, void 0, function* () {
            const { storage } = this;
            const npmConfigFile = join(storage, 'package.json');
            const npmConfigFileExist = yield Effect.fs.pathExists(npmConfigFile);
            if (npmConfigFileExist)
                yield installDeps(storage);
        });
    }
    install(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { version } = this;
            if (version && !this.hasVersion(version)) {
                throw new Error(`The template version ${version} is not existed.`);
            }
            yield this.download();
            if (!options.noDeps)
                yield this.installDeps();
            return Template$1.load(this);
        });
    }
}

const gitUrlRegexp$1 = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?$/;
class GitRepository extends Repository {
    constructor(url) {
        super();
        this.type = 'git';
        this.url = url;
        const matched = url.match(gitUrlRegexp$1);
        const [, , , , , , , links] = matched;
        const [owner, name] = links.split('/').slice(-2);
        this.owner = owner;
        this.name = name;
    }
    get record() {
        return this.url;
    }
    get storage() {
        const { url, version } = this;
        return join(TEMPLATE_STORAGE, encodeURIComponent(url), version || 'noversion');
    }
    getVersions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.versions)
                return this.versions;
            const result = yield git().listRemote(['--tags', this.url]);
            const arr = result.split('\n');
            const versions = arr
                .filter(item => item.length && !/\^{}$/.test(item))
                .map(item => {
                const [, ref] = item.split(/\s+/);
                const number = ref.substring('refs/tags/v'.length);
                return number;
            })
                .filter(version => semver.valid(version))
                .sort((v1, v2) => semver.rcompare(v1, v2));
            if (!versions.length) {
                logger.warn([
                    'Cannot get template versions, May be caused by the following reasons:',
                    `1. repository is not a mili template(${this.url})`,
                    '2. template have not a valid tag to mark the version(e.g. v1.0.0)',
                    `3. cannot get versions by command: \`git ls-remote --tags ${this.url}}\``,
                ].join('\n'));
            }
            this.versions = versions;
            return versions;
        });
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, version, storage } = this;
            if (!version || version === 'default') {
                if (!version)
                    logger.warn('Version is unset, use the default branch files of git repository');
                yield Effect.fs.remove(storage);
                yield git().clone(url, storage);
                return;
            }
            const repositoryExisted = yield Effect.fs.pathExists(storage);
            if (!repositoryExisted) {
                logger.info(`clone template from ${url}...`);
                yield git().clone(url, storage, ['--branch', `v${version}`, '--single-branch']);
                logger.info(`template version: ${version}`);
            }
            else {
                logger.info('use the cache of template');
            }
        });
    }
    existed() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield git().listRemote([]);
                return Boolean(result && result.length);
            }
            catch (e) {
                return false;
            }
        });
    }
}

class LocalRepository extends Repository {
    constructor(str) {
        super();
        this.absolute = false;
        this.type = 'local';
        this.name = basename(str);
        const path = str;
        const cwd = process.cwd();
        if (isAbsolute(path)) {
            this.absolute = true;
            this.path = path;
        }
        else {
            this.path = join(cwd, path);
        }
    }
    get record() {
        if (this.absolute)
            return this.path;
        /** the path saved in .milirc should be relative to the output folder, rather than process.cwd() */
        return projectPath => {
            const relativePath = relative(projectPath, this.path);
            if (isRelativePath(relativePath))
                return relativePath;
            else
                return `./${relativePath}`;
        };
    }
    get storage() {
        return join(TEMPLATE_STORAGE, encodeURIComponent(this.path), this.version || 'noversion');
    }
    getVersions() {
        return __awaiter(this, void 0, void 0, function* () {
            const { path } = this;
            if (this.versions)
                return this.versions;
            if (!(yield git(path).checkIsRepo()) || !(yield isRootDirOfRepo(path))) {
                this.versions = [];
                return this.versions;
            }
            const tags = yield git(path).tags();
            if (!tags.all.length) {
                logger.warn([
                    'Cannot get template versions, May be caused by the following reasons:',
                    `1. repository is not a mili template(${path})`,
                    '2. template have not a valid tag to mark the version(e.g. v1.0.0)',
                    `3. cannot get versions by command: \`git tags ${path}\``,
                ].join('\n'));
            }
            this.versions = tags.all
                .map(tag => semver.clean(tag) || '')
                .filter(tag => Boolean(tag))
                .reverse();
            return this.versions;
        });
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            const { path, version, storage } = this;
            yield Effect.fs.emptyDir(storage);
            logger.info(`copy template from ${path}`);
            yield Effect.fs.copy(path, storage);
            if (isRootDirOfRepo(storage) && version && version !== 'default') {
                yield git(storage).reset('hard');
                yield git(storage).checkout(`v${version}`);
                logger.info(`template version: ${version}`);
            }
            else if (version !== 'default') {
                logger.warn('Version is unset, use the default files');
            }
        });
    }
    existed() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield dirExist(this.path);
        });
    }
}

const genIndexFile = (name) => `
const { join } = require('path')
const config = require('${name}')
const path = join('./node_modules/${name}', config.path)

module.exports = { ...config, path }
`;
const exec = promisify(childProcess.exec);
class NpmRepository extends Repository {
    constructor(name) {
        super();
        this.type = 'npm';
        this.name = name;
        const matched = name.match(/@(.*)\//);
        if (matched)
            this.scope = matched[1];
        else
            this.scope = null;
    }
    get record() {
        return `npm:${this.name}`;
    }
    get storage() {
        return join(TEMPLATE_STORAGE, encodeURIComponent(this.name), this.version || 'noversion');
    }
    getVersions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.versions)
                return this.versions;
            const { stdout, stderr } = yield exec(`npm view ${this.name} versions  --json`);
            if (stderr)
                console.error(stderr);
            return JSON.parse(stdout).reverse();
        });
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, version, storage } = this;
            if (version === 'default' || !version)
                throw new Error('Please checkout version before install npm template');
            const repositoryExisted = yield Effect.fs.pathExists(storage);
            if (repositoryExisted) {
                logger.info('use the cache of template');
                return;
            }
            logger.info(`install ${name} template from npm...`);
            yield Effect.fs.emptyDir(storage);
            yield Effect.fs.writeJSON(join(storage, 'package.json'), {
                main: 'index.js',
                description: '',
                license: 'MIT',
            });
            yield Effect.fs.writeFile(join(storage, 'index.js'), genIndexFile(name));
            yield Effect.fs.writeFile(join(storage, '.npmrc'), 'package-lock=false');
            const command = `npm install ${name}@${version}`;
            yield exec(command, { cwd: storage });
        });
    }
    existed() {
        return __awaiter(this, void 0, void 0, function* () {
            const out = yield exec(`npm view ${this.name} --json`);
            return !out.stderr;
        });
    }
}

class Compiler {
    constructor(resource) {
        this.eventEmitter = new EventEmitter();
        this.resource = resource;
        this.template.hooks.map(hook => hook.appendTo(this.eventEmitter));
    }
    get template() {
        return this.resource.template;
    }
    get project() {
        return this.resource.project;
    }
    emit(name) {
        this.eventEmitter.emit(name);
    }
    prompt(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const { template, project } = this;
            let { questions } = template;
            const namesOfQuestions = questions.map(prop('name'));
            if (project.answers && !force) {
                const answers = project.answers;
                questions = questions.filter(question => !question.answered(answers));
            }
            if (!questions.length)
                return;
            logger.info('Please answer the questions of template.');
            let answers = yield Effect.prompter(questions);
            if (project.answers)
                answers = mergeDeepLeft(answers, project.answers);
            project.answers = pick(namesOfQuestions, answers);
        });
    }
    render(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prompt(options.ignoreAnswered);
            yield this.template.render(this.resource);
            yield this.generateMilirc();
            this.emit('rendered');
        });
    }
    check(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.template.check(this.resource, options);
        });
    }
    generateMilirc() {
        return __awaiter(this, void 0, void 0, function* () {
            const milirc = yaml.safeDump(this.resource.milirc, { skipInvalid: true });
            yield Effect.fs.writeFile(join(this.project.path, '.milirc.yml'), milirc, 'utf8');
        });
    }
}

const identity = (path) => __awaiter(undefined, void 0, void 0, function* () { return path; });
class Handler {
    constructor(genFile, genPath = identity) {
        this.genFile = genFile;
        this.genPath = genPath;
    }
    static compose(handlers) {
        const genFile = (file, config) => __awaiter(this, void 0, void 0, function* () {
            for (const handler of handlers) {
                yield handler.genFile(file, config);
            }
        });
        const genPath = (string, config) => __awaiter(this, void 0, void 0, function* () {
            let str = string;
            for (const handler of handlers) {
                str = yield handler.genPath(str, config);
            }
            return str;
        });
        return new Handler(genFile, genPath);
    }
    static find(name) {
        if (name in buildInHandlers)
            return buildInHandlers[name];
        return null;
    }
    static format(handler) {
        if (typeof handler === 'string') {
            const h = Handler.find(handler);
            if (h)
                return h;
            else
                throw new Error(`Cannot find ${handler} handler `);
        }
        else if (typeof handler === 'function') {
            const h = handler(buildInHandlers);
            if (h instanceof Handler)
                return h;
        }
        else if (typeof handler === 'object') {
            return new Handler(handler.genFile, handler.genPath);
        }
        throw new TypeError('Cannot format handler');
    }
}

const exec$1 = promisify(childProcess.exec);
class Hook {
    /*
     * constructor(eventName: string, listener: string)
     * constructor(eventName: string, listener: Listener)
     */
    constructor(eventName, listener) {
        this.eventName = eventName;
        if (typeof listener === 'string') {
            this.listener = () => __awaiter(this, void 0, void 0, function* () {
                logger.info(`run ${eventName} hook...`);
                try {
                    const { stdout, stderr } = yield exec$1(listener);
                    process.stdout.write(stdout);
                    process.stderr.write(stderr);
                }
                catch (error) {
                    logger.error('hook exec error', error);
                }
            });
        }
        else if (typeof listener === 'function') {
            this.listener = (...arg) => __awaiter(this, void 0, void 0, function* () {
                logger.info(`run ${eventName} hook...`);
                yield listener(...arg);
            });
        }
        else {
            throw new Error('Hook should be a string or function');
        }
    }
    appendTo(eventEmitter) {
        eventEmitter.addListener(this.eventName, this.listener);
    }
}

var $id = "template.json";
var properties = {
	path: {
		type: "string",
		"default": "./"
	},
	engines: {
		type: "string"
	},
	rules: {
		type: "array",
		items: {
			$ref: "rule.json"
		},
		"default": [
		]
	},
	hooks: {
		type: "object",
		propertyNames: {
			"enum": [
				"initialized",
				"updated",
				"upgraded",
				"checked",
				"rendered"
			]
		},
		patternProperties: {
			".*": {
				oneOf: [
					{
						type: "string"
					},
					{
						"instanceof": "Function"
					}
				]
			}
		}
	},
	questions: {
		type: "array",
		items: {
			$ref: "question.json"
		}
	}
};
var Template = {
	$id: $id,
	properties: properties
};

var $id$1 = "rule.json";
var properties$1 = {
	path: {
		type: "string"
	},
	encoding: {
		oneOf: [
			{
				type: "string",
				"enum": [
					"utf8",
					"binary"
				]
			},
			{
				type: "object",
				propertyNames: {
					"enum": [
						"utf8",
						"binary"
					]
				},
				patternProperties: {
					".*": {
						type: "string"
					}
				}
			}
		]
	},
	upgrade: {
		type: "string",
		"enum": [
			"cover",
			"keep",
			"exist",
			"merge"
		],
		"default": "cover"
	},
	glob: {
		type: "boolean",
		"default": true
	},
	handler: {
		$ref: "handler.json"
	},
	handlers: {
		type: "array",
		items: {
			$ref: "handler.json"
		}
	}
};
var required = [
	"path"
];
var Rule = {
	$id: $id$1,
	properties: properties$1,
	required: required
};

var $id$2 = "handler.json";
var anyOf = [
	{
		type: "string"
	},
	{
		"instanceof": "Function"
	},
	{
		type: "object",
		properties: {
			genFile: {
				"instanceof": "Function"
			},
			genPath: {
				"instanceof": "Function"
			}
		}
	}
];
var Handler$1 = {
	$id: $id$2,
	anyOf: anyOf
};

var $id$3 = "question.json";
var properties$2 = {
	type: {
		type: "string",
		"enum": [
			"input",
			"list",
			"checkbox",
			"confirm",
			"number",
			"rawlist",
			"expand",
			"password",
			"editor"
		]
	},
	name: {
		type: "string"
	}
};
var required$1 = [
	"name"
];
var Question = {
	$id: $id$3,
	properties: properties$2,
	required: required$1
};

var $id$4 = "milirc.json";
var properties$3 = {
	mili: {
		type: "object",
		properties: {
			version: {
				type: "string",
				nullable: true
			}
		},
		"default": {
			version: ""
		}
	},
	template: {
		type: "object",
		properties: {
			repository: {
				type: "string"
			},
			version: {
				type: "string",
				nullable: true,
				"default": ""
			}
		},
		required: [
			"repository"
		]
	},
	answers: {
		type: "object",
		nullable: true
	}
};
var required$2 = [
	"mili",
	"template"
];
var Milirc = {
	$id: $id$4,
	properties: properties$3,
	required: required$2
};

const TemplateSchema = Template;
const RuleSchema = Rule;
const HandlerSchema = Handler$1;
const QuestionSchema = Question;
const MilircSchema = Milirc;

const ajv = new Ajv({ useDefaults: true, nullable: true });
const validate = ajv.compile(MilircSchema);
const explorer = cosmiconfig('mili');
var loadMilirc = (cwd) => __awaiter(undefined, void 0, void 0, function* () {
    const filepath = join(cwd, '.milirc.yml');
    if (!(yield Effect.fs.pathExists(filepath)))
        return null;
    /**
     * NOTE: don't change the object that return by cosmiconfig.
     *       It was cache by cosmiconfig
     */
    const result = yield explorer.load(filepath);
    if (!result || !result.config)
        return null;
    const config = clone(result.config);
    if (!config)
        throw new Error('Cannot load .milirc.yml');
    /* Should before validate. mili@1 config won't pass validator */
    if (config.mili && semver.lt(config.mili.version, '2.0.0'))
        throw new Error('Never support auto upgrade from mili@1');
    const valid = validate(config);
    if (!valid)
        throw new Error(ajv.errorsText(validate.errors, { dataVar: 'milirc' }));
    const milirc = config;
    /** The relative template path saved in .milirc is relative to the dir of .milirc */
    if (isRelativePath(config.template.repository)) {
        config.template.repository = relativePath(process.cwd(), join(cwd, config.template.repository));
    }
    return milirc;
});

var loadNpmConfig = (path) => __awaiter(undefined, void 0, void 0, function* () {
    const packageJsonPath = join(path, 'package.json');
    const exist = yield Effect.fs.pathExists(packageJsonPath);
    if (!exist)
        throw new MissingFileError(path);
    try {
        const config = yield Effect.fs.readJSON(packageJsonPath);
        if (typeof config.repository === 'string') {
            if (validateGitRepoUrl(config.repository)) {
                config.repository = { type: 'git', url: config.repository };
            }
            else {
                config.repository = { url: config.repository };
            }
        }
        if (typeof config.repository === 'object') {
            if (config.repository.type === 'git' && config.repository.url) {
                const url = config.repository.url.replace(/^git\+/, '');
                config.repository = { type: 'git', url };
            }
            else {
                config.repository = { url: config.repository.url };
            }
        }
        else {
            config.repository = undefined;
        }
        if (typeof config.main !== 'string')
            config.main = undefined;
        return config;
    }
    catch (e) {
        throw new Error([
            `Cannot load package.json from ${path}.`,
            'Maybe syntax error in package.json',
        ].join('\n'));
    }
});

class Project {
    constructor(path, name = '', repository, answers) {
        this.path = path;
        this.name = name;
        this.repository = repository;
        this.answers = answers;
    }
    getTemplateRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            const milirc = yield loadMilirc(this.path);
            if (!milirc)
                throw new Error('Cannot load milirc');
            if (!hasPath(['template', 'repository'], milirc)) {
                throw new Error('Cannot find repository config in .milirc');
            }
            const version = milirc.template.version;
            const repoStr = milirc.template.repository;
            const repo = yield Repository.format(repoStr);
            if (version)
                yield repo.checkout(version);
            return repo;
        });
    }
    static load(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const milirc = yield loadMilirc(path);
            let repo;
            let answers;
            if (yield isRootDirOfRepo(path)) {
                const remotes = yield git(path).getRemotes(true);
                if (remotes && remotes.length)
                    repo = new GitRepository(remotes[0].refs.push);
            }
            if (milirc && milirc.answers)
                answers = milirc.answers;
            try {
                const npmConfig = yield loadNpmConfig(path);
                if (npmConfig.repository && npmConfig.repository.type === 'git') {
                    repo = new GitRepository(npmConfig.repository.url);
                }
                return new Project(path, npmConfig.name, repo, answers);
            }
            catch (error) {
                if (error instanceof MissingFileError) {
                    return new Project(path, basename(path), repo, answers);
                }
                else {
                    throw error;
                }
            }
        });
    }
}

class Question$1 {
    constructor(options) {
        this.type = 'input';
        this.name = '';
        this.message = '';
        this.choices = [];
        this.validate = T;
        this.filter = identity$1;
        this.transformer = identity$1;
        this.when = T;
        this.pageSize = 0;
        this.prefix = '';
        this.suffix = '';
        if (options.type)
            this.type = options.type;
        if (options.name)
            this.name = options.name;
        else
            throw new TypeError('name should not be empty');
        if (options.message)
            this.message = options.message;
        if (options.default)
            this.default = options.default;
        if (options.choices)
            this.choices = options.choices;
        if (options.validate)
            this.validate = options.validate;
        if (options.filter)
            this.filter = options.filter;
        if (options.transformer)
            this.transformer = options.transformer;
        if (options.when)
            this.when = options.when;
        if (options.pageSize)
            this.pageSize = options.pageSize;
        if (options.prefix)
            this.prefix = options.prefix;
        if (options.suffix)
            this.suffix = options.suffix;
    }
    includesByChoices(value, answers) {
        let choices = this.choices;
        if (typeof choices === 'function')
            choices = choices(answers);
        return choices
            .filter(choice => typeof choice !== 'object' || !choice.disabled)
            .some(choice => {
            if (typeof choice === 'object')
                return choice.value === value;
            return choice === value;
        });
    }
    answered(answers) {
        const { name, type } = this;
        if (!Object.keys(answers).includes(name))
            return false;
        const answer = answers[name];
        if (type === 'input' || type === 'password')
            return typeof answer === 'string';
        if (type === 'number')
            return typeof answer === 'number';
        if (type === 'confirm')
            return typeof answer === 'boolean';
        if (type === 'list' || type === 'rawlist' || type === 'expand')
            return this.includesByChoices(answer, answers);
        if (type === 'checkbox' && Array.isArray(answer))
            return answer.every(value => this.includesByChoices(value, answers));
        return false;
    }
}

var version = "3.2.0";

class Resource {
    constructor(operation, project, template) {
        this.mili = { version };
        if (!template.engines) {
            logger.warn('The template.engines is not set, you need to check the mili version manually.');
        }
        else if (!semver.satisfies(this.mili.version, template.engines)) {
            throw new Error([
                `The mili version template need is ${template.engines}`,
                `But mili version used is ${this.mili.version}`,
            ].join('\n'));
        }
        this.operation = operation;
        this.project = project;
        this.template = template;
    }
    get answers() {
        return this.project.answers;
    }
    get milirc() {
        const { mili, project, template, answers } = this;
        let { record } = template.repository;
        if (typeof record === 'function')
            record = record(project.path);
        return {
            mili,
            template: {
                repository: record,
                version: template.repository.version,
            },
            answers,
        };
    }
    compile() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Compiler(this);
        });
    }
}

const ajv$1 = new Ajv({ useDefaults: true });
const validate$1 = ajv$1
    .addSchema([HandlerSchema])
    .compile(RuleSchema);
class Rule$1 {
    constructor(path, upgrade = UpgradeType.Cover, glob = true, inferEncoding = inferFileEncoding, handler) {
        this.path = path;
        this.inferEncoding = inferEncoding;
        this.upgrade = upgrade;
        this.glob = glob;
        this.handler = handler;
    }
    static format(obj) {
        const valid = validate$1(obj);
        if (!valid) {
            throw new TypeError([
                'Incorrect rules field configuration for template configuration',
                ajv$1.errorsText(validate$1.errors, { dataVar: 'rule' }),
            ].join('\n'));
        }
        if (!isAbsolute(obj.path))
            throw new TypeError(`The path of rule should be absolute path. But get ${obj.path}`);
        const path = obj.path;
        const upgrade = obj.upgrade;
        const glob = obj.glob;
        let inferEncoding = inferFileEncoding;
        if ('encoding' in obj) {
            if (typeof obj.encoding === 'object') {
                inferEncoding = inferEncodingByMapping(obj.encoding);
            }
            else if (Object.values(Encoding).includes(obj.encoding)) {
                inferEncoding = inferEncodingImmobile(obj.encoding);
            }
        }
        let handler;
        if (obj.handlers) {
            const handlers = obj.handlers.map(Handler.format);
            handler = Handler.compose(handlers);
        }
        else if (obj.handler) {
            handler = Handler.format(obj.handler);
        }
        return new Rule$1(path, upgrade, glob, inferEncoding, handler);
    }
    match(path) {
        if (this.glob)
            return glob.isMatch(path, this.path);
        return this.path === path;
    }
    static merge(parent, child) {
        const path = child.path;
        const upgrade = child.upgrade;
        const glob = child.glob;
        const handlers = [];
        let handler;
        if (parent.handler)
            handlers.push(parent.handler);
        if (child.handler)
            handlers.push(child.handler);
        if (handlers.length)
            handler = Handler.compose(handlers);
        const inferEncoding = child.inferEncoding || parent.inferEncoding;
        return new Rule$1(path, upgrade, glob, inferEncoding, handler);
    }
    createFile(path) {
        const paths = path.split('/')
            .map((pair, i, arr) => arr.slice(0, arr.length - i).join('/'))
            .filter(item => Boolean(item));
        if (!paths.some(item => this.match(item))) {
            throw new Error([
                'Cannot create file from rule',
                'Because the file path is not match rule',
            ].join('\n'));
        }
        const { inferEncoding, upgrade } = this;
        let handler = this.handler;
        let upgradeHandler;
        if (upgrade === 'merge')
            upgradeHandler = buildInHandlers.merge;
        if (upgrade === 'exist')
            upgradeHandler = buildInHandlers.exist;
        if (upgrade === 'keep')
            upgradeHandler = buildInHandlers.ignoreWhen(({ operation }) => operation !== 'init');
        if (handler && upgradeHandler)
            handler = Handler.compose([handler, upgradeHandler]);
        else if (!handler && upgradeHandler)
            handler = upgradeHandler;
        return new File(path, inferEncoding, handler);
    }
}

const ajv$2 = new Ajv({ useDefaults: true, $data: true });
ajvKeywords(ajv$2);
const validateTemplateConfig = ajv$2
    .addSchema([HandlerSchema])
    .addSchema([RuleSchema, QuestionSchema])
    .compile(TemplateSchema);
class Template$1 {
    constructor(repo, path, engines, files, questions = [], hooks = []) {
        this.path = path;
        this.repository = repo;
        this.engines = engines;
        this.files = files;
        this.questions = questions;
        this.hooks = hooks;
    }
    compile(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('compile template');
            const promises = this.files.map(file => file.compile(resource));
            return yield Promise.all(promises);
        });
    }
    ensureFolder(folders, prefix = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = Object.entries(folders)
                .map(([name, child]) => __awaiter(this, void 0, void 0, function* () {
                const dir = join(prefix, name);
                yield Effect.fs.ensureDir(dir);
                yield this.ensureFolder(child, dir);
            }));
            yield Promise.all(promises);
        });
    }
    ensureDir(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = {};
            files.forEach(file => {
                const dir = dirname(file.projectPath);
                let parent = folders;
                dir.split('/').forEach(name => {
                    const pair = name || '/';
                    let next = parent[pair];
                    if (!next)
                        next = {};
                    parent[pair] = next;
                    parent = next;
                });
            });
            yield this.ensureFolder(folders);
        });
    }
    render(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.compile(resource);
            logger.info('rendering');
            yield this.ensureDir(files);
            const promises = files.map(file => file.render());
            yield Promise.all(promises);
        });
    }
    check(resource, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.compile(resource);
            const errors = [];
            const promises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield file.check(options);
                }
                catch (e) {
                    errors.push(e.message);
                }
            }));
            yield Promise.all(promises);
            if (errors.length) {
                errors.forEach(message => logger.error(message));
                throw new Error('Check failed');
            }
        });
    }
    static load(repo) {
        return __awaiter(this, void 0, void 0, function* () {
            const cwd = repo.storage;
            let entry = join(cwd, 'index.js');
            try {
                const npmConfig = yield loadNpmConfig(cwd);
                if (npmConfig.main)
                    entry = join(cwd, npmConfig.main);
            }
            catch (e) {
            }
            /**
             * NOTE: don't change the object that return by cosmiconfig.
             *       It was cache by cosmiconfig
             */
            const result = yield cosmiconfig('template').load(entry);
            if (!result) {
                throw new Error([
                    'Cannot load template config',
                    `Maybe syntax error in ${entry}`,
                ].join('\n'));
            }
            const config = clone(result.config);
            const valid = validateTemplateConfig(config);
            if (!valid) {
                throw new Error([
                    'There is some error in template config: ',
                    ajv$2.errorsText(validateTemplateConfig.errors, { dataVar: 'template' }),
                ].join('\n'));
            }
            /** absoult template path */
            const path = join(cwd, config.path);
            /** generate files */
            const rules = config.rules
                .map(item => (Object.assign({}, item, { path: join(path, item.path) })))
                .map(item => Rule$1.format(item));
            const rootRule = new Rule$1(path, UpgradeType.Cover, true);
            const files = yield this.searchDirFile(path, rootRule, rules);
            /** generate questions */
            let questions = [];
            if (config.questions)
                questions = config.questions.map(question => new Question$1(question));
            /** generate hooks */
            let hooks = [];
            if (config.hooks) {
                hooks = Object.entries(config.hooks)
                    .map(([name, listener]) => new Hook(name, listener));
            }
            return new Template$1(repo, path, config.engines, files, questions, hooks);
        });
    }
    static searchDirFile(path, rule, rules) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield Effect.fs.readdir(path);
            const promises = files.map((filename) => __awaiter(this, void 0, void 0, function* () {
                const subPath = join(path, filename);
                let subRule = rules.find(rule => rule.match(subPath));
                if (!subRule)
                    subRule = rule;
                else
                    subRule = Rule$1.merge(rule, subRule);
                if (yield isDirectory(subPath)) {
                    return yield this.searchDirFile(subPath, subRule, rules);
                }
                return subRule.createFile(subPath);
            }));
            const subFiles = yield Promise.all(promises);
            return unnest(subFiles);
        });
    }
}

function ejs (options) {
    const genFile = (file, resource) => __awaiter(this, void 0, void 0, function* () {
        const view = {
            mili: resource.mili,
            project: resource.project,
            template: resource.template,
            answers: resource.answers,
            addition: file.addition,
        };
        file.content = ejs$1.render(file.content, view, options);
    });
    const genPath = (path) => __awaiter(this, void 0, void 0, function* () { return path.replace(/.ejs$/, ''); });
    return new Handler(genFile, genPath);
}

const mergeJson = (file) => __awaiter(undefined, void 0, void 0, function* () {
    let { content } = file;
    const beginMatched = content.match(/^\s*/g);
    const beginBlank = beginMatched ? beginMatched[0] : '';
    const endMatched = content.match(/\s*$/g);
    const endBlank = endMatched ? endMatched[0] : '';
    let result = content;
    if (!file.projectFileExisted) {
        try {
            content = JSON.parse(file.content);
            result = JSON.stringify(content, null, '  ');
        }
        catch (e) {
            throw new Error([
                'The template file and the current file failed to merge due to a json syntax error in the template file.',
                'The current file will be overwritten directly by the template file.',
                `path: ${file.templatePath}`,
            ].join('\n'));
        }
    }
    else {
        let projectContent = yield file.getProjectContent();
        try {
            content = JSON.parse(file.content);
        }
        catch (e) {
            throw new Error([
                'The template file and the current file failed to merge due to a json syntax error in the template file.',
                'The current file will be overwritten directly by the template file.',
                `path: ${file.templatePath}`,
            ].join('\n'));
        }
        try {
            projectContent = JSON.parse(projectContent);
        }
        catch (e) {
            throw new Error([
                'The template file and the current file failed to merge due to a json syntax error in the current file.',
                'The current file will be overwritten directly by the template file.',
                `path: ${file.projectPath}`,
            ].join('\n'));
        }
        result = JSON.stringify(merge(projectContent, content), null, '  ');
    }
    file.content = `${beginBlank}${result}${endBlank}`;
});

const defaultBucketName = Symbol();
const classifyIgnore = (list) => {
    let last = { name: defaultBucketName, values: [] };
    const bucket = [last];
    list.forEach(item => {
        if (/^#/.test(item)) {
            const name = item.substring(1);
            /** comment adjacent comments */
            if (!last.values.length && typeof last.name !== 'symbol') {
                last.name = `${last.name}\n${name}`;
                return;
            }
            const pair = bucket.find(item => item.name === name);
            if (pair) {
                last = pair;
            }
            else {
                last = { name, values: [] };
                bucket.push(last);
            }
        }
        else if (item) {
            if (!last.values.includes(item))
                last.values.push(item);
        }
    });
    return bucket;
};
const mergeBucket = (b1, b2) => {
    const bucket = b1.map(item => (Object.assign({}, item)));
    b2.forEach(pair => {
        const sameOne = bucket.find(item => item.name === pair.name);
        if (!sameOne) {
            bucket.push(pair);
        }
        else {
            pair.values.forEach(value => {
                if (!(sameOne.values.includes(value)))
                    sameOne.values = sameOne.values.concat(value);
            });
        }
    });
    return bucket;
};
const uniqBucket = (b1, b2) => {
    const allValues = unnest(b2.map(item => item.values));
    return b1.map(pair => {
        const values = pair.values.filter(item => !allValues.includes(item));
        return { name: pair.name, values };
    });
};
const renderBucket = (bucket) => bucket
    .filter(pair => (pair.name !== defaultBucketName || pair.values.length))
    .map(({ name, values }) => {
    let str = '';
    if (typeof name === 'string')
        str += name.replace(/^(.*)(\n|$)/mg, '#$1\n');
    str += values.join('\n');
    return str;
})
    .join('\n\n');
const mergeIgnore = (file) => __awaiter(undefined, void 0, void 0, function* () {
    const templateIgnoreList = file.content.split('\n');
    let projectContent = '';
    if (file.projectFileExisted)
        projectContent = yield file.getProjectContent();
    const projectIgnoreList = projectContent.split('\n');
    const templateIgnoreBucket = classifyIgnore(templateIgnoreList);
    const projectIgnoreBucket = classifyIgnore(projectIgnoreList);
    const uniquedBucket = uniqBucket(projectIgnoreBucket, templateIgnoreBucket);
    const bucket = mergeBucket(templateIgnoreBucket, uniquedBucket);
    const result = renderBucket(bucket);
    const beginMatched = file.content.match(/^\s*/g);
    const beginBlank = beginMatched ? beginMatched[0] : '';
    const endMatched = file.content.match(/\s*$/g);
    const endBlank = endMatched ? endMatched[0] : '';
    file.content = `${beginBlank}${result}${endBlank}`;
});

const mergeYaml = (file) => __awaiter(undefined, void 0, void 0, function* () {
    let content = file.content;
    const beginMatched = content.match(/^\s*/g);
    const beginBlank = beginMatched ? beginMatched[0] : '';
    const endMatched = content.match(/\s*$/g);
    const endBlank = endMatched ? endMatched[0] : '';
    let result = content;
    if (!file.projectFileExisted) {
        try {
            content = yaml.load(file.content);
            result = yaml.dump(content).replace(/\s*$/, '');
        }
        catch (e) {
            throw new Error([
                'The template file and the project file failed to merge due to a json syntax error in the template file.',
                'The project file will be overwritten directly by the template file.',
                `path: ${file.templatePath}`,
            ].join('\n'));
        }
    }
    else {
        let projectContent = yield file.getProjectContent();
        try {
            content = yaml.load(file.content);
        }
        catch (e) {
            throw new Error([
                'The template file and the project file failed to merge due to a json syntax error in the template file.',
                'The project file will be overwritten directly by the template file.',
                `path: ${file.templatePath}`,
            ].join('\n'));
        }
        try {
            projectContent = yaml.load(projectContent);
        }
        catch (e) {
            throw new Error([
                'The template file and the project file failed to merge due to a yaml syntax error in the project file.',
                'The project file will be overwritten directly by the template file.',
                `path: ${file.projectPath}`,
            ].join('\n'));
        }
        result = yaml.dump(merge(projectContent, content))
            .replace(/\s*$/, '');
    }
    file.content = `${beginBlank}${result}${endBlank}`;
});

const jsonFileExts = ['.json'];
const yamlFileExts = ['.yaml', '.yml'];
const ignoreFilenames = ['.gitignore', '.npmignore', '.npmrc'];
const notSupportErrorMessage = (filename, projectPath) => [
    `Merge files of this type(${filename}) are not supported by merge handler.`,
    'Please change the handler and feedback this question to the developer.',
    `Path: ${projectPath}`,
].join('\n');
const genFile = (file, resource) => __awaiter(undefined, void 0, void 0, function* () {
    const { projectPath } = file;
    const ext = extname(projectPath);
    const filename = basename(projectPath);
    if (jsonFileExts.includes(ext))
        yield mergeJson(file);
    else if (yamlFileExts.includes(ext))
        yield mergeYaml(file);
    else if (ignoreFilenames.includes(filename))
        yield mergeIgnore(file);
    else
        throw new Error(notSupportErrorMessage(filename, projectPath));
});
var index = new Handler(genFile);

const genFile$1 = (file) => __awaiter(undefined, void 0, void 0, function* () {
    file.renderable = !file.projectFileExisted;
});
var exist = new Handler(genFile$1);

function extractArea (name, begin, end = begin) {
    const genFile = (file) => __awaiter(this, void 0, void 0, function* () {
        if (!file.projectFileExisted)
            return;
        const projectContent = yield file.getProjectContent();
        let beginIndex = projectContent.indexOf(begin);
        if (beginIndex === -1)
            return;
        beginIndex += begin.length;
        const endIndex = projectContent.indexOf(end, beginIndex);
        if (endIndex === -1)
            return;
        file.addition[name] = projectContent.substring(beginIndex, endIndex);
    });
    return new Handler(genFile);
}

const genFile$2 = (file, resource) => __awaiter(undefined, void 0, void 0, function* () {
    const view = {
        mili: resource.mili,
        project: resource.project,
        template: resource.template,
        answers: resource.answers,
        addition: file.addition,
    };
    file.content = mustache$1.render(file.content, view);
});
const genPath = (path) => __awaiter(undefined, void 0, void 0, function* () { return path.replace(/.mustache$/, ''); });
var mustache = new Handler(genFile$2, genPath);

var ignoreWhen = (func) => {
    const genFile = (file, resource) => __awaiter(undefined, void 0, void 0, function* () {
        file.renderable = !(yield func(resource));
    });
    return new Handler(genFile);
};

var deleteWhen = (func) => {
    const genFile = (file, resource) => __awaiter(undefined, void 0, void 0, function* () {
        file.deleted = Boolean(yield func(resource));
    });
    return new Handler(genFile);
};

const genFile$3 = () => __awaiter(undefined, void 0, void 0, function* () { });
var rename = newName => {
    const genPath = (path) => __awaiter(undefined, void 0, void 0, function* () {
        const p = parse(path);
        p.base = newName;
        return format(p);
    });
    return new Handler(genFile$3, genPath);
};



var handlers = /*#__PURE__*/Object.freeze({
    ejs: ejs,
    merge: index,
    exist: exist,
    extractArea: extractArea,
    mustache: mustache,
    ignoreWhen: ignoreWhen,
    deleteWhen: deleteWhen,
    rename: rename
});

/* Fix nasty circular dependency issues */
const buildInHandlers = handlers;

var init = (options) => __awaiter(undefined, void 0, void 0, function* () {
    const cwd = options.cwd || process.cwd();
    const name = options.name;
    const noDeps = options.noDeps || false;
    const version = options.version || 'latest';
    const force = options.force || false;
    if (!options.repository)
        throw new TypeError('options.repository is required for `mili.init(options)`');
    Effect.replace(options.effect);
    if (force)
        yield checkWorkDir(cwd);
    const repo = yield Repository.format(options.repository);
    if (version)
        yield repo.checkout(version);
    const template = yield repo.install({ noDeps });
    const project = yield Project.load(cwd);
    if (options.name)
        project.name = name;
    const resource = new Resource('init', project, template);
    const compiler = yield resource.compile();
    yield compiler.render({ ignoreAnswered: true });
    yield compiler.emit('initialized');
});

var upgrade = recursiveExecte((options) => __awaiter(undefined, void 0, void 0, function* () {
    const cwd = options.cwd || process.cwd();
    const noDeps = options.noDeps || false;
    const force = options.force || false;
    Effect.replace(options.effect);
    if (!force)
        yield checkWorkDir(cwd);
    const project = yield Project.load(cwd);
    const repo = yield project.getTemplateRepo();
    if (yield repo.isLatest()) {
        const message = 'The template is already the latest version';
        if (!force) {
            logger.info(message);
            return;
        }
        logger.warn(message);
    }
    yield repo.checkout('latest');
    const template = yield repo.install({ noDeps });
    const resource = new Resource('upgrade', project, template);
    const compiler = yield resource.compile();
    yield compiler.render();
    yield compiler.emit('upgraded');
}));

var update = recursiveExecte((options) => __awaiter(undefined, void 0, void 0, function* () {
    const cwd = options.cwd || process.cwd();
    const noDeps = options.noDeps || false;
    const version = options.version;
    const force = options.force || false;
    Effect.replace(options.effect);
    if (!force)
        yield checkWorkDir(cwd);
    const project = yield Project.load(cwd);
    const repo = yield project.getTemplateRepo();
    if (version && repo.version && semver.lt(version, repo.version)) {
        const message = [
            'The version number setted is lower than the current template version.',
            "If you're sure you want to run this command, rerun it with --force.",
        ].join('\n');
        if (force)
            logger.warn(message);
        else
            throw new Error(message);
    }
    if (version)
        yield repo.checkout(version);
    const template = yield repo.install({ noDeps });
    const resource = new Resource('update', project, template);
    const compiler = yield resource.compile();
    yield compiler.render();
    yield compiler.emit('updated');
}));

var clean = (options = {}) => __awaiter(undefined, void 0, void 0, function* () {
    Effect.replace(options.effect);
    yield Effect.fs.remove(TEMPLATE_STORAGE);
});

var outdated = (options = {}) => __awaiter(undefined, void 0, void 0, function* () {
    const cwd = options.cwd || process.cwd();
    Effect.replace(options.effect);
    const project = yield Project.load(cwd);
    const repo = yield project.getTemplateRepo();
    if (!(yield repo.isVerioning())) {
        throw new Error('`mili outdated` cannot check the template without version control');
    }
    else if (yield repo.isLatest()) {
        logger.info('Congratulations, the current template is the latest version.');
    }
    else {
        logger.warn([
            '',
            '',
            'Project Mili Template Is Outdated',
            'run `npx mili upgrade` to upgrade template',
            '',
            '',
        ].join('\n'));
    }
});

var check = recursiveExecte((options = {}) => __awaiter(undefined, void 0, void 0, function* () {
    const { showDiff = false, fold = false, cwd = process.cwd(), noDeps = false, } = options;
    Effect.replace(options.effect);
    const project = yield Project.load(cwd);
    const repo = yield project.getTemplateRepo();
    const template = yield repo.install({ noDeps });
    const resource = new Resource('check', project, template);
    const compiler = yield resource.compile();
    yield compiler.check({ showDiff, fold });
    yield compiler.emit('checked');
}));

export { check, clean, init, outdated, update, upgrade };
