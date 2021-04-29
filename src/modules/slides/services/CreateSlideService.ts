import AppError from '@shared/errors/AppError';
import { CreateSlideDto } from '../dto/CreateSlideDto';
import sentenceBoundaryDetection from 'sbd';
import IContent from '@shared/interfaces/IContent';
import { nlu } from '@modules/config/watson';
//import imageDownloader from 'image-downloader';
//import Scraper from 'images-scraper';
import { IMAGE_DOWNLOADING_ERROR } from '@shared/errors/Errors';

/*const google = new Scraper({
  puppeteer: {
    headless: true,
  },
});*/

class CreateSlideService {
  public async execute(createSlideDto: CreateSlideDto): Promise<IContent> {
    const { text, searchTerm, language } = createSlideDto;

    let content: IContent = {
      originalText: text,
      sentences: [],
      downloadedImages: [],
      searchTerm,
    };

    this.breakTextIntoSentences(content);
    this.limitMaximumSentences(content);
    await this.fetchKeywordsOfAllSentences(content);
    //await this.fetchImagesOfAllSentences(content);
    //await this.downloadAllImages(content);

    return content;
  }

  private breakTextIntoSentences(content: IContent) {
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

  private limitMaximumSentences(content: IContent) {
    // "7" should come from the request
    content.sentences = content.sentences.slice(0, 7);
  }

  async fetchKeywordsOfAllSentences(content: IContent) {
    for (const sentence of content.sentences) {
      sentence.keywords = await this.fetchWatsonAndReturnKeywords(
        sentence.text,
      );
    }
  }

  async fetchWatsonAndReturnKeywords(sentence: string): Promise<string[]> {
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

  // async fetchImagesOfAllSentences(content: IContent) {
  //   for (
  //     let sentenceIndex = 0;
  //     sentenceIndex < content.sentences.length;
  //     sentenceIndex++
  //   ) {
  //     let query;

  //     if (sentenceIndex === 0) {
  //       query = `${content.searchTerm}`;
  //     } else {
  //       query = `${content.searchTerm} ${content.sentences[sentenceIndex].keywords[0]}`;
  //     }

  //     console.log(`> [image-robot] Querying Google Images with: "${query}"`);

  //     content.sentences[
  //       sentenceIndex
  //     ].images = await this.fetchGoogleAndReturnImagesLinks(query);

  //     content.sentences[sentenceIndex].googleSearchQuery = query;
  //   }
  // }

  // async fetchGoogleAndReturnImagesLinks(query: string) {
  //   var options = {
  //     tbs: {
  //       il: 'cl',
  //     },
  //   };

  //   const results = await google.scrape(query, 4, options);

  //   const imagesUrl = results.map(item => {
  //     return item.url;
  //   });

  //   return imagesUrl;
  // }

  // async downloadAllImages(content: IContent) {
  //   content.downloadedImages = [];

  //   for (
  //     let sentenceIndex = 0;
  //     sentenceIndex < content.sentences.length;
  //     sentenceIndex++
  //   ) {
  //     const images = content.sentences[sentenceIndex].images;

  //     for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
  //       const imageUrl = images[imageIndex];

  //       try {
  //         if (content.downloadedImages.includes(imageUrl)) {
  //           throw new Error('Image has already been downloaded');
  //         }

  //         await this.downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);

  //         content.downloadedImages.push(imageUrl);
  //         console.log(`> Baixou com sucesso ${imageUrl}`);

  //         break;
  //       } catch (error) {
  //         throw new AppError(`${IMAGE_DOWNLOADING_ERROR} - ${imageUrl}`);
  //       }
  //     }
  //   }
  // }

  // async downloadAndSave(url: string, fileName: string) {
  //   return imageDownloader.image({
  //     url: url,
  //     dest: `./content/${fileName}`,
  //   });
  // }
}

export default CreateSlideService;
