import IContent from '@shared/interfaces/IContent';

class LimitMaximumSentencesService {
  public async execute(content: IContent) {
    // "7" should come from the request
    content.sentences = content.sentences.slice(0, 7);
  }
}

export default new LimitMaximumSentencesService();
