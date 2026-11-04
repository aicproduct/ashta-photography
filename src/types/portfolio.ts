/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 
  | 'All'
  | 'Architecture'
  | 'Landscapes'
  | 'Street & Nocturne'
  | 'Editorial & Portraiture';

export type Page = 'home' | 'galleries' | 'series' | 'editions' | 'exhibitions' | 'about' | 'inquire' | 'studio';

export type LayoutMode = 'masonry' | 'editorial' | 'contact-sheet';

export interface ExifData {
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  filmSimulation?: string;
  metering?: string;
}

export interface Photograph {
  id: string;
  title: string;
  series: string;
  category: Exclude<Category, 'All'>;
  year: number;
  location: string;
  imageSrc: string;
  aspectRatio: '16:9' | '4:3' | '3:4' | '1:1';
  exif: ExifData;
  curatorStatement: string;
  architecturalStyle?: string;
  editionInfo: {
    total: number;
    available: number;
    startingPrice: number;
    archivalPaper: string;
  };
  featuredInHero?: boolean;
}

export interface SeriesStory {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  year: string;
  statement: string;
  coverImage: string;
  photoIds: string[];
  keyQuote: string;
}

export interface PrintConfig {
  photographId: string;
  size: '30x45cm' | '50x75cm' | '70x105cm';
  paperStock: 'Hahnemühle Photo Rag' | 'Canson Infinity Baryta' | 'Awagami Washi Kozo';
  frame: 'Unframed Archival Tube' | 'Matte Black Aluminum' | 'Natural Solid Walnut';
}
