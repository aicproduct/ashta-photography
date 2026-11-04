/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Photograph, SeriesStory } from '../types/portfolio';

export const PHOTOGRAPHS: Photograph[] = [
  {
    id: 'plate-01',
    title: 'Descent into the Inverted Pyramid: Chand Baori',
    series: 'Geometry of Devotion',
    category: 'Architecture',
    year: 2025,
    location: 'Abhaneri, Rajasthan, India',
    imageSrc: '/src/assets/images/hero_ashta_stepwell_1793263135807.jpg',
    aspectRatio: '16:9',
    featuredInHero: true,
    exif: {
      camera: 'Hasselblad H6D-100c',
      lens: 'Hasselblad HC 28mm f/4',
      focalLength: '28mm (21mm full-frame eq.)',
      aperture: 'f/11',
      shutterSpeed: '1/60s',
      iso: 'ISO 64',
      filmSimulation: 'Warm Sandstone Chiaroscuro',
      metering: 'Spot on mid-tone carved basalt'
    },
    curatorStatement: 'Thirteen levels and 3,500 narrow stone steps descending 20 meters into the earth. Photographed at 06:40 AM when low desert sunlight illuminates only the upper tetrahedral landings, casting the deep subterranean water pavilion into profound meditative shadow.',
    architecturalStyle: 'Subterranean Stepped Baori & Hindu-Jain Geometry',
    editionInfo: {
      total: 10,
      available: 3,
      startingPrice: 145000,
      archivalPaper: 'Hahnemühle German Etching 310gsm'
    }
  },
  {
    id: 'plate-02',
    title: 'Mists of the Manikarnika Ghats',
    series: 'Sacred Waters',
    category: 'Street & Nocturne',
    year: 2024,
    location: 'Varanasi, Uttar Pradesh, India',
    imageSrc: '/src/assets/images/gallery_varanasi_dawn_1793263137219.jpg',
    aspectRatio: '4:3',
    exif: {
      camera: 'Leica M10-R',
      lens: 'Leica Summicron-M 35mm f/2 ASPH',
      focalLength: '35mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/45s',
      iso: 'ISO 400',
      filmSimulation: 'Dawn Amber & River Twilight',
      metering: 'Center-weighted average'
    },
    curatorStatement: 'Dawn mist rising off the holy Ganges as night surrenders to amber morning. The solitary silhouette of a wooden rowboat anchors the eternal temple spires, capturing three millennia of continuous ritual silence and luminous water reflection.',
    architecturalStyle: 'Riparian Sacred Temple Ghats & Riverfront Pavilions',
    editionInfo: {
      total: 12,
      available: 4,
      startingPrice: 115000,
      archivalPaper: 'Canson Infinity Rag Photographique'
    }
  },
  {
    id: 'plate-03',
    title: 'Brise-Soleil at the High Court Colonnade',
    series: 'Tropical Modernism',
    category: 'Architecture',
    year: 2025,
    location: 'Chandigarh, Punjab, India',
    imageSrc: '/src/assets/images/gallery_chandigarh_concrete_1793263137251.jpg',
    aspectRatio: '4:3',
    exif: {
      camera: 'Hasselblad H6D-100c',
      lens: 'Hasselblad HC 50mm-II f/3.5',
      focalLength: '50mm (37mm full-frame eq.)',
      aperture: 'f/8.0',
      shutterSpeed: '1/160s',
      iso: 'ISO 100',
      filmSimulation: 'Raw Board-Formed Aggregate',
      metering: 'Multi-zone Matrix'
    },
    curatorStatement: 'Part of an ongoing photographic census of Le Corbusier and Pierre Jeanneret’s masterworks in the Punjab plains. The monumental rhythmic concrete fins deflect the brutal pre-monsoon glare, turning functional climate control into sculptural monumentalism.',
    architecturalStyle: 'Tropical Modernism & Brutalist Le Corbusier Concrete',
    editionInfo: {
      total: 8,
      available: 2,
      startingPrice: 155000,
      archivalPaper: 'Hahnemühle Photo Rag Baryta 315gsm'
    }
  },
  {
    id: 'plate-04',
    title: 'The Golden Zari: Master Weaver Ramzan Ali (76)',
    series: 'Craft of the Banaras Guilds',
    category: 'Editorial & Portraiture',
    year: 2024,
    location: 'Madanpura, Varanasi, India',
    imageSrc: '/src/assets/images/gallery_banaras_weaver_1793263138675.jpg',
    aspectRatio: '3:4',
    exif: {
      camera: 'Leica M10-R',
      lens: 'Leica Noctilux-M 50mm f/1.2 ASPH',
      focalLength: '50mm',
      aperture: 'f/1.4',
      shutterSpeed: '1/125s',
      iso: 'ISO 250',
      filmSimulation: 'Natural North-Light Chiaroscuro',
      metering: 'Spot on loom shuttle'
    },
    curatorStatement: 'Fifty-five years at the pit loom weaving pure mulberry silk and electroplated gold zari for traditional bridal heirlooms. The interplay of dusty north window light, worn wooden treadles, and glistening gold thread honors a lineage facing rapid industrial obsolescence.',
    architecturalStyle: 'Vernacular Heritage Silk Weaver Guild Workshop',
    editionInfo: {
      total: 15,
      available: 5,
      startingPrice: 95000,
      archivalPaper: 'Awagami Washi Kozo 110gsm'
    }
  },
  {
    id: 'plate-05',
    title: 'Latticework of the Desert Sun: Patwon Ki Haveli',
    series: 'Geometry of Devotion',
    category: 'Architecture',
    year: 2025,
    location: 'Jaisalmer, Thar Desert, India',
    imageSrc: '/src/assets/images/gallery_jaisalmer_jali_1793263138940.jpg',
    aspectRatio: '4:3',
    exif: {
      camera: 'Hasselblad H6D-100c',
      lens: 'Hasselblad HC 35mm f/3.5',
      focalLength: '35mm (26mm full-frame eq.)',
      aperture: 'f/9.0',
      shutterSpeed: '1/90s',
      iso: 'ISO 100',
      filmSimulation: 'Warm Golden Sandstone Ochre',
      metering: 'Shadow Highlight Balance'
    },
    curatorStatement: 'Carved from yellow Jurrasic sandstone in the heart of the Golden City. The geometric pierced jali screen filters high noon desert heat while projecting intricate lace shadows onto the polished lime-plaster floor, transforming passive cooling into mathematical poetry.',
    architecturalStyle: 'Rajput Haveli & Pierced Sandstone Jali Latticework',
    editionInfo: {
      total: 10,
      available: 4,
      startingPrice: 135000,
      archivalPaper: 'Hahnemühle German Etching 310gsm'
    }
  }
];

export const SERIES_STORIES: SeriesStory[] = [
  {
    id: 'series-stepwells',
    title: 'Geometry of Devotion',
    subtitle: 'The Subterranean Water Monuments of Western India',
    location: 'Rajasthan & Gujarat',
    year: '2023–2026',
    statement: 'A photographic treatise documenting medieval stepwells (baoris and vavs) across arid northwestern India. Far more than utilitarian water reservoirs, these multi-level subterranean sanctums are upside-down temples where architecture, gravity, and sacred hydrology converge.',
    coverImage: '/src/assets/images/hero_ashta_stepwell_1793263135807.jpg',
    photoIds: ['plate-01', 'plate-05'],
    keyQuote: 'In the desert, holiness is not directed upward toward the heavens; it descends twenty meters into cool stone silence.'
  },
  {
    id: 'series-waters',
    title: 'Sacred Waters',
    subtitle: 'Ritual Twilight along the Ancient Riverfronts',
    location: 'Varanasi, Haridwar & Ujjain',
    year: '2023–2025',
    statement: 'Long-exposure medium-format studies along the eternal river banks of the Gangetic plain. Exploring how architecture dissolves into fog, light, and ceremonial time over centuries of unbroken devotion.',
    coverImage: '/src/assets/images/gallery_varanasi_dawn_1793263137219.jpg',
    photoIds: ['plate-02'],
    keyQuote: 'The ghats are not a promenade; they are a granite threshold between the mortal city and the boundless river.'
  },
  {
    id: 'series-modernism',
    title: 'Tropical Modernism',
    subtitle: 'Raw Concrete & Sovereignty in Post-Independence India',
    location: 'Chandigarh, Ahmedabad & Delhi',
    year: '2024–2026',
    statement: 'A survey of Nehruvian modernist infrastructure by Le Corbusier, Louis Kahn, Balkrishna Doshi, and Charles Correa. How bold poured concrete forms adapted to equatorial sun through brise-soleil and deep courtyard microclimates.',
    coverImage: '/src/assets/images/gallery_chandigarh_concrete_1793263137251.jpg',
    photoIds: ['plate-03'],
    keyQuote: 'Concrete in the tropical sun is unforgiving, yet when carved with deep louvers, it breathes like living stone.'
  }
];

export const EXHIBITIONS = [
  {
    year: '2026',
    title: 'Sacred Subterranea: The Stepwells of Western India',
    venue: 'Victoria and Albert Museum (V&A), Photography Centre',
    city: 'London, United Kingdom',
    type: 'Solo Exhibition'
  },
  {
    year: '2025',
    title: 'Form & Freedom: Architecture in Post-Independence South Asia',
    venue: 'National Gallery of Modern Art (NGMA)',
    city: 'New Delhi, India',
    type: 'Curated Survey'
  },
  {
    year: '2025',
    title: 'Water & Stone: Indian Heritage Monograph',
    venue: 'Kiran Nadar Museum of Art (KNMA)',
    city: 'New Delhi, India',
    type: 'Special Retrospective'
  },
  {
    year: '2024',
    title: 'Hydraulic Monuments: Biennale Architettura',
    venue: 'Venice Architecture Biennale (Collateral Pavilions)',
    city: 'Venice, Italy',
    type: 'Invitational Exhibition'
  }
];

export const GEAR_DOSSIER = [
  {
    category: 'Medium Format Sensor',
    item: 'Hasselblad H6D-100c & X2D 100C',
    rationale: '100-megapixel medium format digital back capable of capturing micro-textures in aged sandstone, intricate jali shadow gradations, and deep subterranean shadow details without dynamic range clipping.'
  },
  {
    category: 'Heritage Documentary Field Camera',
    item: 'Leica M10-R (Silver Chrome)',
    rationale: 'Silent mechanical shutter and compact rangefinder profile for quiet, respectful observation inside active temple ghats and private artisan weaving workshops in Varanasi.'
  },
  {
    category: 'Architectural Optics',
    item: 'Hasselblad HC 28mm f/4 & HC 50mm-II f/3.5',
    rationale: 'Exceptional optical flatness and edge-to-edge resolving power across wide architectural fields, eliminating keystoning and geometric barrel distortion.'
  },
  {
    category: 'Museum Inkjet Substrates',
    item: 'Hahnemühle German Etching 310gsm & Awagami Washi',
    rationale: 'Heavy mould-made archival rag paper with a velvety, tactile surface that reproduces the warm golden ochre and mineral tones of Rajasthani sandstone with museum longevity.'
  }
];
