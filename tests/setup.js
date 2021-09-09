global.console = {
    // These logs are ignored in tests
    log: jest.fn(),
    info: jest.fn(),

    // Keep native behaviour for other methods
    error: console.error,
    warn: console.warn,
    debug: console.debug,
};
