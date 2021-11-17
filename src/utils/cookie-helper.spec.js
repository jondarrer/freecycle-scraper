import { getCookies } from './cookie-helper';

describe('getCookies', () => {
  it('should get no cookies when given none', () => {
    expect(getCookies()).toHaveLength(0);
  });
});