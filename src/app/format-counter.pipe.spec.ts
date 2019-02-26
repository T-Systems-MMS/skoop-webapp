import { FormatCounterPipe } from './format-counter.pipe';

const pipe = new FormatCounterPipe();

describe('FormatCounterPipe', () => {
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 if value is null', () => {
    expect(pipe.transform(null)).toBe('0');
  });

  it('should return an initial value if value <= 99', () => {
    expect(pipe.transform(99)).toBe('99');
  });

  it('should return 99+ if value > 99', () => {
    expect(pipe.transform(666)).toBe('99+');
  });
});
