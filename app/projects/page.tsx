'use client';

import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectDetail from '@/components/ProjectDetail';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type MediaItem = {
  id: number;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
};

type Project = {
  id: number;
  firestoreId?: string;
  name: string;
  location: string;
  price: string;
  category: string;
  isExclusive: boolean;
  image: string;
  heroImage: string;
  status: string;
  launchYear: string;
  developer: string;
  reraNumber: string;
  overview: string;
  details: { label: string; value: string }[];
  amenitiesImage: string;
  amenitiesCaption: string;
  locationHighlights: string[];
  configurations: string[];
  amenities: string[];
  mediaGallery?: MediaItem[];
};

// Complete project data including all projects from the dropdown
const projects: Project[] = [
  {
    id: 1,
    name: 'Vaastu Homes',
    location: 'Siddharth Vihar, Ghaziabad',
    price: 'Price on Request',
    category: 'Residential',
    isExclusive: true,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop',
    status: 'Inventory Available',
    launchYear: '2024',
    developer: 'Vaastu Builders',
    reraNumber: 'UPRERAPRJ123456/2024',
    overview: 'An exclusive luxury residence is currently available in Vaastu Homes, Siddharth Vihar, Ghaziabad. Positioned within one of the city\'s most prestigious residential developments, this premium inventory offers elevated views, enhanced privacy, exceptional natural light and access to world-class amenities.',
    details: [
      { label: 'Inventory Type', value: 'Exclusive Available Residence' },
      { label: 'Project', value: 'Vaastu Homes' },
      { label: 'Developer', value: 'Vaastu Builders' },
      { label: 'Location', value: 'Siddharth Vihar, Ghaziabad' },
      { label: 'Project Land Area', value: 'Approx. 5 Acres' },
      { label: 'Total Towers', value: '3 Towers' },
      { label: 'Total Residences', value: '250 Residences' },
      { label: 'RERA Number', value: 'UPRERAPRJ123456/2024' },
      { label: 'Status', value: 'Inventory Available' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop', caption: 'Vaastu Homes Exterior' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1600&auto=format&fit=crop', caption: 'Swimming Pool' },
      { id: 3, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Project Tour' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Swimming Pool at Vaastu Homes',
    locationHighlights: [
      'Vaishali Metro Station - 2 KM',
      'Ghaziabad Railway Station - 5 KM',
      'Delhi-Meerut Expressway - 3 KM',
      'Major Schools & Hospitals nearby',
    ],
    configurations: ['2 BHK', '3 BHK', '4 BHK'],
    amenities: ['Clubhouse & lounge', 'Swimming pool', 'Landscaped gardens', 'Modern gym', 'Indoor games', 'Kids play area', '24x7 security', 'Power back-up'],
  },
  {
    id: 2,
    name: 'Godrej Nest',
    location: 'Sector 150, Noida',
    price: '₹1.2 Cr onwards',
    category: 'Residential',
    isExclusive: true,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2000&auto=format&fit=crop',
    status: 'Under Construction',
    launchYear: '2023',
    developer: 'Godrej Properties',
    reraNumber: 'UPRERAPRJ789012/2023',
    overview: 'Godrej Nest in Sector 150 Noida offers premium residential apartments with modern amenities and green surroundings. Perfect for families looking for a serene living experience close to nature.',
    details: [
      { label: 'Inventory Type', value: 'Premium Residences' },
      { label: 'Project', value: 'Godrej Nest' },
      { label: 'Developer', value: 'Godrej Properties' },
      { label: 'Location', value: 'Sector 150, Noida' },
      { label: 'Project Land Area', value: 'Approx. 10 Acres' },
      { label: 'Total Towers', value: '5 Towers' },
      { label: 'Total Residences', value: '400 Residences' },
      { label: 'RERA Number', value: 'UPRERAPRJ789012/2023' },
      { label: 'Status', value: 'Under Construction' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2000&auto=format&fit=crop', caption: 'Godrej Nest Exterior' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1600&auto=format&fit=crop', caption: 'Clubhouse' },
      { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop', caption: 'Garden Area' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Clubhouse at Godrej Nest',
    locationHighlights: [
      'Noida Sector 148 Metro Station - 2.5 KM',
      'Yamuna Expressway - 1 KM',
      'FNG Expressway - 3 KM',
      'World-class schools nearby',
    ],
    configurations: ['2 BHK', '3 BHK', '4 BHK'],
    amenities: ['Clubhouse & lounge', 'Swimming pool', 'Landscaped gardens', 'Modern gym', 'Indoor games', 'Kids play area', '24x7 security', 'Power back-up'],
  },
  {
    id: 3,
    name: 'Godrej Riverine - Tower 1',
    location: 'Sector 44 Noida',
    price: 'Price On Request',
    category: 'Luxury Residential',
    isExclusive: true,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
    status: 'Inventory Available',
    launchYear: '2024',
    developer: 'Godrej Properties',
    reraNumber: 'UPRERAPRJ763929/11/2024',
    overview: 'An exclusive luxury residence is currently available on the 11th Floor of Tower 1 at Godrej Riverine, Sector 44 Noida. Positioned within one of the city\'s most prestigious residential developments, this premium inventory offers elevated views, enhanced privacy, exceptional natural light and access to world-class amenities.',
    details: [
      { label: 'Inventory Type', value: 'Exclusive Available Residence' },
      { label: 'Project', value: 'Godrej Riverine' },
      { label: 'Developer', value: 'Godrej Properties' },
      { label: 'Location', value: 'Sector 44, Noida' },
      { label: 'Tower', value: 'Tower 1' },
      { label: 'Floor', value: '11th Floor' },
      { label: 'Inventory Area', value: '2616 Sq. ft.' },
      { label: 'Project Land Area', value: 'Approx. 6.5 Acres' },
      { label: 'Total Towers', value: '4 Towers' },
      { label: 'Total Residences', value: '416 Residences' },
      { label: 'Clubhouse', value: 'Club Atlantis - 45,000 Sq. Ft.' },
      { label: 'RERA Number', value: 'UPRERAPRJ763929/11/2024' },
      { label: 'Status', value: 'Inventory Available' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop', caption: 'Godrej Riverine Tower' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1600&auto=format&fit=crop', caption: 'Badminton Court' },
      { id: 3, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Luxury Amenities Tour' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Badminton Court at Godrej Riverine Sector 44 Noida',
    locationHighlights: [
      'Botanical Garden Metro Station - 1.4 KM',
      'Noida Golf Course - 1.5 KM',
      'DND Flyway - 1.9 KM',
      'Sector 18 Market - 3.3 KM',
      'Amity University - 3.6 KM',
    ],
    configurations: ['3 BHK', '4 BHK', '5 BHK', '6 BHK'],
    amenities: ['Clubhouse & lounge', 'Swimming pool', 'Landscaped gardens', 'Modern gym', 'Indoor games', 'Kids play area', '24x7 security', 'Power back-up', 'Badminton court', 'Tennis court', 'Spa & wellness'],
  },
  {
    id: 4,
    name: 'Jacob & Co',
    location: 'Sector 97, Noida',
    price: '₹7.70 Cr onwards',
    category: 'Residential',
    isExclusive: true,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2000&auto=format&fit=crop',
    status: 'Ready to Move',
    launchYear: '2022',
    developer: 'Jacob & Co Realty',
    reraNumber: 'UPRERAPRJ345678/2022',
    overview: 'Jacob & Co in Sector 97 Noida offers ultra-luxury residences with world-class amenities and prime location. Perfect for those seeking the epitome of luxury living in Noida.',
    details: [
      { label: 'Inventory Type', value: 'Ultra-Luxury Residences' },
      { label: 'Project', value: 'Jacob & Co' },
      { label: 'Developer', value: 'Jacob & Co Realty' },
      { label: 'Location', value: 'Sector 97, Noida' },
      { label: 'Project Land Area', value: 'Approx. 12 Acres' },
      { label: 'Total Towers', value: '2 Towers' },
      { label: 'Total Residences', value: '150 Residences' },
      { label: 'RERA Number', value: 'UPRERAPRJ345678/2022' },
      { label: 'Status', value: 'Ready to Move' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2000&auto=format&fit=crop', caption: 'Jacob & Co Exterior' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop', caption: 'Luxury Spa' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Luxury Spa at Jacob & Co',
    locationHighlights: [
      'Noida Sector 101 Metro Station - 1.8 KM',
      'Delhi-Meerut Expressway - 2.5 KM',
      'FNG Expressway - 4 KM',
      'Premium malls nearby',
    ],
    configurations: ['4 BHK', '5 BHK', '6 BHK', '7 BHK'],
    amenities: ['Clubhouse & lounge', 'Swimming pool', 'Landscaped gardens', 'Modern gym', 'Indoor games', 'Kids play area', '24x7 security', 'Power back-up', 'Spa & wellness', 'Private theatre', 'Rooftop restaurant'],
  },
  {
    id: 5,
    name: 'M3M Trump',
    location: 'Sector 65, Gurgaon',
    price: '₹5 Cr onwards',
    category: 'Luxury Residential',
    isExclusive: false,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
    status: 'Ready to Move',
    launchYear: '2021',
    developer: 'M3M India',
    reraNumber: 'HRERAPRJ123456/2021',
    overview: 'M3M Trump in Sector 65 Gurgaon offers ultra-luxury residences with world-class amenities and iconic architecture. A statement of luxury living in the heart of Gurgaon.',
    details: [
      { label: 'Inventory Type', value: 'Ultra-Luxury Residences' },
      { label: 'Project', value: 'M3M Trump' },
      { label: 'Developer', value: 'M3M India' },
      { label: 'Location', value: 'Sector 65, Gurgaon' },
      { label: 'Project Land Area', value: 'Approx. 15 Acres' },
      { label: 'Total Towers', value: '3 Towers' },
      { label: 'Total Residences', value: '200 Residences' },
      { label: 'RERA Number', value: 'HRERAPRJ123456/2021' },
      { label: 'Status', value: 'Ready to Move' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop', caption: 'M3M Trump Tower' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1600&auto=format&fit=crop', caption: 'Infinity Pool' },
      { id: 3, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Iconic Architecture' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Infinity Pool at M3M Trump',
    locationHighlights: [
      'Gurgaon Golf Course Road - 1 KM',
      'Cyber City - 5 KM',
      'MG Road - 6 KM',
      'International Airport - 15 KM',
    ],
    configurations: ['3 BHK', '4 BHK', '5 BHK'],
    amenities: ['Clubhouse & lounge', 'Infinity pool', 'Sky gardens', 'Modern gym', 'Yoga & meditation room', 'Kids play area', '24x7 security', 'Power back-up', 'Spa & wellness', 'Fine dining restaurant', 'Concierge service'],
  },
  {
    id: 6,
    name: 'M3M The Line',
    location: 'Sector 72, Gurgaon',
    price: '₹2.5 Cr onwards',
    category: 'Residential',
    isExclusive: false,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop',
    status: 'Under Construction',
    launchYear: '2023',
    developer: 'M3M India',
    reraNumber: 'HRERAPRJ789012/2023',
    overview: 'M3M The Line in Sector 72 Gurgaon offers modern residential apartments with contemporary design and premium amenities. Perfect for the urban lifestyle.',
    details: [
      { label: 'Inventory Type', value: 'Premium Residences' },
      { label: 'Project', value: 'M3M The Line' },
      { label: 'Developer', value: 'M3M India' },
      { label: 'Location', value: 'Sector 72, Gurgaon' },
      { label: 'Project Land Area', value: 'Approx. 8 Acres' },
      { label: 'Total Towers', value: '4 Towers' },
      { label: 'Total Residences', value: '350 Residences' },
      { label: 'RERA Number', value: 'HRERAPRJ789012/2023' },
      { label: 'Status', value: 'Under Construction' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop', caption: 'M3M The Line Exterior' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?q=80&w=1600&auto=format&fit=crop', caption: 'Fitness Center' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Fitness Center at M3M The Line',
    locationHighlights: [
      'Sohna Road - 2 KM',
      'NH8 - 4 KM',
      'Medanta Hospital - 5 KM',
      'Good schools nearby',
    ],
    configurations: ['2 BHK', '3 BHK', '4 BHK'],
    amenities: ['Clubhouse & lounge', 'Swimming pool', 'Landscaped gardens', 'Modern gym', 'Indoor games', 'Kids play area', '24x7 security', 'Power back-up', 'Jogging track'],
  },
  {
    id: 7,
    name: 'Grandthum By Group 108',
    location: 'Noida Extension',
    price: '₹85 Lakhs onwards',
    category: 'Residential',
    isExclusive: false,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2000&auto=format&fit=crop',
    status: 'Under Construction',
    launchYear: '2023',
    developer: 'Group 108',
    reraNumber: 'UPRERAPRJ345678/2023',
    overview: 'Grandthum By Group 108 in Noida Extension offers affordable luxury apartments with modern amenities. Perfect for first-time buyers and investors.',
    details: [
      { label: 'Inventory Type', value: 'Affordable Luxury' },
      { label: 'Project', value: 'Grandthum By Group 108' },
      { label: 'Developer', value: 'Group 108' },
      { label: 'Location', value: 'Noida Extension' },
      { label: 'Project Land Area', value: 'Approx. 12 Acres' },
      { label: 'Total Towers', value: '6 Towers' },
      { label: 'Total Residences', value: '600 Residences' },
      { label: 'RERA Number', value: 'UPRERAPRJ345678/2023' },
      { label: 'Status', value: 'Under Construction' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2000&auto=format&fit=crop', caption: 'Grandthum Exterior' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop', caption: 'Children Play Area' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Children Play Area at Grandthum',
    locationHighlights: [
      'Noida Extension Metro - 3 KM',
      'FNG Expressway - 2 KM',
      'Schools & Hospitals nearby',
      'Shopping malls in vicinity',
    ],
    configurations: ['1 BHK', '2 BHK', '3 BHK'],
    amenities: ['Clubhouse & lounge', 'Swimming pool', 'Kids play area', 'Modern gym', 'Jogging track', '24x7 security', 'Power back-up'],
  },
  {
    id: 8,
    name: 'GYGY FIVEO',
    location: 'Sector 129, Noida',
    price: '₹1.8 Cr onwards',
    category: 'Residential',
    isExclusive: false,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
    status: 'Ready to Move',
    launchYear: '2022',
    developer: 'GYGY Infra',
    reraNumber: 'UPRERAPRJ901234/2022',
    overview: 'GYGY FIVEO in Sector 129 Noida offers premium residential apartments with modern design and excellent connectivity. A perfect blend of luxury and convenience.',
    details: [
      { label: 'Inventory Type', value: 'Premium Residences' },
      { label: 'Project', value: 'GYGY FIVEO' },
      { label: 'Developer', value: 'GYGY Infra' },
      { label: 'Location', value: 'Sector 129, Noida' },
      { label: 'Project Land Area', value: 'Approx. 9 Acres' },
      { label: 'Total Towers', value: '5 Towers' },
      { label: 'Total Residences', value: '450 Residences' },
      { label: 'RERA Number', value: 'UPRERAPRJ901234/2022' },
      { label: 'Status', value: 'Ready to Move' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop', caption: 'GYGY FIVEO Exterior' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1600&auto=format&fit=crop', caption: 'Landscaped Gardens' },
      { id: 3, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Premium Living Experience' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Landscaped Gardens at GYGY FIVEO',
    locationHighlights: [
      'Noida Expressway - 1.5 KM',
      'Yamuna Expressway - 2 KM',
      'FNG Expressway - 3 KM',
      'World-class schools nearby',
    ],
    configurations: ['2 BHK', '3 BHK', '4 BHK'],
    amenities: ['Clubhouse & lounge', 'Swimming pool', 'Landscaped gardens', 'Modern gym', 'Indoor games', 'Kids play area', '24x7 security', 'Power back-up', 'Tennis court'],
  },
  {
    id: 9,
    name: 'Bhutani City Center-32',
    location: 'Sector 32, Noida',
    price: '₹50 Lakhs onwards',
    category: 'Commercial',
    isExclusive: false,
    image: 'https://images.unsplash.com/photo-1464938050520-ef2571c36120?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1464938050520-ef2571c36120?q=80&w=2000&auto=format&fit=crop',
    status: 'Ready to Move',
    launchYear: '2021',
    developer: 'Bhutani Infra',
    reraNumber: 'UPRERAPRJ567890/2021',
    overview: 'Bhutani City Center-32 in Sector 32 Noida offers premium commercial spaces with excellent visibility and connectivity. Perfect for businesses and investors.',
    details: [
      { label: 'Inventory Type', value: 'Commercial Spaces' },
      { label: 'Project', value: 'Bhutani City Center-32' },
      { label: 'Developer', value: 'Bhutani Infra' },
      { label: 'Location', value: 'Sector 32, Noida' },
      { label: 'Project Land Area', value: 'Approx. 5 Acres' },
      { label: 'Total Towers', value: '2 Towers' },
      { label: 'RERA Number', value: 'UPRERAPRJ567890/2021' },
      { label: 'Status', value: 'Ready to Move' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1464938050520-ef2571c36120?q=80&w=2000&auto=format&fit=crop', caption: 'Bhutani City Center Exterior' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop', caption: 'Business Center' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Business Center at Bhutani City Center-32',
    locationHighlights: [
      'Noida Sector 34 Metro - 1 KM',
      'Sector 18 Market - 2 KM',
      'GIP Mall - 2.5 KM',
      'Excellent connectivity',
    ],
    configurations: ['Retail Shops', 'Office Spaces', 'Food Court'],
    amenities: ['Business center', 'High-speed elevators', '24x7 security', 'Power back-up', 'Parking facility', 'Food court', 'Retail arcade'],
  },
  {
    id: 10,
    name: 'Dasnac ARC',
    location: 'Sector 75, Noida',
    price: '₹1.5 Cr onwards',
    category: 'Residential',
    isExclusive: false,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop',
    status: 'Under Construction',
    launchYear: '2024',
    developer: 'Dasnac Infra',
    reraNumber: 'UPRERAPRJ123789/2024',
    overview: 'Dasnac ARC in Sector 75 Noida offers modern residential apartments with premium amenities and contemporary design. Perfect for families.',
    details: [
      { label: 'Inventory Type', value: 'Premium Residences' },
      { label: 'Project', value: 'Dasnac ARC' },
      { label: 'Developer', value: 'Dasnac Infra' },
      { label: 'Location', value: 'Sector 75, Noida' },
      { label: 'Project Land Area', value: 'Approx. 7 Acres' },
      { label: 'Total Towers', value: '3 Towers' },
      { label: 'Total Residences', value: '300 Residences' },
      { label: 'RERA Number', value: 'UPRERAPRJ123789/2024' },
      { label: 'Status', value: 'Under Construction' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop', caption: 'Dasnac ARC Exterior' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1600&auto=format&fit=crop', caption: 'Swimming Pool' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Swimming Pool at Dasnac ARC',
    locationHighlights: [
      'Noida Sector 76 Metro - 1 KM',
      'Noida Expressway - 2 KM',
      'Schools & Hospitals nearby',
      'Shopping malls in vicinity',
    ],
    configurations: ['2 BHK', '3 BHK', '4 BHK'],
    amenities: ['Clubhouse & lounge', 'Swimming pool', 'Modern gym', 'Indoor games', 'Kids play area', '24x7 security', 'Power back-up', 'Landscaped gardens'],
  },
  {
    id: 11,
    name: 'Dasnac Yuva',
    location: 'Sector 12, Noida',
    price: '₹65 Lakhs onwards',
    category: 'Residential',
    isExclusive: false,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
    status: 'Ready to Move',
    launchYear: '2022',
    developer: 'Dasnac Infra',
    reraNumber: 'UPRERAPRJ456123/2022',
    overview: 'Dasnac Yuva in Sector 12 Noida offers affordable residential apartments perfect for young professionals and small families. Great location and amenities.',
    details: [
      { label: 'Inventory Type', value: 'Affordable Residences' },
      { label: 'Project', value: 'Dasnac Yuva' },
      { label: 'Developer', value: 'Dasnac Infra' },
      { label: 'Location', value: 'Sector 12, Noida' },
      { label: 'Project Land Area', value: 'Approx. 5 Acres' },
      { label: 'Total Towers', value: '2 Towers' },
      { label: 'Total Residences', value: '250 Residences' },
      { label: 'RERA Number', value: 'UPRERAPRJ456123/2022' },
      { label: 'Status', value: 'Ready to Move' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop', caption: 'Dasnac Yuva Exterior' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop', caption: 'Community Hall' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Community Hall at Dasnac Yuva',
    locationHighlights: [
      'Noida Sector 15 Metro - 1.5 KM',
      'Delhi Border - 3 KM',
      'Schools & Markets nearby',
      'Excellent connectivity to Delhi',
    ],
    configurations: ['1 BHK', '2 BHK'],
    amenities: ['Community hall', 'Modern gym', 'Kids play area', '24x7 security', 'Power back-up', 'Landscaped gardens'],
  },
  {
    id: 12,
    name: 'Sikka Mall of Noida',
    location: 'Sector 98, Noida',
    price: '₹30 Lakhs onwards',
    category: 'Commercial',
    isExclusive: false,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop',
    status: 'Ready to Move',
    launchYear: '2021',
    developer: 'Sikka Group',
    reraNumber: 'UPRERAPRJ789456/2021',
    overview: 'Sikka Mall of Noida in Sector 98 Noida offers premium retail and commercial spaces with high footfall potential. An excellent investment opportunity.',
    details: [
      { label: 'Inventory Type', value: 'Retail & Commercial' },
      { label: 'Project', value: 'Sikka Mall of Noida' },
      { label: 'Developer', value: 'Sikka Group' },
      { label: 'Location', value: 'Sector 98, Noida' },
      { label: 'Project Land Area', value: 'Approx. 8 Acres' },
      { label: 'RERA Number', value: 'UPRERAPRJ789456/2021' },
      { label: 'Status', value: 'Ready to Move' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop', caption: 'Sikka Mall Exterior' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1600&auto=format&fit=crop', caption: 'Shopping Area' },
      { id: 3, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Retail Space Tour' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Shopping Area at Sikka Mall of Noida',
    locationHighlights: [
      'Noida Expressway - 1 KM',
      'Sector 101 Metro - 1.5 KM',
      'High residential catchment',
      'Excellent visibility',
    ],
    configurations: ['Retail Shops', 'Multiplex', 'Food Court', 'Office Spaces'],
    amenities: ['Multiplex cinema', 'Food court', 'Retail arcade', 'High-speed elevators', '24x7 security', 'Power back-up', 'Ample parking'],
  },
  {
    id: 13,
    name: 'Purvanchal Plots',
    location: 'Yamuna Expressway, Greater Noida',
    price: '₹25 Lakhs onwards',
    category: 'Plots',
    isExclusive: false,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop',
    status: 'Ready to Register',
    launchYear: '2020',
    developer: 'Purvanchal Developers',
    reraNumber: 'UPRERAPRJ321654/2020',
    overview: 'Purvanchal Plots on Yamuna Expressway offers residential and commercial plots in a well-planned township. An excellent investment opportunity with great potential.',
    details: [
      { label: 'Inventory Type', value: 'Residential & Commercial Plots' },
      { label: 'Project', value: 'Purvanchal Plots' },
      { label: 'Developer', value: 'Purvanchal Developers' },
      { label: 'Location', value: 'Yamuna Expressway, Greater Noida' },
      { label: 'Project Land Area', value: 'Approx. 50 Acres' },
      { label: 'RERA Number', value: 'UPRERAPRJ321654/2020' },
      { label: 'Status', value: 'Ready to Register' },
    ],
    mediaGallery: [
      { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop', caption: 'Purvanchal Plots Site' },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1600&auto=format&fit=crop', caption: 'Landscaped Area' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Landscaped Area at Purvanchal Plots',
    locationHighlights: [
      'Yamuna Expressway - 0 KM',
      'Jewar Airport - 15 KM',
      'F1 Track - 10 KM',
      'Great connectivity to Delhi',
    ],
    configurations: ['Residential Plots (100-500 sq yd)', 'Commercial Plots (200-1000 sq yd)'],
    amenities: ['Gated community', '24x7 security', 'Water supply', 'Electricity connection', 'Drainage system', 'Paved roads', 'Landscaped parks'],
  },
];

const categories = ['All', 'Residential', 'Commercial', 'Plots', 'Luxury Residential'];

// ── Helper: map a Firestore doc to the Project shape ─────────────────────────
function firestoreDocToProject(docId: string, data: Record<string, any>, startId: number): Project {
  const photos: string[] = data.photos || [];
  const image = data.image || data.imageUrl || data.heroImage || photos[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop';
  const heroImage = data.heroImage || data.imageUrl || photos[0] || image;

  // Build price string
  let price = 'Price on Request';
  if (data.expectedPrice && Number(data.expectedPrice) > 0) {
    const amt = Number(data.expectedPrice);
    const formatted = amt >= 10000000
      ? `₹${(amt / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr onwards`
      : amt >= 100000
        ? `₹${(amt / 100000).toFixed(2).replace(/\.?0+$/, '')} Lac onwards`
        : `₹${amt.toLocaleString('en-IN')} onwards`;
    price = formatted;
  } else if (data.price) {
    price = data.price;
  }

  // Determine category
  const cat = data.propertyCategory === 'Commercial' ? 'Commercial'
    : data.propertyType?.toLowerCase().includes('plot') ? 'Plots'
    : data.category || 'Residential';

  return {
    id: startId,
    firestoreId: docId,
    name: data.projectName || data.name || `${data.propertyType || 'Property'} in ${data.locality || data.city || 'NCR'}`,
    location: data.projectLocation || data.location || `${data.locality || ''}, ${data.city || 'NCR'}`.replace(/^, |, $/, ''),
    price,
    category: cat,
    isExclusive: false,
    image,
    heroImage,
    status: data.availability || data.status || 'Ready to Move',
    launchYear: data.launchYear || new Date().getFullYear().toString(),
    developer: data.developer || data.developerName || '',
    reraNumber: data.reraNumber || '',
    overview: data.overview || `A ${data.propertyType || 'property'} in ${data.city || 'NCR'}.`,
    details: data.details?.length ? data.details : [
      { label: 'Inventory Type', value: data.inventoryType || data.propertyType || '' },
      { label: 'Project', value: data.projectName || '' },
      { label: 'Developer', value: data.developer || '' },
      { label: 'Location', value: data.projectLocation || data.location || '' },
      { label: 'Project Land Area', value: data.landArea || '' },
      { label: 'Total Towers', value: data.totalTowers || '' },
      { label: 'Total Residences', value: data.totalResidences || '' },
      { label: 'RERA Number', value: data.reraNumber || '' },
      { label: 'Status', value: data.availability || data.status || '' },
    ].filter(d => d.value),
    amenitiesImage: photos[photos.length - 1] || heroImage,
    amenitiesCaption: 'Property Amenities',
    locationHighlights: data.connectivityHighlights || data.locationHighlights || [],
    configurations: Array.isArray(data.configurations) ? data.configurations : (data.bedrooms ? [`${data.bedrooms} BHK`] : []),
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    mediaGallery: data.mediaGallery?.length ? data.mediaGallery : photos.map((url: string, i: number) => ({
      id: i + 1, type: 'image' as const, url, caption: `Photo ${i + 1}`,
    })),
  };
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <svg className="animate-spin w-10 h-10" viewBox="0 0 24 24" fill="none" style={{ color: '#1a2744' }}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [firestoreProjects, setFirestoreProjects] = useState<Project[]>([]);
  const [loadingFirestore, setLoadingFirestore] = useState(true);

  // Fetch from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetched: Project[] = snapshot.docs.map((doc, i) =>
          firestoreDocToProject(doc.id, doc.data() as Record<string, any>, 10000 + i)
        );
        setFirestoreProjects(fetched);
      } catch (err) {
        console.error('Failed to fetch from Firestore:', err);
      } finally {
        setLoadingFirestore(false);
      }
    };
    fetchProjects();
  }, []);

  // Merge: Firestore projects first, then hardcoded
  const allProjects = [...firestoreProjects, ...projects];

  // Apply search filters from URL params
  useEffect(() => {
    const urlCategory = searchParams.get('type');
    if (urlCategory) {
      if (categories.includes(urlCategory)) {
        setSelectedCategory(urlCategory);
      } else if (urlCategory.toLowerCase().includes('residential')) {
        setSelectedCategory('Residential');
      } else if (urlCategory.toLowerCase().includes('commercial')) {
        setSelectedCategory('Commercial');
      }
    }
  }, [searchParams]);

  // Filter projects based on selected category and search params
  const filteredProjects = allProjects.filter(project => {
    // Category filter
    if (selectedCategory !== 'All' && project.category !== selectedCategory) {
      return false;
    }

    // Search query (q param) - search in name, location, developer
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        project.name.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        project.developer.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Location filter
    const locationParam = searchParams.get('location');
    if (locationParam) {
      if (!project.location.toLowerCase().includes(locationParam.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 relative overflow-hidden" style={{ backgroundColor: '#1a2744' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: '#243156' }}></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#243156' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-[#C4A35A] text-[10px] sm:text-xs uppercase tracking-widest mb-1.5 md:mb-2">OUR PORTFOLIO</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl md:text-5xl font-bold text-white mb-2 md:mb-3">
            Premium Real Estate Projects
          </h1>
          <p className="text-slate-200 max-w-2xl text-sm md:text-base">
            Explore our curated selection of RERA-approved residential, commercial, and plot projects across Delhi NCR.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="w-full py-12 md:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="flex items-center gap-1.5 md:gap-2 mb-8 md:mb-12 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-2 md:px-5 md:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
                style={selectedCategory === category ? { backgroundColor: '#1a2744' } : {}}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
            {loadingFirestore && firestoreProjects.length === 0 && (
              <div className="col-span-full flex justify-center items-center py-12">
                <svg className="animate-spin w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none" style={{ color: '#1a2744' }}>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-slate-500 text-sm">Loading projects...</span>
              </div>
            )}
            {filteredProjects.map(project => (
              <div 
                key={project.id} 
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(project)} 
              >
                {/* Image */}
                <div className="relative h-52 sm:h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Exclusive Badge */}
                  {project.isExclusive && (
                    <div className="absolute top-3 -left-7 transform -rotate-45 text-white font-bold uppercase tracking-wider" style={{ backgroundColor: '#C4A35A', padding: '3px 40px', fontSize: '10px' }}>
                      Exclusive
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 font-medium px-2.5 py-1 rounded-full text-xs">
                    {project.category}
                  </div>
                  {/* Status Badge */}
                  <div className="absolute bottom-3 left-3 backdrop-blur-sm text-white font-medium px-2.5 py-1 rounded-full text-[10px]" style={{ backgroundColor: 'rgba(26,39,68,0.9)' }}>
                    {project.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-5">
                  <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 transition-colors" style={{}} onMouseEnter={e => (e.currentTarget.style.color = '#1a2744')} onMouseLeave={e => (e.currentTarget.style.color = '')}>{project.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 mb-1.5 md:mb-2">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate text-xs sm:text-sm">{project.location}</span>
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-xs mb-2.5 md:mb-3">by {project.developer}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400">Starting at</p>
                      <p className="text-sm md:text-base font-bold text-slate-900">{project.price}</p>
                    </div>
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 text-white rounded-full font-medium transition-colors text-xs md:text-sm"
                      style={{ backgroundColor: '#1a2744' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#131e36')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1a2744')}
                    >
                      View
                      <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12 md:py-20">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">No projects found</h3>
              <p className="text-slate-600 text-sm md:text-base">Please try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
}