export const captureConsoleWarn = <T>(testFn: () => T, maxWarns?: number): T => {
    // capture cleanly the warning from the given function, if no maxWarn no error'll be raised because of warning
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => { });
    try {
        return testFn();
    } finally {
        const warnCount = consoleWarnSpy.mock.calls.length;

        if (maxWarns && warnCount > maxWarns) {
            throw new Error(`Expected at most ${maxWarns} console.warn calls, but got ${warnCount}.`);
        }
        consoleWarnSpy.mockRestore(); // Restaure console.warn
    }
};

