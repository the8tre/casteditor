declare module 'asciinema-player' {
  interface PlayerOptions {
    startAt?: number;
    autoPlay?: boolean;
    preload?: boolean;
    loop?: boolean | number;
    speed?: number;
    idleTimeLimit?: number;
    theme?: string;
    poster?: string;
    fit?: string | false;
    fontSize?: string | number;
    rows?: number;
    cols?: number;
  }

  interface PlayerInstance {
    getCurrentTime(): Promise<number>;
    getDuration(): Promise<number>;
    play(): Promise<void>;
    pause(): Promise<void>;
    seek(time: number): Promise<void>;
    dispose(): void;
  }

  interface PlayerSource {
    data?: string;
    url?: string;
  }

  export function create(
    source: PlayerSource,
    container: HTMLElement,
    opts?: PlayerOptions
  ): PlayerInstance;
}
