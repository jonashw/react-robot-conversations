import AudioRepository from "./AudioRepository";
type Message = string;
type VoiceId = string;
type AudioId = [VoiceId, Message];

export default (() => {
  const audioCache: Map<AudioId, HTMLAudioElement> = new Map();
  const play = (id: AudioId): Promise<void> =>
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

  const playInParallel = (ids: AudioId[]): Promise<void> =>
    Promise.all(ids.map(play)).then();

  const pauseAll = (ids: AudioId[]): Promise<void> =>
    Promise.all(ids.map(load)).then((audioElements) => {
      for (let a of audioElements) {
        a.pause();
      }
    });

  const pause = (id: AudioId): Promise<void> =>
    load(id).then((a) => {
      a.pause();
    });

  const playSequentially = (
    ids: AudioId[][],
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

  const load = (id: AudioId): Promise<HTMLAudioElement> =>
    new Promise((resolve, reject) => {
      if (audioCache.has(id)) {
        let audio = audioCache.get(id);
        if (!audio) {
          reject();
        } else {
          resolve(audio);
        }
      } else {
        AudioRepository.getAudioBlob(id).then((blob) => {
          let url = URL.createObjectURL(blob);
          let audio = new Audio(url);
          audioCache.set(id, audio);
          resolve(audio);
        });
      }
    });
  return { pause, load, play, playInParallel, playSequentially, pauseAll };
})();
