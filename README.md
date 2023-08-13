# TraceNova

TraceNova is a Node.js package that simplifies setting up OpenTelemetry tracing and instrumentation. By importing "tracenova" at the beginning of your ES6 module-based project, it enables telemetry and tracing with minimal effort.

## Installation

You can install TraceNova using npm:

```bash
npm install tracenova
```

## Usage

Simply import "tracenova" as the first line of your ES6 module to enable telemetry and tracing:

```javascript
import 'tracenova';

// Your code here
```

TraceNova will automatically set up OpenTelemetry tracing and instrumentation based on sensible defaults. This basic setup allows you to start capturing traces without any additional configuration.

### Instrumenting Methods and Functions

You can use TraceNova's \`@instrument\` decorator to instrument both class methods and simple functions with tracing:

```javascript
import { instrument } from 'tracenova';

class ExampleClass {
    @instrument
    async method() {
        // Method logic
    }
}

const exampleInstance = new ExampleClass();
exampleInstance.method();

// Instrumenting a simple function
@instrument
function simpleFunction() {
    // Function logic
}

simpleFunction();
```

The `@instrument` decorator wraps the method or function with tracing logic, capturing performance data and exceptions.

### Configuration

TraceNova allows you to control its behavior using environment variables. If you don't have a \`tracenova.cjs\` configuration file in the root of your project, TraceNova will use the following default configuration, which can be overridden by environment variables:

```javascript
otelURL: process.env.OTEL_EXPORTER_URL || 'http://collector:4318/v1/traces',
appName: process.env.APP_NAME || 'My App',
instrumentations: [
    // Default instrumentation (Http)
]
```

## OpenTelemetry Compatibility

| TraceNova Version | OpenTelemetry Version | ES6 Modules Support |
| ----------------- | --------------------- | ------------------- |
| 1.0.0             | 1.0.0 - 1.5.0          | Yes                 |
|

## Contributing

Contributions are welcome! Please refer to the [Contribution Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For more information about OpenTelemetry, visit the [OpenTelemetry website](https://opentelemetry.io/).

**Note:** This README provides a basic structure for your package documentation. You should customize it to provide more detailed information about your package's usage, options, and other relevant details. Feel free to add more sections, such as advanced usage and troubleshooting. Make sure to provide clear and concise instructions to help users get started with TraceNova in their ES6 module-based projects.
