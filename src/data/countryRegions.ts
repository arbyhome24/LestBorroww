import { ProvinceData, INDONESIA_PROVINCES } from './indonesiaRegions';
import { LanguageCode, CurrencyCode } from '../types';

export interface CountryRegionData {
  code: string;
  name: string;
  flag: string;
  language: LanguageCode;
  defaultCurrency: CurrencyCode;
  allCitiesLabel: string;
  searchPlaceholder: string;
  provinces: ProvinceData[];
}

export const COUNTRIES_DATA: CountryRegionData[] = [
  {
    code: 'ID',
    name: 'Indonesia',
    flag: '🇮🇩',
    language: 'id',
    defaultCurrency: 'IDR',
    allCitiesLabel: 'Semua Kota (Seluruh Indonesia)',
    searchPlaceholder: 'Cari dari 514 kota / kabupaten di Indonesia...',
    provinces: INDONESIA_PROVINCES,
  },
  {
    code: 'SG',
    name: 'Singapura',
    flag: '🇸🇬',
    language: 'en',
    defaultCurrency: 'SGD',
    allCitiesLabel: 'Semua Kota (Seluruh Singapura)',
    searchPlaceholder: 'Cari distrik di Singapura (Marina Bay, Orchard, Sentosa...)',
    provinces: [
      {
        id: 'SG_CENTRAL',
        name: 'DOWNTOWN CORE & CENTRAL',
        cities: [
          'Marina Bay',
          'Orchard Road',
          'Raffles Place',
          'Tanjong Pagar',
          'Bugis & Rochor',
        ],
      },
      {
        id: 'SG_EAST',
        name: 'EAST & ISLANDS',
        cities: [
          'Katong / Marine Parade',
          'Changi & Tampines',
          'Sentosa Island',
        ],
      },
      {
        id: 'SG_WEST',
        name: 'WEST & NORTH',
        cities: [
          'Jurong East',
          'Woodlands',
          'Bishan / Ang Mo Kio',
        ],
      },
    ],
  },
  {
    code: 'CN',
    name: 'Tiongkok',
    flag: '🇨🇳',
    language: 'zh',
    defaultCurrency: 'CNY',
    allCitiesLabel: 'Semua Kota (Seluruh Tiongkok)',
    searchPlaceholder: 'Cari kota di Tiongkok (Beijing, Shanghai, Shenzhen...)',
    provinces: [
      {
        id: 'CN_BJ',
        name: 'BEIJING',
        cities: [
          'Chaoyang (Sanlitun & CBD)',
          'Haidian (Tech District)',
          'Dongcheng (Forbidden City Area)',
          'Xicheng (Financial Street)',
        ],
      },
      {
        id: 'CN_SH',
        name: 'SHANGHAI',
        cities: [
          'Pudong New Area (Lujiazui)',
          'Huangpu (The Bund)',
          "Jing'an Luxury Quarter",
          'Xuhui / French Concession',
        ],
      },
      {
        id: 'CN_GD',
        name: 'GUANGDONG',
        cities: [
          'Guangzhou (Tianhe CBD)',
          'Shenzhen (Nanshan & Futian)',
        ],
      },
    ],
  },
  {
    code: 'JP',
    name: 'Jepang',
    flag: '🇯🇵',
    language: 'ja',
    defaultCurrency: 'JPY',
    allCitiesLabel: 'Semua Kota (Seluruh Jepang)',
    searchPlaceholder: 'Cari kota di Jepang (Tokyo, Osaka, Kyoto...)',
    provinces: [
      {
        id: 'JP_TYO',
        name: 'TOKYO METROPOLITAN',
        cities: [
          'Shibuya & Harajuku',
          'Shinjuku Central',
          'Ginza Luxury Promenade',
          'Roppongi & Minato-ku',
          'Akihabara & Chiyoda',
        ],
      },
      {
        id: 'JP_KNS',
        name: 'KANSAI REGION',
        cities: [
          'Osaka (Umeda & Kita)',
          'Osaka (Namba & Dotonbori)',
          'Kyoto (Gion & Higashiyama)',
          'Kyoto (Arashiyama)',
        ],
      },
      {
        id: 'JP_HKD',
        name: 'HOKKAIDO & RESORTS',
        cities: [
          'Sapporo City',
          'Niseko Luxury Ski Resort',
          'Otaru Canal District',
        ],
      },
    ],
  },
  {
    code: 'KR',
    name: 'Korea Selatan',
    flag: '🇰🇷',
    language: 'ko',
    defaultCurrency: 'KRW',
    allCitiesLabel: 'Semua Kota (Seluruh Korea Selatan)',
    searchPlaceholder: 'Cari kota di Korea Selatan (Seoul, Busan, Jeju...)',
    provinces: [
      {
        id: 'KR_SEL',
        name: 'SEOUL CAPITAL AREA',
        cities: [
          'Gangnam & Apgujeong',
          'Hongdae & Mapo-gu',
          'Itaewon & Hannam-dong',
          'Myeongdong & Jung-gu',
          'Seongsu-dong Hip District',
        ],
      },
      {
        id: 'KR_BSN',
        name: 'BUSAN',
        cities: [
          'Haeundae Beachfront',
          'Seomyeon Central',
          'Gwangalli Marina',
        ],
      },
      {
        id: 'KR_JEJU',
        name: 'JEJU SPECIAL ISLAND',
        cities: [
          'Jeju City Center',
          'Seogwipo Resort Area',
        ],
      },
    ],
  },
  {
    code: 'ES',
    name: 'Spanyol',
    flag: '🇪🇸',
    language: 'es',
    defaultCurrency: 'EUR',
    allCitiesLabel: 'Semua Kota (Seluruh Spanyol)',
    searchPlaceholder: 'Cari kota di Spanyol (Madrid, Barcelona, Ibiza...)',
    provinces: [
      {
        id: 'ES_MAD',
        name: 'MADRID COMUNIDAD',
        cities: [
          'Barrio de Salamanca (Milla de Oro)',
          'Centro & Puerta del Sol',
          'Chamberí & Almagro',
          'Retiro & Jerónimos',
        ],
      },
      {
        id: 'ES_BCN',
        name: 'CATALUNYA / BARCELONA',
        cities: [
          'Eixample & Passeig de Gràcia',
          'Gràcia Bohemian District',
          'Barri Gòtic (Gothic Quarter)',
          'Barceloneta Waterfront',
        ],
      },
      {
        id: 'ES_AND',
        name: 'ANDALUCÍA & BALEARES',
        cities: [
          'Sevilla (Santa Cruz & Triana)',
          'Marbella (Puerto Banús)',
          'Ibiza (Ibiza Town & Marina Botafoch)',
          'Valencia (Ciutat Vella)',
        ],
      },
    ],
  },
  {
    code: 'FR',
    name: 'Prancis',
    flag: '🇫🇷',
    language: 'fr',
    defaultCurrency: 'EUR',
    allCitiesLabel: 'Semua Kota (Seluruh Prancis)',
    searchPlaceholder: 'Cari kota di Prancis (Paris, Nice, Cannes...)',
    provinces: [
      {
        id: 'FR_PAR',
        name: 'PARIS ÎLE-DE-FRANCE',
        cities: [
          'Champs-Élysées & 8ème',
          'Le Marais (3ème & 4ème)',
          'Saint-Germain-des-Prés (6ème)',
          'Montmartre & 18ème',
          'Louvre & Tuileries (1er)',
        ],
      },
      {
        id: 'FR_CAZ',
        name: "CÔTE D'AZUR / FRENCH RIVIERA",
        cities: [
          'Nice (Promenade des Anglais)',
          'Cannes (La Croisette)',
          'Saint-Tropez Port & Pampelonne',
          'Monaco / Monte-Carlo',
        ],
      },
      {
        id: 'FR_REG',
        name: 'RHÔNE & NOUVELLE-AQUITAINE',
        cities: [
          "Lyon (Presqu'île & Vieux Lyon)",
          'Bordeaux (Chartrons & Triangle d’Or)',
        ],
      },
    ],
  },
  {
    code: 'DE',
    name: 'Jerman',
    flag: '🇩🇪',
    language: 'de',
    defaultCurrency: 'EUR',
    allCitiesLabel: 'Semua Kota (Seluruh Jerman)',
    searchPlaceholder: 'Cari kota di Jerman (Berlin, Munich, Frankfurt...)',
    provinces: [
      {
        id: 'DE_BER',
        name: 'BERLIN',
        cities: [
          'Berlin Mitte (Unter den Linden)',
          'Charlottenburg (Kurfürstendamm)',
          'Kreuzberg & Friedrichshain',
          'Prenzlauer Berg',
        ],
      },
      {
        id: 'DE_BAY',
        name: 'BAYERN / BAVARIA',
        cities: [
          'München Altstadt-Lehel (Maximilianstraße)',
          'München Schwabing & Bogenhausen',
          'München Maxvorstadt',
        ],
      },
      {
        id: 'DE_HMB',
        name: 'HAMBURG & HESSEN',
        cities: [
          'Frankfurt Innenstadt & Westend',
          'Hamburg HafenCity & Speicherstadt',
          'Hamburg Harvestehude (Außenalster)',
        ],
      },
    ],
  },
  {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    language: 'th',
    defaultCurrency: 'THB',
    allCitiesLabel: 'Semua Kota (Seluruh Thailand)',
    searchPlaceholder: 'Cari kota di Thailand (Bangkok, Phuket, Chiang Mai...)',
    provinces: [
      {
        id: 'TH_BKK',
        name: 'BANGKOK METROPOLIS',
        cities: [
          'Sukhumvit (Thonglor & Phrom Phong)',
          'Silom & Bang Rak',
          'Sathorn Embassy Quarter',
          'Siam & Pathum Wan',
        ],
      },
      {
        id: 'TH_HKT',
        name: 'PHUKET ISLAND',
        cities: [
          'Patong Beachfront',
          'Kata & Karon',
          'Kamala & Millionaires Mile',
          'Bang Tao / Laguna Phuket',
        ],
      },
      {
        id: 'TH_CNX',
        name: 'CHIANG MAI',
        cities: [
          'Old City (Mueang Chiang Mai)',
          'Nimman (Nimmanhaemin Road)',
          'Riverside / Wat Ket',
        ],
      },
    ],
  },
  {
    code: 'AE',
    name: 'Uni Emirat Arab',
    flag: '🇦🇪',
    language: 'ar',
    defaultCurrency: 'AED',
    allCitiesLabel: 'Semua Kota (Seluruh Uni Emirat Arab)',
    searchPlaceholder: 'Cari kota di UAE (Dubai, Abu Dhabi, Sharjah...)',
    provinces: [
      {
        id: 'AE_DXB',
        name: 'DUBAI EMIRATE',
        cities: [
          'Downtown Dubai (Burj Khalifa Area)',
          'Dubai Marina & JBR',
          'Palm Jumeirah Luxury Villas',
          'Business Bay & DIFC',
          'Emirates Hills & Arabian Ranches',
        ],
      },
      {
        id: 'AE_AUH',
        name: 'ABU DHABI EMIRATE',
        cities: [
          'Corniche Waterfront',
          'Al Maryah Island Financial Freezone',
          'Saadiyat Island Cultural District',
          'Yas Island Marina & Circuit',
        ],
      },
      {
        id: 'AE_SHJ',
        name: 'SHARJAH & NORTHERN EMIRATES',
        cities: [
          'Sharjah (Al Majaz Waterfront)',
          'Ajman Marina Promenade',
        ],
      },
    ],
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    language: 'hi',
    defaultCurrency: 'INR',
    allCitiesLabel: 'Semua Kota (Seluruh India)',
    searchPlaceholder: 'Cari kota di India (Mumbai, Delhi, Bangalore...)',
    provinces: [
      {
        id: 'IN_MUM',
        name: 'MUMBAI / MAHARASHTRA',
        cities: [
          'Bandra West & Bandra-Kurla Complex',
          'South Mumbai (Colaba & Marine Drive)',
          'Juhu Luxury Coastal Strip',
          'Andheri West / Lokhandwala',
        ],
      },
      {
        id: 'IN_DEL',
        name: 'NATIONAL CAPITAL REGION (NCR)',
        cities: [
          'South Delhi (Lutyens & Greater Kailash)',
          'Connaught Place Central',
          'Gurgaon (Cyber City & Golf Course Road)',
          'Hauz Khas & Saket',
        ],
      },
      {
        id: 'IN_BLR',
        name: 'BANGALORE & GOA',
        cities: [
          'Bangalore (Indiranagar & Koramangala)',
          'Bangalore (Whitefield Tech Hub)',
          'Goa (North Goa / Anjuna & Vagator)',
          'Goa (South Goa / Cavelossim Luxury Resorts)',
        ],
      },
    ],
  },
  {
    code: 'VN',
    name: 'Vietnam',
    flag: '🇻🇳',
    language: 'vi',
    defaultCurrency: 'VND',
    allCitiesLabel: 'Semua Kota (Seluruh Vietnam)',
    searchPlaceholder: 'Cari kota di Vietnam (Ho Chi Minh, Hanoi, Da Nang...)',
    provinces: [
      {
        id: 'VN_SGN',
        name: 'HO CHI MINH CITY (SAIGON)',
        cities: [
          'District 1 (Opera House & Dong Khoi)',
          'District 2 (Thao Dien Riverside)',
          'District 7 (Phu My Hung Clean City)',
          'District 3 (Colonial Mansions)',
        ],
      },
      {
        id: 'VN_HAN',
        name: 'HANOI CAPITAL',
        cities: [
          'Old Quarter & Hoan Kiem',
          'Tay Ho (West Lake Luxury Enclave)',
          'Ba Dinh Embassy Quarter',
        ],
      },
      {
        id: 'VN_DAD',
        name: 'DA NANG & QUANG NAM',
        cities: [
          'Da Nang (My Khe Beachfront)',
          'Hai Chau City Center',
          'Hoi An Ancient Heritage Town',
        ],
      },
    ],
  },
];
