enum Events {
  ScreenLoad,
}

type EventList = keyof typeof Events;

const useTracking = () => {
  const pub = (evt: EventList) => {
    switch (evt) {
      case 'ScreenLoad':
        // report screenload
        break;
      default:
        break;
    }
  };
  return [pub];
};
