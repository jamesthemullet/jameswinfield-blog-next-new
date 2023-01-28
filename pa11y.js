import pa11y from 'pa11y';

pa11y('http://localhost:3000', {
  standard: 'WCAG2AA',
}).then((results) => {
  console.log(results);
});
