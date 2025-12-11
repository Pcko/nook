/**
 * A callback function that is called for each chunk of streamed data.
 *
 * @callback StreamCallback
 * @param {string} chunk - A portion of the streamed data.
 */
export type StreamCallback = (chunk: string) => void;
