// run with command$
// k6 run load/k6_local.js

import http from 'k6/http';
import { sleep } from 'k6';

const url = 'http://localhost:3000/reviews';

export let options = {
  vus: 100,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<1500']
  }
}

export default function () {
  http.get(`${url}/1/meta`);
  sleep(1);
}