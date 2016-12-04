import { ltIE } from './hardcore/utils.es6.js';
import { RiotApp } from './hardcore/riot.app.es6.js';

let env = () => {
  if(/localhost|127\.0/.test(window.location.origin)){
    return 'dev';
  }
  return 'pro';
};

if(ltIE(9)){
  window.location.href = './upgrade.html';
}
else{
  new RiotApp({
    id: 'fp',
    env: env()
  });
}
