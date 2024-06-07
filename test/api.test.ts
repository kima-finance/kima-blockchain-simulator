/** @format */

import request from 'supertest';

import app from '../src/app';

const transaction = {
  originAddress: '0x1234567890abcdef1234567890abcdef12345678',
  originChain: 'eth',
  targetAddress: '0x1234567890abcdef1234567890abcdef12345678',
  targetChain: 'bsc',
  symbol: 'USDK',
  amount: '1',
  fee: '0.01',
  data: 'Hello, World!',
};

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(
        200,
        {
          message: 'KBS API - 👋🌎🌍🌏',
        },
        done,
      );
  });
});

describe('POST /api/v1/submit', () => {
  it('responds with a json message', (done) => {
    const expectedResponse = {
      type: 'transfer',
      internalTransactions: {
        origin: {
          address: transaction.originAddress,
          chainShortName: transaction.originChain,
          symbol: transaction.symbol,
          amount: transaction.amount,
          fee: transaction.fee,
          status: 'pending',
        },
        target: {
          address: transaction.targetAddress,
          chainShortName: transaction.targetChain,
          symbol: transaction.symbol,
          amount: transaction.amount,
          status: 'pending',
        },
      },
      data: transaction.data,
      status: 'recorded',
    };
    request(app)
      .post('/api/v1/submit')
      .send(transaction)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe('success');
        expect(response.body.transaction.id).toBeTruthy();
        expect(response.body.transaction.type).toEqual(expectedResponse.type);
        expect(response.body.transaction.internalTransactions).toMatchObject(
          expectedResponse.internalTransactions,
        );
        expect(response.body.transaction.data).toEqual(expectedResponse.data);
        expect(response.body.transaction.status).toEqual(
          expectedResponse.status,
        );
        done();
      });
  });
});

describe('GET /api/v1/status', () => {
  it('responds with a json message', (done) => {
    request(app)
      .post('/api/v1/submit')
      .send(transaction)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((submitResponse) => {
        const id = submitResponse.body.transaction.id;
        request(app)
          .get(`/api/v1/status?id=${id}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(response.body.transaction.id).toBe(id);
            done();
          });
      });
  });
});
