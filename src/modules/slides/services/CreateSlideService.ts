import BreakTextIntoSentencesService from '@modules/text/services/BreakTextIntoSentencesService';
import FetchKeywordsOfAllSentencesService from '@modules/text/services/FetchKeywordsOfAllSentencesService';
import LimitMaximumSentencesService from '@modules/text/services/LimitMaximumSentencesService';
import AppError from '@shared/errors/AppError';
import { IMAGE_DOWNLOADING_ERROR } from '@shared/errors/Errors';
import IContent from '@shared/interfaces/IContent';
import imageDownloader from 'image-downloader';
import Scraper from 'images-scraper';
import { CreateSlideDto } from '../dto/CreateSlideDto';

const google = new Scraper({
  puppeteer: {
    headless: true,
  },
});

class CreateSlideService {
  public async execute(createSlideDto: CreateSlideDto): Promise<IContent> {
    const { text, searchTerm, language } = createSlideDto;

    let content: IContent = {
      originalText: text,
      sentences: [],
      downloadedImages: [],
      searchTerm,
    };

    BreakTextIntoSentencesService.execute(content);
    LimitMaximumSentencesService.execute(content);
    await FetchKeywordsOfAllSentencesService.execute(content);
    await this.fetchImagesOfAllSentences(content);
    //await this.downloadAllImages(content);

    return content;
  }

  async fetchImagesOfAllSentences(content: IContent) {
    for (
      let sentenceIndex = 0;
      sentenceIndex < content.sentences.length;
      sentenceIndex++
    ) {
      let query;

      if (sentenceIndex === 0) {
        query = `${content.searchTerm}`;
      } else {
        query = `${content.searchTerm} ${content.sentences[sentenceIndex].keywords[0]}`;
      }

      console.log(`> [image-robot] Querying Google Images with: "${query}"`);

      content.sentences[
        sentenceIndex
      ].images = await this.fetchGoogleAndReturnImagesLinks(query);

      content.sentences[sentenceIndex].googleSearchQuery = query;
    }
  }

  async fetchGoogleAndReturnImagesLinks(query: string) {
    const results = await google.scrape(query, 4);
    console.log(results);
    const imagesUrl = [results.url];

    return imagesUrl;
  }

  async downloadAllImages(content: IContent) {
    content.downloadedImages = [];

    for (
      let sentenceIndex = 0;
      sentenceIndex < content.sentences.length;
      sentenceIndex++
    ) {
      const images = content.sentences[sentenceIndex].images;

      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        const imageUrl = images[imageIndex];

        try {
          if (content.downloadedImages.includes(imageUrl)) {
            throw new Error('Image has already been downloaded');
          }

          await this.downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);

          content.downloadedImages.push(imageUrl);
          console.log(`> Baixou com sucesso ${imageUrl}`);

          break;
        } catch (error) {
          throw new AppError(`${IMAGE_DOWNLOADING_ERROR} - ${imageUrl}`);
        }
      }
    }
  }

  async downloadAndSave(url: string, fileName: string) {
    return imageDownloader.image({
      url: url,
      dest: `./content/${fileName}`,
    });
  }
}

export default new CreateSlideService();
