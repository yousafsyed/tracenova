import "reflect-metadata";
import {Span, SpanStatusCode} from "@opentelemetry/api";
import tracer from "./Tracer";

const INSTRUMENT_METHOD = Symbol('instrument');


function instrument(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {

            const spanName = `${target.constructor.name}.${propertyKey}`;
            return tracer.startActiveSpan(spanName, (span: Span) => {
                try {
                    const result = originalMethod.apply(this, args);
                    if (result instanceof Promise) {
                        return result
                            .then((res) => {
                                return res;
                            }).catch((err) => {
                                span.recordException(err);
                                span.setStatus({code: SpanStatusCode.ERROR, message: String(err.message)});
                                throw err;
                            }).finally(()=>{
                                span.end();
                            });
                    } else {
                        span.end();
                        return result;
                    }
                } catch (err) {
                    span.recordException(err);
                    span.setStatus({code: SpanStatusCode.ERROR, message: String(err.message)});
                    span.end();
                    throw err;
                }
            });

        };
        Reflect.defineMetadata(INSTRUMENT_METHOD, true, target, propertyKey);
        return descriptor;

}


export {
    instrument,
}

export default instrument;