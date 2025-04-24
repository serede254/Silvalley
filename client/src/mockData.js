//new images
import work1 from './images/co-working 1.jpg';
import work2 from './images/co-working 2.jpg';
import work3 from './images/co-working 3.jpg';
import work4 from './images/co-working 4.jpg';
import work5 from './images/co-working 5.jpg';
import work6 from './images/co-working 6.jpg';
import work7 from './images/co-working 7.jpg';
import work8 from './images/co-working 8.jpg';
import work9 from './images/co-working 9.jpg';
import work10 from './images/co-working 10.jpg';
import work11 from './images/co-working 11.jpg';
import work12 from './images/co-working 12.jpg';
import work13 from './images/co-working 13.jpg';
export const spaces = [
  {
    id: '1',
    name: 'Downtown Workspace',
    location: 'San Francisco, CA',
    description: 'A modern coworking space in the heart of downtown with all amenities you need for productive work.',
    price: 35,
    availableDesks: 15,
    image: work1,
    amenities: {
      wifi: true,
      kitchen: true,
      meetingRooms: true,
      parking: false,
      access24_7: true
    }
  },
  {
    id: '2',
    name: 'Creative Hub',
    location: 'New York, NY',
    description: 'A vibrant space designed for creative professionals with open areas and private booths.',
    price: 40,
    availableDesks: 2,  // Low availability
    image: work2,
    amenities: {
      wifi: true,
      kitchen: true,
      meetingRooms: true,
      parking: true,
      access24_7: false
    }
  },
  {
    id: '3',
    name: 'Tech Loft',
    location: 'Austin, TX',
    description: 'A spacious loft with high-speed internet and modern amenities for tech professionals.',
    price: 30,
    availableDesks: 20,
    image: work3,
    amenities: {
      wifi: true,
      kitchen: false,
      meetingRooms: true,
      parking: true,
      access24_7: true
    }
  },
  {
    id: '4',
    name: 'Quiet Zone',
    location: 'Seattle, WA',
    description: 'A peaceful workspace designed for focus and concentration with soundproof booths and quiet areas.',
    price: 28,
    availableDesks: 0,  // Sold out
    image: work4,
    amenities: {
      wifi: true,
      kitchen: true,
      meetingRooms: false,
      parking: false,
      access24_7: false
    }
  },
  {
    id: '5',
    name: 'Startup Garage',
    location: 'Boston, MA',
    description: 'An industrial-style coworking space with a community of entrepreneurs and startup founders.',
    price: 25,
    availableDesks: 3,  // Low availability
    image: work5,
    amenities: {
      wifi: true,
      kitchen: true,
      meetingRooms: true,
      parking: true,
      access24_7: true
    }
  },
  {
    id: '6',
    name: 'Waterfront Office',
    location: 'Miami, FL',
    description: 'A bright and airy workspace with stunning views of the ocean and plenty of natural light.',
    price: 45,
    availableDesks: 1,  // Very low availability
    image: work6,
    amenities: {
      wifi: true,
      kitchen: true,
      meetingRooms: true,
      parking: true,
      access24_7: false
    }
  },
  // New entries start here
  {
    id: '7',
    name: 'Mountain View Studio',
    location: 'Denver, CO',
    description: 'A cozy workspace with panoramic mountain views, perfect for those seeking inspiration from nature.',
    price: 32,
    availableDesks: 8,
    image: work7,
    amenities: {
      wifi: true,
      kitchen: true,
      meetingRooms: false,
      parking: true,
      access24_7: true,
      printing: true,
      security: true
    }
  },
  {
    id: '8',
    name: 'Innovation Campus',
    location: 'Chicago, IL',
    description: 'A large collaborative space designed for tech startups and innovation teams with state-of-the-art facilities.',
    price: 38,
    availableDesks: 25,
    image: work8,
    amenities: {
      wifi: true,
      kitchen: true,
      meetingRooms: true,
      parking: true,
      access24_7: true,
      printing: true,
      security: true,
      airConditioning: true
    }
  },
  {
    id: '9',
    name: 'Urban Desk',
    location: 'Portland, OR',
    description: 'A hip, eco-friendly workspace in the heart of the city with sustainable design and community focus.',
    price: 27,
    availableDesks: 0, // Sold out
    image: work9,
    amenities: {
      wifi: true,
      kitchen: true,
      meetingRooms: true,
      parking: false,
      access24_7: false,
      printing: true,
      security: false
    }
  },
  {
    id: '10',
    name: 'Harbor Workspace',
    location: 'Baltimore, MD',
    description: 'A renovated warehouse space with industrial charm, located near the harbor with excellent transport links.',
    price: 29,
    availableDesks: 12,
    image: work10,
    amenities: {
      wifi: true,
      kitchen: false,
      meetingRooms: true,
      parking: true,
      access24_7: false,
      printing: true,
      security: true
    }
  },
  {
    id: '11',
    name: 'Desert Oasis Office',
    location: 'Phoenix, AZ',
    description: 'A bright, modern workspace with desert-inspired design elements and outdoor working areas for sunny days.',
    price: 31,
    availableDesks: 2, // Low availability
    image: work11,
    amenities: {
      wifi: true,
      kitchen: true,
      meetingRooms: false,
      parking: true,
      access24_7: true,
      printing: false,
      security: true,
      airConditioning: true
    }
  },
  {
    id: '12',
    name: 'Skyline Loft',
    location: 'Atlanta, GA',
    description: 'A premium workspace on the top floor with panoramic city views, luxury amenities, and private offices.',
    price: 50,
    availableDesks: 5,
    image: work12, 
    amenities: {
      wifi: true,
      kitchen: true,
      meetingRooms: true,
      parking: true,
      access24_7: true,
      printing: true,
      security: true,
      airConditioning: true
    }
  },
  {
    id: '13',
    name: 'Riverside Commons',
    location: 'Nashville, TN',
    description: 'A community-focused workspace along the river with music-themed meeting rooms and event spaces.',
    price: 33,
    availableDesks: 0, // Sold out
    image: work13,
    amenities: {
      wifi: true,
      kitchen: true,
      meetingRooms: true,
      parking: true,
      access24_7: false,
      printing: true,
      security: false
    }
  }
];

export const bookings = [
  {
    id: 'b1',
    userId: 'u1',
    userEmail: 'john@example.com',
    spaceId: '1',
    spaceName: 'Downtown Workspace',
    date: '2023-06-15',
    price: 35,
    status: 'Active'
  },
  {
    id: 'b2',
    userId: 'u1',
    userEmail: 'john@example.com',
    spaceId: '3',
    spaceName: 'Tech Loft',
    date: '2023-06-20',
    price: 30,
    status: 'Active'
  },
  {
    id: 'b3',
    userId: 'u2',
    userEmail: 'sarah@example.com',
    spaceId: '2',
    spaceName: 'Creative Hub',
    date: '2023-06-18',
    price: 40,
    status: 'Cancelled'
  }
];

export const users = [
  {
    id: 'u1',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user',
    createdAt: '2023-01-15T10:30:00Z',
    bookingsCount: 2
  },
  {
    id: 'u2',
    email: 'sarah@example.com',
    name: 'Sarah Smith',
    role: 'user',
    createdAt: '2023-02-20T14:15:00Z',
    bookingsCount: 1
  },
  {
    id: 'u3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2022-12-01T09:00:00Z',
    bookingsCount: 0
  }
];
