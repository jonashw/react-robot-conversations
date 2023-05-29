import { loadVoiceBoard, parseConversationText } from "../loadVoiceBoard";
import { Voice, VoiceIndex, VoiceBoard, Character } from "../Model";
let sampleScript = `
Bob: Justin,👦
Alice: Ivy,👧
Narrator: Matthew.👤
Officer Chunky: Salli,👮‍♀️
# begin script
Narrator: Alice is walking down the sidewalk without any clothes on.  Bob sees her from across the street and runs over to say hi to her.
Bob:Hello Alice.  Nice to see you.  Why are you naked?
Narrator: Alice looks surprised.
Alice: Oh hi Bob.  I didn't think you could see me.  Five minutes ago I poured an invisibility potion on my head.  I thought I was invisible before you said hi to me.
Narrator: Bob laughs and pulls a spoon out of his pocket.
Bob: yep, I can see you, and I can see the large blob of goo sitting on the top of your head.  It looks like a whole cup of yogurt up there and I'm really hungry.
Alice:maybe I should rub it into my hair so I can finally become invisible.
Narrator: Alice reaches up to put her hands in the goo.
Bob: maybe you should let me eat it with this spoon it so I can stop being hungry.
Narrator: Bob held up the spoon he was holding and jumped at Alice.  In only 3 spoonfuls, he quickly ate the invisibility potion from her head.  Alice looked angry.
Alice:Hey! I did not give you permission to do that!
Bob: Mmmm that was good.  I'm sorry but also I'm not sorry.
Narrator: Bob's satisfied smile transformed into a pained frown.  He put his hands to his tummy and groaned.
Bob: Oh no oh no oh no my tummy tummy tummy hurts hurts hurts
Alice: uh oh.  This isn't good.
Bob: something strange is happening to me!
Narrator: something strange was happening to Bob.
Alice: You're becoming invisible!
Narrator: Bob became invisible.
Bob: Alice what's happening?  Can you see me?
Alice: Bob, no, I can't see you anymore.  
Bob: OK Cool.
Narrator: Bob took off his clothes and ran down the street naked.
Alice: What do you mean ok cool?
Narrator: Bob couldn't hear her because he had run away but there was someone who heard her: a police officer.
Officer Chunky: Stop at the name of the law!  You are under arrest for being naked in public.  Get down on the ground now!!!
Narrator: Alice laid down on the ground with her hands behind her back.
Alice: But I'm supposed to be invisible!  This is all Bob's fault.
Narrator: The police officer pulled off her hat to reveal that she was actually Bob.  Bob had been in disguise.
Bob: Ah ha!  I tricked you!  OK.  Here, try this.
Narrator: Bob rubbed some invisibility potion into Alice's hair and she became invisible too.  She jumped up and down, singing loudly.
Alice: la la la.  la la la.  oh oh oh. oooooooooo.
Bob: Hey Alice
Alice: what
Bob: being invisible is so much fun.  la la la. la la la.  oh oh oh.  ooooooooooooooo.
Narrator: Bob and Alice ran down the sidewalk, singing their cute song, loudly.  Since they were invisible, this spooked everyone around them.  Everyone started to believe that the town was haunted.  The end.`;

export default ({
  setVoiceBoards,
  voiceBoards,
  activeVoiceBoard,
  setActiveVoiceBoard,
  voiceIndex,
}: {
  setVoiceBoards: (vbs: VoiceBoard[]) => void;
  voiceBoards: VoiceBoard[];
  activeVoiceBoard: VoiceBoard | undefined;
  setActiveVoiceBoard: (vb: VoiceBoard | undefined) => void;
  voiceIndex: VoiceIndex;
}) => {
  const promptForPaste = () => {
    let rawScript =
      prompt("Please put your script in the box.  Thank you.", sampleScript) ||
      "";

    let vb = parseConversationText(voiceIndex, rawScript);

    setVoiceBoards([...voiceBoards, vb]);
    setActiveVoiceBoard(vb);
  };
  const addNewVoiceBoard = () => {
    let vb: VoiceBoard = {
      type: "conversation",
      name: "new sketch",
      id: voiceBoards.length + 1,
      characters: {},
      utteranceMoments: [],
    };
    setVoiceBoards([...voiceBoards, vb]);
    setActiveVoiceBoard(vb);
  };
  return (
    <>
      {" "}
      {false && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {voiceBoards.map((vb, i) => (
            <button
              key={i}
              className={
                "flex-grow-1 mx-1 btn " +
                (!!activeVoiceBoard && activeVoiceBoard.id === vb.id
                  ? "btn-primary"
                  : "btn-outline-primary")
              }
              onClick={() => {
                if (!!activeVoiceBoard && activeVoiceBoard.id === vb.id) {
                  setActiveVoiceBoard(undefined);
                } else {
                  setActiveVoiceBoard(vb);
                }
              }}
            >
              {vb.id}
            </button>
          ))}
          <button
            className="flex-grow-1 mx-1 btn btn-outline-primary"
            onClick={addNewVoiceBoard}
          >
            +
          </button>
        </div>
      )}
      <div className="list-group" style={{ paddingBottom: "4em" }}>
        {voiceBoards.map((vb) => (
          <a
            className="list-group-item"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveVoiceBoard(vb);
            }}
          >
            {vb.name}
          </a>
        ))}
      </div>
      <div
        style={{ position: "fixed", bottom: 0, right: 0, left: 0 }}
        className="mx-5"
      >
        <div className="d-grid">
          <div className="btn-group my-2">
            <button
              className="btn btn-primary btn-lg"
              onClick={(e) => {
                addNewVoiceBoard();
              }}
            >
              + Create a new one
            </button>
            <button
              className="btn btn-light btn-lg"
              onClick={(e) => {
                promptForPaste();
              }}
            >
              + Paste a script
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
