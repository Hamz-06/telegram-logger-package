/* eslint-disable @typescript-eslint/no-explicit-any */
type ExtractedErrorInfo = {
  name: string;
  message: string;
  stack: string;
  additionalInfo: string
}
export const extractErrorInfo = (error: Error): ExtractedErrorInfo => {
  const name = error.name || 'Error';
  const message = error.message || 'No message available';
  const stack = error.stack || 'No stack trace available';

  // Collect additional properties
  const standardProps = ['name', 'message', 'stack'];
  const additionalProps = Object.keys(error)
    .filter((key) => !standardProps.includes(key))
    .reduce((acc, key) => {
      acc[key] = (error as any)[key];
      return acc;
    }, {} as Record<string, any>);

  const additionalInfo = Object.keys(additionalProps).length ?
    `${JSON.stringify(additionalProps, null, 2)}` :
    '';
  return {
    name,
    message,
    stack,
    additionalInfo,
  };
};
