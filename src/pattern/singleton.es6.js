
const createSingleton = Fn => {

  let Singleton = class extends Fn {

    constructor(...args){
      super(...args);
      if(!Singleton.instance){
        Singleton.instance = this;
      }
      return Singleton.instance;
    }

  };

  return Singleton;

};

export default {createSingleton};