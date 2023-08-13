const config = {
    enabled: 'yes',
    enableConsoleTracing: 'yes',
    otelURL: 'http://collector:4318/v1/traces',
    appName: 'My App',
    instrumentations: []
}

module.exports = {config};