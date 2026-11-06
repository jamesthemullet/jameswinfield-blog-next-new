import { trackEvent } from '../lib/analytics';

describe('trackEvent', () => {
  afterEach(() => {
    delete (window as { gtag?: unknown }).gtag;
  });

  it('calls window.gtag with the event name when gtag is available', () => {
    const gtag = jest.fn();
    window.gtag = gtag;

    trackEvent('hire_cta_click');

    expect(gtag).toHaveBeenCalledWith('event', 'hire_cta_click');
  });

  it('does nothing when window.gtag is not a function', () => {
    expect(() => trackEvent('hire_cta_click')).not.toThrow();
  });
});
