import type { CategoryGroup, QuestionSubCategoryData } from '@/lib/types'

import qMovies from './entertainment-movies.json'
import qMusic from './entertainment-music.json'
import qGames from './entertainment-videogames.json'
import qTV from './entertainment-tv.json'
import qSchool from './teenlife-school.json'
import qRelationships from './teenlife-relationships.json'
import qSocialMedia from './teenlife-socialmedia.json'
import qDrama from './teenlife-drama.json'
import qFastFood from './foodbrands-fastfood.json'
import qTrendyFood from './foodbrands-trendyfood.json'
import qBrands from './foodbrands-brands.json'
import qCelebs from './popculture-celebrities.json'
import qMemes from './popculture-memes.json'
import qSports from './popculture-sports.json'
import qEsports from './popculture-esports.json'

export const allQuestionSubcategories: QuestionSubCategoryData[] = [
  qMovies,
  qMusic,
  qGames,
  qTV,
  qSchool,
  qRelationships,
  qSocialMedia,
  qDrama,
  qFastFood,
  qTrendyFood,
  qBrands,
  qCelebs,
  qMemes,
  qSports,
  qEsports,
] as QuestionSubCategoryData[]

export const questionCategoryGroups: CategoryGroup[] = [
  {
    id: 'entertainment',
    name: 'Entertainment',
    subcategories: [qMovies, qMusic, qGames, qTV] as QuestionSubCategoryData[],
  },
  {
    id: 'teen-life',
    name: 'Teen Life',
    subcategories: [qSchool, qRelationships, qSocialMedia, qDrama] as QuestionSubCategoryData[],
  },
  {
    id: 'food-brands',
    name: 'Food & Brands',
    subcategories: [qFastFood, qTrendyFood, qBrands] as QuestionSubCategoryData[],
  },
  {
    id: 'pop-culture-sports',
    name: 'Pop Culture & Sports',
    subcategories: [qCelebs, qMemes, qSports, qEsports] as QuestionSubCategoryData[],
  },
]
