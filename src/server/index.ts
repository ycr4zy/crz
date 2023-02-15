import "reflect-metadata";
import { emitNetPromise } from '@shared/rpc';
import { onNetEvent } from '@shared/decorator';

//onNetPromise<string>('callserver', (source, message) => {
//
//  const response: string = `Chamado por a seguinte mensagem: ${message}`
//
//  console.log(response)
//
//  return response;
//
//});

RegisterCommand('server', async (source: string) => { //ok this is working

  const result = await emitNetPromise<string>({ source: source, type: "client", eventName: 'callclient', args: ['AB','CD'] });
  const result2 = await emitNetPromise<string>({ source: source, type: "server", eventName: 'callserver', args: ['EF', 'GH'] });

  console.debug("server->client", result);

  console.debug("server->server", result2);


}, false);


class ExampleClass {

  @onNetEvent()
  async callserver(source: string, message: string, test: string) {

    const response: string = `${source} chamou a seguinte mensagem: ${message}, ${test}`

    return response;
  }
}

new ExampleClass();