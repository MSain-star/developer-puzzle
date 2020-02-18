/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import { environment } from './environments/environment';
const H2o2 = require('@hapi/h2o2');

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
    routes: {
      cors: {
        origin: ["*"],
        headers: ["Accept", "Content-Type"]
      }
    }
  });

  const error = {
    code: 404,
    message: "An error has occurred.Please try again !!"
  }

  await server.register(H2o2);

  const fetchQueryData = async (symbol, period) => {
    let result = '';
    await server.inject(`/proxy/stock/${symbol}/chart/${period}`).then(res => {
      result = res.payload;
    });
    return result;
  };

  /**
   * Setting the cache options for the query data
   */
  server.method({
    name: 'fetchQueryData',
    method: fetchQueryData,
    options: {
      cache: {
        expiresIn: 2 * 60 * 1000,
        generateTimeout: 5000
      }
    }
  });

  /**
   * Method to get the cached query data for the stock
   */
  server.route({
    method: 'GET',
    path: '/beta/stock/{symbol}/chart/{period}',
    handler: async (request, h) => {
      return server.methods.fetchQueryData(request.params.symbol, request.params.period);
    }
  });

  /**
   * Handle the actual API call to get the stock chart data
   */
  server.route({
    method: 'GET',
    path: '/proxy/stock/{symbol}/chart/{period}',
    options: {
      handler: {
        proxy: {
          uri: environment.apiURL + '/beta/stock/{symbol}/chart/{period}?token=' + environment.apiKey,
          passThrough: true,
          xforward: true
        }
      }
    }
  });

  /**
   * Handle the error scenario of the API route path
   */
  server.route({
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      return error;
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
