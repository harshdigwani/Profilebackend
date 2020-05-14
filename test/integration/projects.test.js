const User = require('../../models/user');
let req = require('supertest');

let server;

describe('api/projects', () => {
  beforeEach(async () => { server = await require("../../index"); })
  afterEach(async () => { await server.close(); })

  describe('/all = GET', () => {
    it('should return 401 unauthorised', async () => {
      const res = await req(server).post('/api/projects/');
      expect(res.status).toBe(401);
    })
  })
})