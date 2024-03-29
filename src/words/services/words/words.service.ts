import { Injectable } from '@nestjs/common';
import { Word } from '../../../typeorm/entities/word';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, UpdateResult } from 'typeorm';
import { CreateWordParams } from '../../../utils/types';
import { UpdateWordDto } from '../../dtos/update-word.dto';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word) private wordsRepository: Repository<Word>,
  ) {}

  /**
   * This creates a new word according to the details provided in the Word object
   * and returns the newly created word
   *
   * @param {Partial<Word>} wordDetails - the details of the new word
   * @returns {Promise<Word>} - the newly created Word object
   */
  async addWord(wordDetails: CreateWordParams): Promise<Word> {
    const newWord = this.wordsRepository.create({
      ...wordDetails,
      createdAt: new Date(),
    });
    return await this.wordsRepository.save(newWord);
  }

  /**
   * This updates a word by its id
   *
   * @param {number} wordID - the id of the word to update
   * @param {UpdateWordDto} updateWordDto - a UpdateWordDto object that contains the
   * details of the word to replace the existing word
   * @returns {Promise<UpdateResult>} - the update result
   */
  async updateWord(
    wordID: number,
    updateWordDto: UpdateWordDto,
  ): Promise<UpdateResult> {
    return await this.wordsRepository.update(wordID, updateWordDto);
  }

  /**
   * This returns a word by its id
   *
   * @param {number} id - the id of the word to return
   * @returns {Promise<Word>} - the Word object with the specified id
   */
  async findWordById(id: number): Promise<Word> {
    return await this.wordsRepository.findOne({
      where: { id },
    });
  }

  /**
   * This returns all words
   *
   * @returns {Promise<Word[]>} - an array of all Word objects
   */
  async findWords(): Promise<Word[]> {
    return await this.wordsRepository.find();
  }

  /**
   * This returns words by their country of use
   *
   * @param {string} countryCode - the country code of the words to return
   * @returns {Promise<Word[]>} - an array of Word objects used in the specified country
   */
  // TODO: This definitely needs to be tested
  async getWordsByCountry(countryCode: string): Promise<Word[]> {
    return this.wordsRepository
      .createQueryBuilder('word')
      .innerJoin('word.countriesOfUse', 'country')
      .where('country.countryCode = :countryCode', { countryCode })
      .getMany();
  }

  /**
   * This returns words based on a search keyword that matches or is a substring of either the arabicWord
   * or francoArabicWord
   *
   * @param {string} keyword - the keyword to search for
   * @returns {Promise<Word[]>} - an array of Word objects that match the search keyword
   */
  searchWords(keyword: string): Promise<Word[]> {
    return this.wordsRepository.find({
      where: [
        { arabicWord: Like(`%${keyword}%`) },
        { francoArabicWord: Like(`%${keyword}%`) },
      ],
    });
  }
}
