module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      numberOfRuns: 5,
      startServerCommand: 'yarn run dev',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
