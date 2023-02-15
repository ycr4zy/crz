import { emitNetPromise, onNetPromise } from '@shared/rpc';

onNetPromise<string>('callserver', (source, message) => {

  const response: string = `Chamado por a seguinte mensagem: ${message}`

  console.log(response)

  return response;

});

RegisterCommand('server', async (source: string) => { //ok this is working

  const result = await emitNetPromise<string>({ source: source, eventName: 'callclient', args: ['Mensagem doida'] });


  console.debug(result);

}, false);