export async function fetchNui<T = any>(eventName: string, data?: any): Promise<T> {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data)
  }

  const resourceName = (window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'crz';

  const res = await fetch(`https://${resourceName}/${eventName}`, options);

  const resFormatted = await res.json();

  return resFormatted
}