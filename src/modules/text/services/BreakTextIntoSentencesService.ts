import IContent from '@shared/interfaces/IContent';
import sentenceBoundaryDetection from 'sbd';

class BreakTextIntoSentencesService {
  public async execute(content: IContent) {
    const sentencesDetected = sentenceBoundaryDetection.sentences(
      content.originalText,
    );

    sentencesDetected.forEach((sentence: string) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: [],
      });
    });
  }
}

export default new BreakTextIntoSentencesService();
