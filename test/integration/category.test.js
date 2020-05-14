const User = require('../../models/user');
const mongoose = require('mongoose');
let req = require('supertest');


let server;

describe('api/category', () => {
  beforeEach(async () => { server = await require("../../index"); })
  afterEach(async () => { await server.close(); })

  describe('/all = GET', () => {
    it('should return all category', async () => {
      const res = await req(server).get('/api/category/all/');
      expect(res.status).toBe(200);
    })
  })

  describe('/:id = GET', () => {
    it('should return category with given id', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      const res = await req(server).get('/api/category/' + id);
      expect(res.status).toBe(404);
    })
  })

})