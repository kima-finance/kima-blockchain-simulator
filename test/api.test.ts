/** @format */

import request from 'supertest';

import app from '../src/app';

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

// describe('GET /api/v1/submit', () => {
//   it('responds with a json message', (done) => {
//     request(app)
//       .get('/api/v1/submit')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, ['😀', '😳', '🙄'], done);
//   });
// });
