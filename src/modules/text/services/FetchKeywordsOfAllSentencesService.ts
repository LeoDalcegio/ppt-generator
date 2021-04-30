import AppError from '@shared/errors/AppError';
import { FETCHING_KEYWORDS_ERROR } from '@shared/errors/Errors';
import IContent from '@shared/interfaces/IContent';
import { nlu } from '@modules/config/watson';

class FetchKeywordsOfAllSentencesService {
  public async execute(content: IContent) {
    try {
      for (const sentence of content.sentences) {
        sentence.keywords = await this.fetchWatsonAndReturnKeywords(
          sentence.text,
        );
      }
    } catch (error) {
      throw new AppError(`${FETCHING_KEYWORDS_ERROR} - ${error}`);
    }
  }

  private async fetchWatsonAndReturnKeywords(
    sentence: string,
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      nlu.analyze(
        {
          text: sentence,
          features: {
            keywords: {},
          },
        },
        (error, response) => {
          if (error) {
            reject(error);
            return;
          }

          const keywords: string[] = response!.keywords!.map(keyword => {
            return keyword.text;
          }) as string[];

          resolve(keywords);
        },
      );
    });
  }
}

export default new FetchKeywordsOfAllSentencesService();
