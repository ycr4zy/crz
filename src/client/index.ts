import { emitNetPromise } from '@shared/rpc';
import { onNetEvent } from '@shared/decorator';

//onNetPromise<string>('callclient', (message) => {//ok this is working
//
//  const response: string = `Chamado por a seguinte mensagem: ${message}`
//
//  console.log(response)
//
//  return response;
//
//});

RegisterCommand('client', async () => {

  const result = await emitNetPromise<string>({ eventName: 'callserver', type: "server", args: ['AB', 'CD'] });

  const result2 = await emitNetPromise<string>({ eventName: 'callclient', type: "client", args: ['EF', 'GH'] });

  console.debug("client->server", result);

  console.debug("client->client", result2);

}, false);
class ExampleClass {

  @onNetEvent()
  callclient(a, b) {

    const response: string = `Chamado por a seguinte mensagem: ${a}, ${b}`

    return response;
  }
}

new ExampleClass();