import path from "path";
import * as fs from 'fs'
import {createRequire} from 'node:module';
import {InstrumentationOption} from "@opentelemetry/instrumentation";
import openTelemetryInstrumentationHttp from "@opentelemetry/instrumentation-http";


const require = createRequire(import.meta.url);

const {HttpInstrumentation} = openTelemetryInstrumentationHttp;
const exists = fs.existsSync


interface IConfig {
    enabled: string,
    enableConsoleTracing: string,
    otelURL: string,
    appName: string
    instrumentations: InstrumentationOption[]
}

const config: IConfig = {
    enabled: process.env.MONITORING_ENABLED || 'yes',
    enableConsoleTracing: process.env.ENABLE_CONSOLE_TRACING || 'no',
    otelURL: process.env.OTEL_EXPORTER_URL || 'http://collector:4318/v1/traces',
    appName: process.env.APP_NAME || 'My App',
    instrumentations: [
        new HttpInstrumentation(),
    ]
};


const getConfigFileNames = () =>
    [process.env.OTEL_CONFIG_FILENAME, 'tracenova.js', 'tracenova.cjs'].filter(Boolean)

const getConfigFileLocations = () =>
    [
        process.env.OTEL_HOME,
        process.cwd(),
        process.env.HOME,
        path.join(process.cwd(), '../../../..'),
        require.main && require.main.filename
            ? path.dirname(require.main.filename)
            : undefined
    ].filter(Boolean)

function _findConfigFile() {
    const configFileCandidates = getConfigFileLocations().reduce((files, configPath) => {
        const configFiles = getConfigFileNames().map((filename) =>
            path.join(path.resolve(configPath), filename)
        )
        return files.concat(configFiles)
    }, [])

    return configFileCandidates.find(exists)
}

function resolveConfig(): Config {
    const filepath = _findConfigFile()
    if (!filepath) {
        console.log(
            [
                'Unable to find configuration file.',
                'If a configuration file is desired (common for non-containerized environments),',
                `a base configuration file can be copied from the root`,
                'and renamed to "tracenova.cjs" in the directory from which you will start',
                'your application.',
                'Attempting to start agent using environment variables.'
            ].join(' ')
        )
        return new Config(config)
    }

    try {
        const {config} = require(filepath);
        return new Config(config);
    } catch (error) {
        console.log(error)
        console.log(
            [
                `Unable to read existing configuration file "${filepath}".`,
                'To allow reading of the file (if desired),',
                'please ensure the application has read access and the file is exporting valid JSON.',
                'Attempting to start agent using environment variables.'
            ].join(' ')
        )
    }
}

enum ValidBoolStrings {
    yes = 'yes',
    no = 'no'
}


class Config {
    private readonly enabled: boolean
    private readonly enableConsoleTracing: boolean
    private readonly appName: string
    private readonly otelURL: string
    private readonly rawConfig: IConfig
    private readonly instrumentations: InstrumentationOption[]

    constructor(config: IConfig) {
        this.validateConfig(config);
        this.rawConfig = config;
        this.enabled = this.makeBoolValues('enabled')
        this.enableConsoleTracing = this.makeBoolValues('enableConsoleTracing')
        this.appName = config.appName;
        this.otelURL = config.otelURL
        this.instrumentations = config.instrumentations
    }

    isEnabled() {
        return this.enabled
    }

    isConsoleTracingEnabled() {
        return this.enableConsoleTracing
    }

    getAppName() {
        return this.appName
    }

    getOtelURL() {
        return this.otelURL
    }

    getInstrumentations(): InstrumentationOption[] {
        return this.instrumentations
    }


    private validateBoolValue(boolValue: ValidBoolStrings): void {
        const values = Object.values(ValidBoolStrings);
        if (!values.includes(boolValue)) {
            throw new Error(`Incorrect values for bool config, it can only take one of the following: ${values.join(', ')}`);
        }
    }

    makeBoolValues(boolKey: keyof IConfig): boolean {
        const boolToValidate = this.rawConfig[boolKey];
        const boolValue = boolToValidate as ValidBoolStrings;
        this.validateBoolValue(boolValue);
        return boolToValidate === ValidBoolStrings.yes;
    }

    private validateConfig(config: IConfig): void {
        const requiredKeys: (keyof IConfig)[] = ["enabled", "enableConsoleTracing", "appName", "otelURL", "instrumentations"];
        const missingKeys = requiredKeys.filter(key => !(key in config));

        if (missingKeys.length > 0) {
            throw new Error(`Required keys are missing in the config: ${missingKeys.join(', ')}`);
        }
    }
}

export {
    ValidBoolStrings,
    IConfig,
    Config,
    resolveConfig
}
export default resolveConfig();