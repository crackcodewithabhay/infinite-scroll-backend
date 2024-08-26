// test/server.test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/photos', async (req, res) => {
  const { page = 1, query } = req.query;
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return res.status(500).json({ message: 'API key is missing' });
  }

  const apiLink = query
    ? `https://api.unsplash.com/search/photos?page=${page}&client_id=${accessKey}&query=${query}`
    : `https://api.unsplash.com/photos?page=${page}&client_id=${accessKey}`;

  try {
    const response = await axios.get(apiLink);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

chai.use(chaiHttp);
const { expect } = chai;

describe('GET /api/photos', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should fetch photos from Unsplash', async () => {
    const mockResponse = { data: [{ id: '1', urls: { regular: 'http://example.com/image.jpg' }, alt_description: 'A sample image' }] };

    sinon.stub(axios, 'get').resolves(mockResponse);

    const res = await chai.request(app).get('/api/photos?page=1');

    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal(mockResponse.data);
  });

  it('should handle missing API key', async () => {
    delete process.env.UNSPLASH_ACCESS_KEY;

    const res = await chai.request(app).get('/api/photos?page=1');

    expect(res).to.have.status(500);
    expect(res.body.message).to.equal('API key is missing');

    process.env.UNSPLASH_ACCESS_KEY = 'your_unsplash_access_key_here';
  });
});
