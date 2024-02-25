import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../../../typeorm/entities/country';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countriesRepository: Repository<Country>,
  ) {}

  /*
   * This returns all countries
   *
   * @returns {Promise<Country[]>} - an array of all Country objects
   */
  async getAllCountries(): Promise<Country[]> {
    return this.countriesRepository.find();
  }

  /*
   * This returns a country by its code
   *
   * @param {string} countryCode - the code of the country to return
   * @returns {Promise<Country>} - the Country object with the specified code
   */
  async getCountryByCode(countryCode: string): Promise<Country> {
    return this.countriesRepository.findOne({ where: { countryCode } });
  }
}
