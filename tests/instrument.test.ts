import {jest, expect} from '@jest/globals'
import {Span} from "@opentelemetry/api";
import {tracer} from "../src/Tracer";
import {instrument} from "../src/instrument"


describe('instrument decorator', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.resetAllMocks();
    });
    it('should properly instrument a method', async () => {
        const mockStartActiveSpan = jest.fn((spanName: string, callback: (span: Span) => any) => {
            tracer().startActiveSpan(spanName, callback)
        });

        jest.unstable_mockModule('../src/Tracer', () => ({
            default: {
                startActiveSpan: mockStartActiveSpan,
            },
        }));

        const {instrument} = await import('../src/instrument');

        class TestClass {
            @instrument
            public testMethod() {
                return 'test result';
            }
        }

        class TestClass2 {
            @instrument
            method2() {
                throw new Error("Test")
            }
        }

        const instance = new TestClass();
        const instance2 = new TestClass2();
        instance.testMethod();
        expect(()=>{
            instance2.method2()
        }).toThrow()

        expect(mockStartActiveSpan).toHaveBeenCalledTimes(2);
    });


    it('should instrument methods with promise', async () => {

        class TestClass3 {

            @instrument
            async method3() {
                return "test"
            }

            @instrument
            async method4(){
                throw new Error("test")
            }
        }

        const instance3 = new TestClass3();

        await expect( instance3.method3()).resolves.toBe("test");
        await expect(instance3.method4()).rejects.toThrow()

    });


});