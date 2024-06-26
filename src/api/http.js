import { Config } from './config.js';
import { Result } from './result.js';

export class Http {
  response;
  content;
  uri;
  path;
  method;
  headers;

  constructor() {
    this.headers = {};
  }

  to(path) {
    this.setPath(path);

    return this;
  }

  with(headers) {
    this.headers = headers;

    return this;
  }

  async get() {
    this.method = 'GET';

    await this.requestUrl();
    await this.buildContent();

    return new Result(this.content);
  }

  async post(body) {
    this.method = 'POST';

    await this.sendJson(body);
    await this.buildContent();

    return new Result(this.content);
  }

  async put(body) {
    this.method = 'PUT';

    await this.sendJson(body);
    await this.buildContent();

    return new Result(this.content);
  }

  async delete() {
    this.method = 'DELETE';

    await this.requestUrl();
    await this.buildContent();

    return new Result(this.content);
  }

  async buildContent() {
    this.content = await this.response.json();
  }

  async requestUrl() {
    this.response = await fetch(this.uri, {
      method: this.method,
      mode: 'cors',
      headers: this.headers
    });

    return this;
  }

  async sendJson(data) {
    this.response = await fetch(this.uri, {
      method: this.method,
      headers: {
        ...Config.getDefaultHeaders(),
        ...this.headers
      },
      mode: 'cors',
      body: JSON.stringify(data)
    });

    return this;
  }

  setPath(path) {
    if (!path) {
      path = '/';
    }

    this.path = path;

    return this.serializePath().setUri();
  }

  setUri() {
    this.uri = `${Config.getBaseUrl()}${this.path}`;

    return this;
  }

  serializePath() {
    if (this.path[0] !== '/') {
      this.path = `/${this.path}`;
    }

    return this;
  }
}