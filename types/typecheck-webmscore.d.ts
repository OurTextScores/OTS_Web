declare module 'webmscore' {
  const WebMscore: {
    ready: Promise<void>;
    load: (...args: unknown[]) => Promise<unknown>;
  };
  export default WebMscore;
}
