export interface Review {
  id: string;
  restaurantId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export const reviews: Review[] = [
  {
    id: '1',
    restaurantId: '1',
    username: 'SushiLover',
    rating: 5,
    comment: 'Absolutely incredible! The fish was so fresh and the presentation was beautiful. Best sushi I\'ve had outside of Japan.',
    date: '2024-01-15'
  },
  {
    id: '2',
    restaurantId: '1',
    username: 'FoodieMike',
    rating: 4,
    comment: 'Great quality sushi, but a bit pricey. The service was excellent though.',
    date: '2024-01-10'
  },
  {
    id: '3',
    restaurantId: '2',
    username: 'PastaQueen',
    rating: 5,
    comment: 'The homemade pasta is divine! Authentic Italian flavors that remind me of my grandmother\'s cooking.',
    date: '2024-01-12'
  },
  {
    id: '4',
    restaurantId: '2',
    username: 'ItalianFan',
    rating: 4,
    comment: 'Delicious food and cozy atmosphere. The wood-fired pizza was perfectly crispy.',
    date: '2024-01-08'
  },
  {
    id: '5',
    restaurantId: '3',
    username: 'FrenchChef',
    rating: 5,
    comment: 'Exquisite French cuisine! The coq au vin was perfectly cooked and the wine pairing was spot on.',
    date: '2024-01-14'
  },
  {
    id: '6',
    restaurantId: '4',
    username: 'SpiceHunter',
    rating: 4,
    comment: 'Amazing flavors and great vegetarian options. The naan bread was freshly made.',
    date: '2024-01-11'
  },
  {
    id: '7',
    restaurantId: '5',
    username: 'SeafoodLover',
    rating: 5,
    comment: 'Fresh catch of the day was outstanding! The lobster was perfectly cooked and the view is incredible.',
    date: '2024-01-13'
  },
  {
    id: '8',
    restaurantId: '6',
    username: 'TacoFan',
    rating: 4,
    comment: 'Authentic Mexican street food! The homemade tortillas and fresh salsas are amazing.',
    date: '2024-01-09'
  }
];
