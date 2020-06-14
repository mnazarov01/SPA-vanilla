import { enableMocks, disableMocks } from 'jest-fetch-mock';
import Sender from '../src/client/handlers/sender';

describe('Sender: ', () => {
  let sender;

  const RESPOUNCE = {
    testRespounce: true,
  };

  const REQUEST = {
    testRequest: true,
  };

  beforeAll(() => {
    enableMocks();
  });

  beforeEach(() => {
    sender = new Sender('*');
  });

  afterAll(() => {
    disableMocks();
  });

  test('should be created', () => {
    expect(sender).not.toBeFalsy();
    expect(sender).toBeInstanceOf(Sender);
  });

  test('method GET', async () => {
    fetch.mockResponseOnce(JSON.stringify(RESPOUNCE));
    const json = await sender.getDataFromServer({}, 'GET');

    expect(json).toEqual(RESPOUNCE);
    expect(fetch).toHaveBeenCalledWith('*', {
      headers: {
        'Content-type': 'application/json',
      },
      method: 'GET',
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('method GET (error implementation)', () => {

  });

  test('method POST', async () => {
    fetch.mockResponseOnce(JSON.stringify(RESPOUNCE));
    const json = await sender.getDataFromServer(REQUEST, 'POST');

    expect(json).toEqual(RESPOUNCE);
    expect(fetch).toHaveBeenCalledWith('*',
      {
        body: JSON.stringify(REQUEST),
        headers: {
          'Content-type': 'application/json',
        },
        method: 'POST',
      });

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
