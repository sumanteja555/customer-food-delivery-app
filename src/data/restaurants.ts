export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
};

export type Restaurant = {
  id: string;
  city: string;
  address: string;
  name: string;
  cuisine: string;
  rating: string;
  time: string;
  fee: string;
  image: string;
  menu: MenuItem[];
};

const images = {
  biryani: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80',
  breakfast: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
  meals: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  curry: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
  pizza: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
};

const categoryFor = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('biryani')) return 'Biryani';
  if (normalized.includes('dosa') || normalized.includes('idli') || normalized.includes('puri')) return 'Breakfast';
  if (normalized.includes('pizza')) return 'Pizza';
  if (normalized.includes('burger')) return 'Burgers';
  if (normalized.includes('rice') || normalized.includes('noodles')) return 'Rice & Noodles';
  if (normalized.includes('thali') || normalized.includes('meals')) return 'Meals';
  if (normalized.includes('curry') || normalized.includes('pappu') || normalized.includes('gongura')) return 'Curries';
  if (normalized.includes('combo')) return 'Combos';
  return 'Sides';
};

const menuItem = (
  restaurantId: string,
  id: string,
  name: string,
  description: string,
  price: number,
  image: string,
  isVeg = false,
): MenuItem => ({
  id: `${restaurantId}-${id}`,
  name,
  category: categoryFor(name),
  description,
  price,
  image,
  isVeg,
});

export const RESTAURANTS: Restaurant[] = [
  {
    id: '6', city: 'Nandigama', address: 'Near Gandhi Centre, Nandigama', name: 'Nandigama Spice Hub', cuisine: 'Indian · Biryani',
    rating: '4.6', time: '20–30 min', fee: 'Free delivery', image: images.biryani,
    menu: [
      menuItem('6', 'chicken-biryani', 'Chicken Dum Biryani', 'Fragrant basmati rice with spiced chicken and raita.', 249, images.biryani),
      menuItem('6', 'paneer-biryani', 'Paneer Biryani', 'Paneer, aromatic rice, fried onions and house masala.', 209, images.biryani, true),
      menuItem('6', 'chicken-65', 'Chicken 65', 'Crisp, spicy chicken tossed with curry leaves.', 189, images.curry),
    ],
  },
  {
    id: '7', city: 'Nandigama', address: 'Beside NH65 Bus Stop, Nandigama', name: 'Highway Tiffins', cuisine: 'Indian · South Indian',
    rating: '4.4', time: '15–25 min', fee: '₹19 delivery', image: images.breakfast,
    menu: [
      menuItem('7', 'masala-dosa', 'Masala Dosa', 'Crisp dosa with potato masala, chutney and sambar.', 99, images.breakfast, true),
      menuItem('7', 'idli', 'Idli Sambar', 'Four soft idlis served with hot sambar and chutney.', 79, images.breakfast, true),
      menuItem('7', 'puri', 'Puri Bhaji', 'Fluffy puris with a homestyle potato curry.', 89, images.breakfast, true),
    ],
  },
  {
    id: '14', city: 'Nandigama', address: 'Main Road, near Rythu Bazaar, Nandigama', name: 'Royal Andhra Biryani', cuisine: 'Indian · Biryani',
    rating: '4.7', time: '20–30 min', fee: 'Free delivery', image: images.biryani,
    menu: [
      menuItem('14', 'mutton-biryani', 'Mutton Dum Biryani', 'Slow-cooked mutton with fragrant basmati rice.', 329, images.biryani),
      menuItem('14', 'chicken-biryani', 'Chicken Fry Piece Biryani', 'Andhra-style chicken fry pieces layered with rice.', 259, images.biryani),
      menuItem('14', 'paneer-biryani', 'Paneer Dum Biryani', 'Spiced paneer and vegetables cooked on dum.', 209, images.biryani, true),
    ],
  },
  {
    id: '15', city: 'Nandigama', address: 'Opposite RTC Bus Stand, Nandigama', name: 'Sri Lakshmi Meals', cuisine: 'Indian · Andhra Meals',
    rating: '4.6', time: '15–25 min', fee: '₹19 delivery', image: images.meals,
    menu: [
      menuItem('15', 'veg-meals', 'Andhra Veg Meals', 'Rice, pappu, curries, sambar, curd and sweet.', 159, images.meals, true),
      menuItem('15', 'chicken-meals', 'Chicken Curry Meals', 'Andhra meals served with spicy chicken curry.', 239, images.curry),
      menuItem('15', 'curd-rice', 'Curd Rice', 'Cooling seasoned curd rice with pickle.', 89, images.meals, true),
    ],
  },
  {
    id: '16', city: 'Nandigama', address: 'KVR College Road, Nandigama', name: 'Nandigama Pizza Corner', cuisine: 'Pizza · Fast Food',
    rating: '4.3', time: '25–35 min', fee: '₹29 delivery', image: images.pizza,
    menu: [
      menuItem('16', 'margherita', 'Margherita Pizza', 'Tomato sauce, mozzarella and herbs.', 189, images.pizza, true),
      menuItem('16', 'chicken-pizza', 'Tandoori Chicken Pizza', 'Smoky chicken, onion, capsicum and cheese.', 289, images.pizza),
      menuItem('16', 'garlic-bread', 'Cheesy Garlic Bread', 'Garlic bread baked with mozzarella.', 119, images.pizza, true),
    ],
  },
  {
    id: '17', city: 'Nandigama', address: 'NH65 Service Road, Nandigama', name: 'NH65 Burger House', cuisine: 'Burgers · Fast Food',
    rating: '4.5', time: '15–25 min', fee: 'Free delivery', image: images.burger,
    menu: [
      menuItem('17', 'chicken-burger', 'Crispy Chicken Burger', 'Crispy chicken patty with lettuce and mayo.', 169, images.burger),
      menuItem('17', 'paneer-burger', 'Spicy Paneer Burger', 'Grilled paneer, onions and spicy sauce.', 149, images.burger, true),
      menuItem('17', 'fries', 'Peri Peri Fries', 'Crispy fries with peri peri seasoning.', 99, images.burger, true),
    ],
  },
  {
    id: '18', city: 'Nandigama', address: 'Near Old Bus Stand, Nandigama', name: 'Dosa Junction', cuisine: 'Indian · South Indian',
    rating: '4.8', time: '10–20 min', fee: '₹15 delivery', image: images.breakfast,
    menu: [
      menuItem('18', 'dosa', 'Ghee Karam Dosa', 'Crisp dosa with ghee and Andhra karam.', 119, images.breakfast, true),
      menuItem('18', 'idli', 'Ghee Idli', 'Soft idlis topped with ghee and podi.', 89, images.breakfast, true),
      menuItem('18', 'upma', 'Vegetable Upma', 'Semolina breakfast with vegetables and chutney.', 79, images.breakfast, true),
    ],
  },
  {
    id: '19', city: 'Nandigama', address: 'Gandhi Centre Road, Nandigama', name: 'Dragon Wok', cuisine: 'Asian · Chinese',
    rating: '4.4', time: '20–30 min', fee: '₹25 delivery', image: images.meals,
    menu: [
      menuItem('19', 'fried-rice', 'Chicken Fried Rice', 'Wok-tossed rice with chicken, egg and vegetables.', 189, images.meals),
      menuItem('19', 'noodles', 'Veg Hakka Noodles', 'Noodles tossed with vegetables and sauces.', 159, images.salad, true),
      menuItem('19', 'manchurian', 'Gobi Manchurian', 'Crispy cauliflower in a tangy chilli sauce.', 149, images.curry, true),
    ],
  },
  {
    id: '20', city: 'Nandigama', address: 'Near Municipal Office, Nandigama', name: 'Green Leaf Kitchen', cuisine: 'Healthy · Salads',
    rating: '4.6', time: '15–25 min', fee: 'Free delivery', image: images.salad,
    menu: [
      menuItem('20', 'paneer-salad', 'Grilled Paneer Salad', 'Paneer, greens, cucumber and lemon dressing.', 179, images.salad, true),
      menuItem('20', 'sprouts', 'Protein Sprouts Bowl', 'Mixed sprouts, vegetables, peanuts and herbs.', 139, images.salad, true),
      menuItem('20', 'fruit-bowl', 'Fresh Fruit Bowl', 'Seasonal fresh fruits served chilled.', 129, images.salad, true),
    ],
  },
  {
    id: '21', city: 'Nandigama', address: 'Vijayawada Road, Nandigama', name: 'Andhra Curry Point', cuisine: 'Indian · Curries',
    rating: '4.5', time: '20–30 min', fee: '₹19 delivery', image: images.curry,
    menu: [
      menuItem('21', 'gongura-chicken', 'Gongura Chicken', 'Chicken cooked with tangy gongura leaves.', 229, images.curry),
      menuItem('21', 'paneer-curry', 'Paneer Butter Masala', 'Paneer in a creamy tomato and butter gravy.', 199, images.curry, true),
      menuItem('21', 'dal', 'Tomato Pappu', 'Andhra tomato dal with garlic tempering.', 129, images.curry, true),
    ],
  },
  {
    id: '8', city: 'Jaggayyapeta', address: 'Near RTC Bus Stand, Jaggayyapeta', name: 'Jaggayyapeta Food Court', cuisine: 'Indian · Multi-cuisine',
    rating: '4.5', time: '25–35 min', fee: 'Free delivery', image: images.meals,
    menu: [
      menuItem('8', 'thali', 'Special Veg Thali', 'Rice, dal, two curries, roti, curd and sweet.', 179, images.meals, true),
      menuItem('8', 'fried-rice', 'Chicken Fried Rice', 'Wok-tossed rice with chicken, egg and vegetables.', 199, images.meals),
      menuItem('8', 'noodles', 'Veg Hakka Noodles', 'Noodles tossed with crunchy vegetables and sauces.', 159, images.salad, true),
    ],
  },
  {
    id: '9', city: 'Jaggayyapeta', address: 'Main Road, near Balaji Theatre, Jaggayyapeta', name: 'Sri Balaji Meals', cuisine: 'Indian · Andhra Meals',
    rating: '4.7', time: '20–30 min', fee: '₹25 delivery', image: images.meals,
    menu: [
      menuItem('9', 'andhra-meals', 'Andhra Meals', 'Unlimited-style rice meal with dal, curries and curd.', 169, images.meals, true),
      menuItem('9', 'curd-rice', 'Curd Rice', 'Comforting seasoned curd rice with pickle.', 99, images.meals, true),
      menuItem('9', 'chicken-curry', 'Andhra Chicken Curry', 'Fiery Andhra-style chicken curry with two rotis.', 229, images.curry),
    ],
  },
  {
    id: '10', city: 'Kanchikacherla', address: 'Main Centre, Kanchikacherla', name: 'Kanchikacherla Kitchen', cuisine: 'Indian · Andhra',
    rating: '4.5', time: '20–30 min', fee: 'Free delivery', image: images.curry,
    menu: [
      menuItem('10', 'gongura-chicken', 'Gongura Chicken', 'Tangy sorrel-leaf chicken curry with steamed rice.', 239, images.curry),
      menuItem('10', 'dal', 'Tomato Pappu', 'Andhra tomato dal tempered with garlic and spices.', 139, images.curry, true),
      menuItem('10', 'roti-combo', 'Paneer Roti Combo', 'Paneer curry with four soft rotis and salad.', 199, images.curry, true),
    ],
  },
  {
    id: '11', city: 'Kanchikacherla', address: 'Near RTC Bus Stand, Kanchikacherla', name: 'Village Pizza Point', cuisine: 'Pizza · Fast Food',
    rating: '4.3', time: '25–40 min', fee: '₹29 delivery', image: images.pizza,
    menu: [
      menuItem('11', 'margherita', 'Margherita Pizza', 'Classic tomato, mozzarella and basil pizza.', 199, images.pizza, true),
      menuItem('11', 'farmhouse', 'Farmhouse Pizza', 'Onion, capsicum, tomato, corn and extra cheese.', 269, images.pizza, true),
      menuItem('11', 'garlic-bread', 'Cheesy Garlic Bread', 'Toasted garlic bread loaded with mozzarella.', 129, images.pizza, true),
    ],
  },
  {
    id: '12', city: 'Kodada', address: 'Beside NH65, near Kodad Bus Stand', name: 'Kodad Biryani House', cuisine: 'Indian · Biryani',
    rating: '4.8', time: '20–35 min', fee: 'Free delivery', image: images.biryani,
    menu: [
      menuItem('12', 'special-biryani', 'Kodad Special Biryani', 'House-special chicken biryani with egg and raita.', 279, images.biryani),
      menuItem('12', 'mutton-biryani', 'Mutton Dum Biryani', 'Slow-cooked mutton layered with fragrant basmati rice.', 329, images.biryani),
      menuItem('12', 'veg-biryani', 'Veg Dum Biryani', 'Seasonal vegetables and paneer cooked on dum.', 189, images.biryani, true),
    ],
  },
  {
    id: '13', city: 'Kodada', address: 'NH65 Service Road, Kodada', name: 'NH65 Burger Stop', cuisine: 'Burgers · Fast Food',
    rating: '4.4', time: '15–25 min', fee: '₹19 delivery', image: images.burger,
    menu: [
      menuItem('13', 'chicken-burger', 'Crispy Chicken Burger', 'Crispy chicken, lettuce and smoky mayo.', 179, images.burger),
      menuItem('13', 'veg-burger', 'Veggie Crunch Burger', 'Crisp vegetable patty, cheese and house sauce.', 139, images.burger, true),
      menuItem('13', 'fries', 'Peri Peri Fries', 'Golden fries tossed in a punchy peri peri seasoning.', 99, images.burger, true),
    ],
  },
];

export const findRestaurant = (id: string) =>
  RESTAURANTS.find((restaurant) => restaurant.id === id) ?? null;
