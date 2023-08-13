import {Span} from "@opentelemetry/api";

class MockSpan implements Span{


    setAttribute(key: string, value: any) {
        return this;
    }

    setAttributes(attributes: any) {
        return this;
    }

    addEvent(name: string, attributesOrStartTime?: any, startTime?: any) {
        return this;
    }

    setStatus(status: any) {
        return this;
    }

    updateName(name: string) {
        return this;
    }

    end(endTime?: any) {}

    isRecording() {
        return true;
    }

    recordException(exception: any, time?: any) {}

    spanContext(): any {
        return {}
    }
}


export default MockSpan;