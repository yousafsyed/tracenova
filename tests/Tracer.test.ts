import {jest, expect} from '@jest/globals'
import {Tracer} from "@opentelemetry/sdk-trace-base";
import {Config} from "../src/Config";


jest.unstable_mockModule('../src/Config', () => ({
    default: new Config(
        {
            enabled: 'yes',
            enableConsoleTracing: 'yes',
            otelURL: 'http://collector:4318/v1/traces',
            appName: 'My App',
            instrumentations: []
        }
    ),
    // etc.
}));

const  {tracer} =  await import('../src/Tracer');

describe('Tracer.test.ts', function () {

    it('should run the tracer when monitoring is enabled in the config', () => {

        const tracerInstance = tracer();
        expect(tracerInstance).toBeInstanceOf(Tracer)

    });
});