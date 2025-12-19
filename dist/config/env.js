export const JWT_SECRET = (() => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return process.env.JWT_SECRET;
})();
//# sourceMappingURL=env.js.map