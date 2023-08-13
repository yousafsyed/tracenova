import {jest, expect} from '@jest/globals'
import process from 'process';
import {resolveConfig, Config, IConfig} from '../src/Config';


describe('Config Module', () => {
    beforeEach(() => {

        jest.resetModules();
        jest.resetAllMocks();
    });

    it('should return a default config if config file not found', () => {

        const spy = jest.spyOn(process, 'cwd');
        spy.mockReturnValue('/wrong/path');

        const result = resolveConfig();

        expect(result.isEnabled()).toBe(true);
        expect(result.isConsoleTracingEnabled()).toBe(false);
        expect(result.getAppName()).toBe('My App');
        expect(result.getOtelURL()).toBe('http://collector:4318/v1/traces');
        expect(result.getInstrumentations()).toHaveLength(1);
    });

    it('should return configs from file', () => {

        const result = resolveConfig();


        expect(result.isEnabled()).toBe(true);
        expect(result.isConsoleTracingEnabled()).toBe(true);
        expect(result.getAppName()).toBe('My App');
        expect(result.getOtelURL()).toBe('http://collector:4318/v1/traces');
        expect(result.getInstrumentations()).toHaveLength(0);
    });


    it('should return undefined configs and log errors when the tracenova.cjs is missing required fields', () => {
        const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation((data) => {
            return data
        });
        const spy = jest.spyOn(process, 'cwd');
        spy.mockReturnValue(`${process.cwd()}/tests/_mocks/missing_fields`);


        const result = resolveConfig();


        expect(result).toBe(undefined);
        expect(mockConsoleLog).toBeCalledTimes(2)
    });

    it('should throw error when the config is missing required fields', () => {


        expect(() => {
            new Config({
                enabled: "yes"
            } as IConfig)
        }).toThrow(Error);


        expect(() => {
            new Config({
                enabled: 'string',
                enableConsoleTracing: 'string',
                otelURL: 'http://collector:4318/v1/traces',
                appName: 'My App',
                instrumentations: []
            } as IConfig)
        }).toThrow(Error);


    });


});