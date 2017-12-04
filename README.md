# Hobbes

**Hobbes** is a contract testing library for NodeJS projects.  *This project is still in development.  Expect api changes.*

This is based heavily on the **Pact** library.  The difference is that this is meant only for NodeJS and is much more lightweight and flexible.

## Installation

```
npm install --save-dev hobbes
```

## Usage

Write a consumer test.

```js
import hobbes, { is } from 'hobbes';

describe('Consumer Test Example', () => {
  const contract = hobbes.contract({
    consumer: 'ConsumerName',
    provider: 'ProviderName',
    port: 4567,
    directory: path.resolve(__dirname, 'contracts')
  });

  describe('GET /endpoint', () => {
    const EXPECTED_BODY = is.object({
      value: is.number(1)
    });

    before(() => {
      contract.interaction({
        request: {
          method: 'GET',
          path: '/endpoint'
        },
        response: {
          status: 200,
          body: EXPECTED_BODY
        }
      });
    });

    it('should get the value', () => {
      return getValue().then(value => {
        expect(value).to.equal(1);
      });
    });
  });

  after(() => contract.finalize());
});
```

Write a provider test:

```js
import hobbes from 'hobbes';

describe('Provider Test Example', () => {
  it('should verify the contract', () => {
    return hobbes.verify({
      baseURL: 'http://provider.com',
      contract: path.resolve(__dirname, 'contracts', 'ConsumerName-ProviderName.json')
    });
  });
});
```

Run the consumer test followed by the provider test.

It's magic.
