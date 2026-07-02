import type { CategoryGroup, SubCategoryData } from '@/lib/types'

import entMovies from './entertainment-movies.json'
import entMusic from './entertainment-music.json'
import entGames from './entertainment-videogames.json'
import entTV from './entertainment-tv.json'
import tlSchool from './teenlife-school.json'
import tlRelationships from './teenlife-relationships.json'
import tlSocialMedia from './teenlife-socialmedia.json'
import tlDrama from './teenlife-drama.json'
import fbFastFood from './foodbrands-fastfood.json'
import fbTrendyFood from './foodbrands-trendyfood.json'
import fbBrands from './foodbrands-brands.json'
import pcCelebs from './popculture-celebrities.json'
import pcMemes from './popculture-memes.json'
import pcSports from './popculture-sports.json'
import pcEsports from './popculture-esports.json'

export const allSubcategories: SubCategoryData[] = [
  entMovies,
  entMusic,
  entGames,
  entTV,
  tlSchool,
  tlRelationships,
  tlSocialMedia,
  tlDrama,
  fbFastFood,
  fbTrendyFood,
  fbBrands,
  pcCelebs,
  pcMemes,
  pcSports,
  pcEsports,
] as SubCategoryData[]

export const categoryGroups: CategoryGroup[] = [
  {
    id: 'entertainment',
    name: 'Entertainment',
    subcategories: [entMovies, entMusic, entGames, entTV] as SubCategoryData[],
  },
  {
    id: 'teen-life',
    name: 'Teen Life',
    subcategories: [tlSchool, tlRelationships, tlSocialMedia, tlDrama] as SubCategoryData[],
  },
  {
    id: 'food-brands',
    name: 'Food & Brands',
    subcategories: [fbFastFood, fbTrendyFood, fbBrands] as SubCategoryData[],
  },
  {
    id: 'pop-culture-sports',
    name: 'Pop Culture & Sports',
    subcategories: [pcCelebs, pcMemes, pcSports, pcEsports] as SubCategoryData[],
  },
]

export const defaultSelectedSubcategories = allSubcategories.map(s => s.id)
