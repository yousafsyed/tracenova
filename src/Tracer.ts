import {NodeTracerProvider} from "@opentelemetry/sdk-trace-node";
import {OTLPTraceExporter} from "@opentelemetry/exporter-trace-otlp-http";
import {registerInstrumentations} from "@opentelemetry/instrumentation";
import {SemanticResourceAttributes} from '@opentelemetry/semantic-conventions';
import {Resource} from '@opentelemetry/resources';
import {
    ConsoleSpanExporter,
    SimpleSpanProcessor
} from "@opentelemetry/sdk-trace-base";



const config = (await import("./Config")).default



function main() {
    const provider = makeProvider();
    if (config.isEnabled()) {
        registerInstrumentations({
            tracerProvider: provider,
            instrumentations: config.getInstrumentations()
        });

        provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter({
            url: config.getOtelURL(),
        })));

        if (config.isConsoleTracingEnabled()) {
            provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
        }

        provider.register({});
        startShutDownListener(provider);
    }
    return provider.getTracer("main");
}

// istanbul ignore next
function startShutDownListener(provider: NodeTracerProvider) {
    process.on('beforeExit', () => {
        provider.shutdown()
            .then(() => console.log('OpenTelemetry provider gracefully shutdown.'))
            .catch(err => console.error('Error shutting down OpenTelemetry provider:', err));
    });
}

function makeProvider(): NodeTracerProvider {
    return new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: config.getAppName(),
        }),
    });
}

const tracer = main;

export {
    tracer
}
export default main();