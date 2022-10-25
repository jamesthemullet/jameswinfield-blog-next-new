module.exports = {
  ci: {
    collect: {
      url: ['https://www.jameswinfield.co.uk'],
      numberOfRuns: 10,
      startServerCommand: 'yarn run dev',
    },
    assert: {
      preset: 'lighthouse:recommended',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
