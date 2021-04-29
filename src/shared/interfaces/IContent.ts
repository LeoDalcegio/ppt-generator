import ISentence from './ISentence';

export default interface IContent {
  originalText: string;
  searchTerm: string;
  sentences: ISentence[];
  downloadedImages?: string[];
}
