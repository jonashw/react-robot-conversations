import {
  Utterance,
  UtteranceMoment,
  Conversation,
  Character,
  VoiceIndex,
} from "../Model";

class ConversationSideEffects {
  constructor(
    public readonly voiceIndex: VoiceIndex,
    public readonly conversation: Conversation,
    public updateConversation: (prev: Conversation, next: Conversation) => void
  ) {}

  updateCharacter(characterId: string, next: Character) {
    this.updateConversation(this.conversation, {
      ...this.conversation,
      characters: { ...this.conversation.characters, [characterId]: next },
    });
  }

  removeCharacter(characterId: string) {
    let updatedCharacters = { ...this.conversation.characters };
    delete updatedCharacters[characterId];
    let updatedMoments = [...this.conversation.utteranceMoments];
    for (let m of updatedMoments) {
      delete m.utteranceByCharacter[characterId];
    }
    updatedMoments = updatedMoments.filter(
      (m) => Object.keys(m.utteranceByCharacter).length > 0
    );
    this.updateConversation(this.conversation, {
      ...this.conversation,
      characters: updatedCharacters,
      utteranceMoments: updatedMoments,
    });
  }
  removeMoment(momentToRemove: UtteranceMoment) {
    this.updateConversation(this.conversation, {
      ...this.conversation,
      utteranceMoments: this.conversation.utteranceMoments.filter(
        (moment) => moment !== momentToRemove
      ),
    });
  }
  addMoment() {
    let updatedConversation = {
      ...this.conversation,
      utteranceMoments: [
        ...this.conversation.utteranceMoments,
        {
          utteranceByCharacter: {},
          id: Math.random().toString(),
        },
      ],
    };
    this.updateConversation(this.conversation, updatedConversation);
  }

  moveMoment(moment: UtteranceMoment, direction: "up" | "down") {
    let prevIndex = this.conversation.utteranceMoments.indexOf(moment);
    if (prevIndex === -1) {
      return;
    }
    let indexOffset = direction === "up" ? -1 : 1;
    let nextIndex = prevIndex + indexOffset;
    if (nextIndex >= this.conversation.utteranceMoments.length) {
      nextIndex = prevIndex;
    }
    if (nextIndex < 0) {
      nextIndex = 0;
    }
    let updatedMoments = [...this.conversation.utteranceMoments];
    let otherMoment = updatedMoments[nextIndex];
    updatedMoments[nextIndex] = moment;
    updatedMoments[prevIndex] = otherMoment;
    this.updateConversation(this.conversation, {
      ...this.conversation,
      utteranceMoments: updatedMoments,
    });
  }
  setCharacterUtterance = (
    characterId: string,
    moment: UtteranceMoment,
    message: string
  ) => {
    {
      let updatedMoment: UtteranceMoment | undefined = {
        ...moment,
        utteranceByCharacter: {
          ...moment.utteranceByCharacter,
          [characterId]: {
            voice: this.voiceIndex.getById(
              this.conversation.characters[characterId].voice
            ),
            phrase: message,
          } as Utterance,
        },
      };
      let substantiveUtterancesInTheMoment = Object.entries(
        updatedMoment.utteranceByCharacter
      )
        .map(([s, u]) => ({ ...u, phrase: (u.phrase || "").trim() }))
        .filter(({ phrase }) => phrase !== "");

      if (
        substantiveUtterancesInTheMoment.length === 0 &&
        confirm("Nobody is talking in this moment.  Remove?")
      ) {
        updatedMoment = undefined;
      }
      let updatedUtteranceMoments = this.conversation.utteranceMoments
        .map((um) => (um === moment ? updatedMoment : um))
        .filter((um) => um !== undefined)
        .map((um) => um as UtteranceMoment);

      if (message.trim().length === 0) {
        delete updatedMoment?.utteranceByCharacter[characterId];
      }
      this.updateConversation(this.conversation, {
        ...this.conversation,
        utteranceMoments: updatedUtteranceMoments,
      });
      let substantiveUtterancesByThisCharacter = updatedUtteranceMoments
        .map((um) =>
          (um.utteranceByCharacter[characterId]?.phrase || "").trim()
        )
        .filter((msg) => msg.length > 0);
      console.log({ substantiveUtterancesByThisCharacter });
      if (
        substantiveUtterancesByThisCharacter.length === 0 &&
        confirm(
          `Character "${this.conversation.characters[characterId].name}" no longer has a speaking moment.  Remove?`
        )
      ) {
        this.removeCharacter(characterId);
      }
    }
  };
}

export default ConversationSideEffects;
