import AudioRepository from "./AudioRepository";
type Message = string;
type VoiceId = string;
type AudioId = string;

export default (() => {
  const audioCache: Map<AudioId, HTMLAudioElement> = new Map();
  const play = (id: [VoiceId, Message]): Promise<void> =>
    new Promise((resolve, reject) =>
      load(id).then((audio) => {
        audio.onended = () => {
          if (!!audio) {
            audio.onended = null;
          }
          resolve();
        };
        audio.currentTime = 0;
        audio.play();
      })
    );

  type UtteranceId = [VoiceId, Message];

  const playInParallel = (ids: UtteranceId[]): Promise<void> =>
    Promise.all(ids.map(play)).then();

  const playInSequence = (
    ids: UtteranceId[],
    setActiveIndex: (index: number | undefined) => void
  ): Promise<void> =>
    ids.length === 0
      ? Promise.resolve()
      : ids.reduce(
          (prev: Promise<void>, id: UtteranceId, currentIndex: number) =>
            prev.then(() => {
              setActiveIndex(currentIndex);
              return play(id).then(() => setActiveIndex(undefined));
            }),
          Promise.resolve()
        );

  const pauseAll = (ids: UtteranceId[]): Promise<void> =>
    Promise.all(ids.map(load)).then((audioElements) => {
      for (let a of audioElements) {
        a.pause();
      }
    });

  const pause = (id: [VoiceId, Message]): Promise<void> =>
    load(id).then((a) => {
      a.pause();
    });

  const playMomentsInSequence = (
    ids: [VoiceId, Message][][],
    setActiveIndex: (index: number | undefined) => void
  ): Promise<void> =>
    new Promise((resolve, reject) => {
      if (ids.length === 0) {
        resolve();
        return;
      }
      let i = 0;
      const loop = () => {
        if (i < ids.length) {
          setActiveIndex(i);
          playInParallel(ids[i]).then(() => {
            i++;
            loop();
          });
        } else {
          setActiveIndex(undefined);
          resolve();
        }
      };
      loop();
    });

  const load = (id: [VoiceId, Message]): Promise<HTMLAudioElement> =>
    new Promise((resolve, reject) => {
      let [voiceId, message] = id;
      let audioId = voiceId + ":" + message;
      if (audioCache.has(audioId)) {
        let audio = audioCache.get(audioId);
        if (!audio) {
          reject();
        } else {
          resolve(audio);
        }
      } else {
        AudioRepository.getAudioBlob(id).then((blob) => {
          let url = URL.createObjectURL(blob);
          let audio = new Audio(url);
          audioCache.set(audioId, audio);
          resolve(audio);
        });
      }
      console.log({ audioCache });
    });
  return {
    pause,
    load,
    play,
    playInParallel,
    playMomentsInSequence,
    pauseAll,
    playInSequence,
  };
})();
