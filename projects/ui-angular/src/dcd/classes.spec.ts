import { Person,Thing,Property,Dimension } from './classes';

describe('Person', () => {
  it('should create an instance', () => {
    expect(new Person(
      undefined,
      undefined,
      undefined,
      undefined
    )).toBeTruthy();
  });
});

describe('Thing', () => {
  it('should create an instance', () => {
    expect(new Thing({})).toBeTruthy();
  });
});

describe('Property', () => {
  it('should create an instance', () => {
    expect(new Property({})).toBeTruthy();
  });
});

describe('Dimension', () => {
  it('should create an instance', () => {
    expect(new Dimension(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    )).toBeTruthy();
  });
});
