import { emitNetPromise, onNetPromise } from '@shared/rpc';

onNetPromise<string>('callclient', (message) => {//ok this is working

  const response: string = `Chamado por a seguinte mensagem: ${message}`

  console.log(response)

  return response;

});

RegisterCommand('client', async () => {

  const result = await emitNetPromise<string>({ eventName: 'callserver', args: ['TESTE CLIENT-SIDE'] });

  console.debug(result);

}, false);