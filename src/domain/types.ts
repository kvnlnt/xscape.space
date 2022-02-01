type Song = {
  artist: string;
  artistLink: string;
  songName: string;
  mp3Url: string;
};

export type Spaces = 'think' | 'chill' | 'deep';

export type Space = {
  name: Spaces;
  songs: Song[];
};
