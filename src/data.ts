type Song = {
  artist: string;
  artistLink: string;
  songName: string;
  mp3Url: string;
};

export type Spaces = 'think' | 'chill' | 'deep';

export type Space = {
  icon: string;
  name: Spaces;
  songs: Song[];
};

export const data: Space[] = [
  {
    icon: '💡',
    name: 'think',
    songs: [
      {
        artist: 'rapT0R',
        artistLink: 'https://soundcloud.com/linttraprecords/sets/black-wolf-beats',
        songName: "Don't be sad bro",
        mp3Url: 'https://s3.us-west-2.amazonaws.com/files.kevinlint.com/audio/lincoln/sad.mp3',
      },
      {
        artist: 'rapT0R',
        artistLink: 'https://soundcloud.com/linttraprecords/sets/black-wolf-beats',
        songName: "Don't be sad bro",
        mp3Url: 'https://s3.us-west-2.amazonaws.com/files.kevinlint.com/audio/lincoln/sad.mp3',
      },
    ],
  },
  {
    icon: '🧋',
    name: 'chill',
    songs: [
      {
        artist: 'rapT0R',
        artistLink: 'https://soundcloud.com/linttraprecords/sets/black-wolf-beats',
        songName: "Don't be sad bro",
        mp3Url: 'https://s3.us-west-2.amazonaws.com/files.kevinlint.com/audio/lincoln/sad.mp3',
      },
      {
        artist: 'rapT0R',
        artistLink: 'https://soundcloud.com/linttraprecords/sets/black-wolf-beats',
        songName: "Don't be sad bro",
        mp3Url: 'https://s3.us-west-2.amazonaws.com/files.kevinlint.com/audio/lincoln/sad.mp3',
      },
    ],
  },
  {
    icon: '🌘',
    name: 'deep',
    songs: [
      {
        artist: 'rapT0R',
        artistLink: 'https://soundcloud.com/linttraprecords/sets/black-wolf-beats',
        songName: "Don't be sad bro",
        mp3Url: 'https://s3.us-west-2.amazonaws.com/files.kevinlint.com/audio/lincoln/sad.mp3',
      },
      {
        artist: 'rapT0R',
        artistLink: 'https://soundcloud.com/linttraprecords/sets/black-wolf-beats',
        songName: "Don't be sad bro",
        mp3Url: 'https://s3.us-west-2.amazonaws.com/files.kevinlint.com/audio/lincoln/sad.mp3',
      },
    ],
  },
];
