module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      startServerCommand: 'yarn run dev',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
