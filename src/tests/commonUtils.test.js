import {
  remove_undefined,
  capitalizeFirstLetter,
} from '../utils/commonUtils'; // Update the path to your module

describe('remove_undefined', () => {
  it('should remove properties with undefined values from an object', () => {
    const inputObj = {
      a: 1,
      b: undefined,
      c: 'hello',
      d: undefined,
    };

    const expectedOutput = {
      a: 1,
      c: 'hello',
    };

    const result = remove_undefined(inputObj);

    expect(result).toEqual(expectedOutput);
  });

  it('should not modify the object if there are no undefined values', () => {
    const inputObj = {
      a: 1,
      b: 'hello',
      c: true,
    };

    const result = remove_undefined(inputObj);

    expect(result).toEqual(inputObj);
  });
});

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a string', () => {
    const input = 'hello world';
    const expectedOutput = 'Hello world';

    const result = capitalizeFirstLetter(input);

    expect(result).toEqual(expectedOutput);
  });

  it('should return an empty string if input is falsy', () => {
    const result = capitalizeFirstLetter('');

    expect(result).toEqual('');
  });
});

