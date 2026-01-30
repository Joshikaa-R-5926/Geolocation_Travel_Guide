import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Reliable Unsplash Fallbacks
export const IMG = {
    TEMPLE: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800',
    HILL: 'https://images.unsplash.com/photo-1590424072237-7f938f3883a9?auto=format&fit=crop&q=80&w=800',
    BEACH: 'https://images.unsplash.com/photo-1595152230611-641570d51f28?auto=format&fit=crop&q=80&w=800',
    FOREST: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800',
    HERITAGE: 'https://images.unsplash.com/photo-1620311442142-2b281f621a05?auto=format&fit=crop&q=80&w=800'
};

// Helper to generate a 7-day forecast
const getForecast = (baseTemp) => [
    { day: 'Mon', temp: baseTemp, condition: 'Sunny' },
    { day: 'Tue', temp: baseTemp + 1, condition: 'Clear' },
    { day: 'Wed', temp: baseTemp - 1, condition: 'Cloudy' },
    { day: 'Thu', temp: baseTemp, condition: 'Partly Cloudy' },
    { day: 'Fri', temp: baseTemp + 2, condition: 'Sunny' },
    { day: 'Sat', temp: baseTemp + 1, condition: 'Breezy' },
    { day: 'Sun', temp: baseTemp - 2, condition: 'Rainy' }
];

// Helper to generate realistic ratings
const getRating = (seed) => {
    const ratings = [4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.6, 3.5];
    return ratings[seed % ratings.length];
};

const getReviewCount = (seed) => {
    const counts = [3421, 2876, 1954, 1432, 987, 756, 543, 421, 312, 245, 189, 134, 98, 67];
    return counts[seed % counts.length];
};

const getCategory = (name) => {
    const lower = name.toLowerCase();
    const categories = [];
    if (lower.includes('temple') || lower.includes('kovil') || lower.includes('church') || lower.includes('mosque')) categories.push('Temple');
    if (lower.includes('beach')) categories.push('Beach');
    if (lower.includes('hill') || lower.includes('peak') || lower.includes('mountain')) categories.push('Hill Station');
    if (lower.includes('fort') || lower.includes('palace') || lower.includes('museum') || lower.includes('heritage')) categories.push('Heritage');
    if (lower.includes('park') || lower.includes('sanctuary') || lower.includes('forest') || lower.includes('lake') || lower.includes('dam')) categories.push('Nature');
    if (lower.includes('falls') || lower.includes('waterfall')) categories.push('Waterfall');
    return categories.length > 0 ? categories : ['Attraction'];
};

// Enhance places with ratings and metadata
const enhancePlaces = (places) => {
    return places.map((place, idx) => ({
        ...place,
        rating: place.rating || getRating(idx),
        reviewCount: place.reviewCount || getReviewCount(idx),
        category: place.category || getCategory(place.name),
        entryFee: place.entryFee || (Math.random() > 0.6 ? 'Free' : `₹${[20, 30, 50, 100, 150][idx % 5]}`),
        duration: place.duration || ['1-2 hours', '2-3 hours', '3-4 hours', 'Half day', 'Full day'][idx % 5],
        bestTime: place.bestTime || [
            'Oct to Mar (Pleasant weather)',
            'Dawn (5 AM - 7 AM) for solitude and sunrise',
            'Evening (5 PM - 8 PM) for sunsets and cool breeze',
            'Weekdays to avoid heavy weekend crowds'
        ][idx % 4],
        openingHours: place.openingHours || (idx % 3 === 0 ? '6:00 AM - 8:00 PM' : idx % 3 === 1 ? '9:00 AM - 6:00 PM' : 'Open 24 Hours'),
        visitorTips: place.visitorTips || [
            'Wear comfortable walking shoes.',
            'Carry a water bottle to stay hydrated.',
            'Photography is allowed (no flash inside).',
            'Try local snacks from nearby stalls.'
        ][idx % 4],
        badge: place.badge || (idx < 2 ? 'Must Visit' : idx < 4 ? 'Popular' : null)
    }));
};

export const mockLocations = {
    Ariyalur: {
        name: 'Ariyalur',
        places: [
            { name: 'GANGAIKONDA CHOLAPURAM', description: 'UNESCO heritage site with stunning Chola architecture and the massive Brihadisvara Temple.', image: '/assets/images/ariyalur/gangaikonda.png' },
            { name: 'Chola Ganga Lake (Ponneri Lake)', description: 'Historic reservoir and scenic lake built by the Chola dynasty, also known as Ponneri.', image: '/assets/images/ariyalur/cholaganga.jpg' },
            { name: 'Fossil Park', description: 'Archaeological site featuring millions-of-years-old fossils and prehistoric artifacts.', image: '/assets/images/ariyalur/fossil_park.png' }
        ],
        travelCost: 1500, stayCostPerDay: 1000, foodCostPerDay: 500,
        weather: { temp: 27, condition: 'Dry', forecast: getForecast(27) }
    },
    Chengalpattu: {
        name: 'Chengalpattu',
        places: [
            { name: 'Arignar Anna Zoological Park', description: 'One of the largest zoological parks in South Asia, popular for its lion and night safari.', image: '/assets/images/chengalpattu/vandalur_zoo.jpg' },
            { name: 'Muttukadu Boat House', description: 'Scenic backwater destination offering rowing, windsurfing, and water skiing.', image: '/assets/images/chengalpattu/muttukadu.jpg' },
            { name: 'Mamallapuram (Mahabalipuram)', description: 'UNESCO World Heritage site known for its group of 7th- and 8th-century stone carvings.', image: '/assets/images/chengalpattu/mamallapuram.jpg' },
            { name: 'Mudaliarkuppam Boat House', description: 'Raindrop Boat House offering pleasant water rides in the backwaters of the Bay of Bengal.', image: '/assets/images/chengalpattu/mudaliarkuppam.jpg' },
            { name: 'Vedanthangal Bird Sanctuary', description: 'One of the oldest bird sanctuaries in India.', image: IMG.FOREST },
            { name: 'Karikili Bird Sanctuary', description: 'Quiet sanctuary perfect for nature lovers.', image: IMG.FOREST },
            { name: 'Kolavai Lake', description: 'Beautiful large lake offering boating.', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800' },
            { name: 'Madurantakam Lake', description: 'Giant lake with spiritual significance.', image: IMG.FOREST },
            { name: 'Thiruporur Murugan Temple', description: 'Ancient temple dedicated to Lord Murugan.', image: IMG.TEMPLE }
        ],
        travelCost: 1200, stayCostPerDay: 1500, foodCostPerDay: 800,
        weather: { temp: 28, condition: 'Partly Cloudy', forecast: getForecast(28) }
    },
    Chennai: {
        name: 'Chennai',
        coordinates: { lat: 13.0827, lng: 80.2707 },
        places: enhancePlaces([
            {
                name: 'Fort St. George',
                description: 'Historic 17th-century fortification and the first British museum in India.',
                image: '/assets/images/chennai/fort_st_george.jpg',
                images: [
                    '/assets/images/chennai/fort_st_george.jpg',
                    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1620311442142-2b281f621a05?auto=format&fit=crop&q=80&w=800'
                ]
            },
            {
                name: 'Marina Beach',
                description: 'The world\'s second longest natural urban beach along the Bay of Bengal.',
                image: '/assets/images/chennai/marina_beach.jpg',
                images: [
                    '/assets/images/chennai/marina_beach.jpg',
                    'https://images.unsplash.com/photo-1595152230611-641570d51f28?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800'
                ]
            },
            { name: 'Kapaleeshwarar Temple', description: 'Ancient Dravidian temple in Mylapore dedicated to Lord Shiva.', image: '/assets/images/chennai/kapaleeshwarar.jpg' },
            { name: 'Government Museum, Egmore', description: 'Significant depository of art and archaeological artifacts since 1851.', image: '/assets/images/chennai/museum.jpg' },
            { name: 'Elliot Beach (Besant Nagar Beach)', description: 'Quiet coastal stretch in Besant Nagar named after Edward Elliot.', image: '/assets/images/chennai/elliot_beach.jpg' },
            { name: 'Ashtalakshmi Temple', description: 'Stunning multi-tiered temple dedicated to the eight forms of Goddess Lakshmi.', image: '/assets/images/chennai/ashtalakshmi.jpg' },
            { name: 'Guindy National Park', description: 'Tropical dry evergreen forest located right in the heart of the city.', image: '/assets/images/chennai/guindy_park.jpg' },
            { name: 'Valluvar Kottam', description: 'Iconic monument dedicated to the classical Tamil poet and philosopher Thiruvalluvar.', image: '/assets/images/chennai/valluvar_kottam.jpg' },
            { name: 'Dakshina Chitra Museum', description: 'Living museum of art, architecture, and lifestyles of South India.', image: '/assets/images/chennai/dakshina_chitra.jpg' },
            { name: 'Mahabalipuram', description: 'UNESCO world heritage site famous for its shore temples and rock carvings.', image: '/assets/images/chennai/mahabalipuram.jpg' }
        ]),
        mapUrl: 'https://www.holidify.com/places/chennai/map-view.html',
        mapEmbedUrl: 'https://maps.google.com/maps?q=tourist%20places%20in%20Chennai&t=&z=13&ie=UTF8&iwloc=&output=embed',
        travelCost: 1000, stayCostPerDay: 2000, foodCostPerDay: 1000,
        weather: { temp: 29, condition: 'Clear', forecast: getForecast(29) },
        weatherRecommendations: {
            Clear: "Perfect day for Marina Beach or an evening at Elliot Beach.",
            Rainy: "Ideal for visiting the indoor Government Museum or a traditional concert.",
            Hot: "Visit the air-conditioned malls or the shaded Guindy National Park."
        },
        tourismDetails: {
            bestTimeToVisit: "The ideal time to visit Chennai is during the winter months, from November to February. The weather is most pleasant, characterized by relatively cooler temperatures and lower humidity, making it perfect for sightseeing and outdoor activities.",
            seasons: [
                { name: "Winter (Nov - Feb)", temp: "20°C - 28°C", description: "Coolest and most pleasant season. Ideal for exploring the city and beaches." },
                { name: "Summer (Mar - May)", temp: "30°C - 40°C", description: "Hot and humid. It's best to stay indoors or visit air-conditioned attractions during the day." },
                { name: "Monsoon (Jun - Oct)", temp: "25°C - 33°C", description: "Brings heavy rain, especially from October onwards. The city looks lush but travel can be restricted." }
            ],
            rainfall: "Chennai receives most of its rainfall from the North-East monsoon between October and December. November is typically the wettest month.",
            festivals: [
                { name: "Margazhi Music Season", month: "Dec - Jan", description: "World-renowned festival of Carnatic music and dance across the city." },
                { name: "Pongal", month: "January", description: "The major four-day harvest festival of Tamil Nadu with traditional food and games." },
                { name: "Panguni Peruvizha", month: "Mar - Apr", description: "A grand 10-day festival at the Kapaleeshwarar Temple in Mylapore." }
            ],
            travelTips: [
                "Modest dress is advised when visiting religious sites.",
                "Stay well-hydrated due to the tropical humidity.",
                "Use ride-hailing apps like Ola or Uber for convenient travel.",
                "English is widely spoken, but a few Tamil phrases go a long way."
            ]
        }
    },
    Coimbatore: {
        name: 'Coimbatore',
        coordinates: { lat: 11.0168, lng: 76.9558 },
        places: enhancePlaces([
            {
                name: 'Marudhamalai Temple',
                description: 'Sacred hill temple dedicated to Lord Murugan, offering spiritual peace and panoramic views.',
                image: '/assets/images/coimbatore/marudhamalai.jpg',
                images: [
                    '/assets/images/coimbatore/marudhamalai.jpg',
                    IMG.TEMPLE,
                    'https://images.unsplash.com/photo-1620311442142-2b281f621a05?auto=format&fit=crop&q=80&w=800'
                ]
            },
            {
                name: 'Isha Yoga Center',
                description: 'Home to the massive Adiyogi statue, a global center for yoga and meditation.',
                image: '/assets/images/coimbatore/esha.jpg',
                images: [
                    '/assets/images/coimbatore/esha.jpg',
                    'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800'
                ]
            },
            { name: 'Siruvani Waterfalls', description: 'Breathtaking waterfalls located in the Western Ghats, known for the second sweetest water in the world.', image: '/assets/images/coimbatore/siruvani.jpg' },
            { name: 'Monkey Falls', description: 'Beautiful natural waterfall situated on the road to Valparai, surrounded by lush flora.', image: '/assets/images/coimbatore/monkey_falls.jpg' },
            { name: 'Aliyar Dam', description: 'Large dam and reservoir with a well-maintained park and fish aquarium at the foothills of hills.', image: '/assets/images/coimbatore/aliyar_dam.jpg' },
            { name: 'VOC Park & Zoo', description: 'Popular family park and mini zoo in the city.', image: 'https://images.unsplash.com/photo-1541414779316-956a5084c0d4?auto=format&fit=crop&q=80&w=800' },
            { name: 'Valparai', description: 'Lush green tea estates and hill station nearby.', image: IMG.HILL }
        ]),
        mapUrl: 'https://www.holidify.com/places/coimbatore/map-view.html',
        mapEmbedUrl: 'https://maps.google.com/maps?q=tourist%20places%20in%20Coimbatore&t=&z=13&ie=UTF8&iwloc=&output=embed',
        travelCost: 1500, stayCostPerDay: 1800, foodCostPerDay: 900,
        weather: { temp: 26, condition: 'Pleasant', forecast: getForecast(26) },
        weatherRecommendations: {
            Clear: "Ideal for a drive to Valparai tea estates or a visit to Isha Yoga Center.",
            Pleasant: "Great weather for a hill climb to Marudhamalai Temple.",
            Rainy: "Beautiful time to see Siruvani or Monkey Falls in full flow."
        }
    },
    Cuddalore: {
        name: 'Cuddalore',
        places: [
            { name: 'Silver Beach', description: 'The second longest beach in the Coromandel Coast.', image: IMG.BEACH },
            { name: 'Devanampattinam Beach', description: 'Popular local beach with recreational activities.', image: IMG.BEACH },
            { name: 'Pichavaram Mangrove Forest', description: 'World\'s second largest mangrove forest boat ride.', image: IMG.FOREST },
            { name: 'Padaleeswarar Temple', description: 'Ancient Shiva temple with historic signatures.', image: IMG.TEMPLE },
            { name: 'Fort St. David', description: 'Relic of the British era on the river bank.', image: IMG.HERITAGE }
        ],
        travelCost: 1400, stayCostPerDay: 1200, foodCostPerDay: 600,
        weather: { temp: 28, condition: 'Humid', forecast: getForecast(28) }
    },
    Dharmapuri: {
        name: 'Dharmapuri',
        places: [
            { name: 'Hogenakkal Falls', description: 'Known as the "Niagara of India," famous for its coracle rides and medicinal baths.', image: '/assets/images/dharmapuri/hogenakkal.jpg' },
            { name: 'Theerthamalai Temple', description: 'Ancient temple dedicated to Shiva, situated on a hill with sacred springs.', image: '/assets/images/dharmapuri/theerthamalai.jpg' },
            { name: 'Vathalmalai Hills', description: 'Lush green hill station known for its pleasant climate and coffee plantations.', image: '/assets/images/dharmapuri/vathalmalai.jpg' },
            { name: 'Adhiyamankottai', description: 'Historic site featuring an ancient fort and the beautiful Chenraya Perumal Temple.', image: '/assets/images/dharmapuri/adhiyamankottai.jpg' },
            { name: 'Thoppaiyar Dam', description: 'Sizable reservoir and scenic picnic spot nestled in the hills.', image: '/assets/images/dharmapuri/thoppaiyar_dam.jpg' },
            { name: 'Chenraya Perumal Temple', description: 'Ancient Vishnu temple with architectural brilliance and historical significance.', image: '/assets/images/dharmapuri/chenraya_perumal.jpg' },
            { name: 'Mettur Dam', description: 'One of the largest dams in India, offering stunning views and a large park (Park Side).', image: '/assets/images/dharmapuri/mettur_dam.png' },
            { name: 'Sacred Heart Cathedral', description: 'A beautiful landmark representing the spiritual heritage of the region.', image: '/assets/images/dharmapuri/sacred_heart.jpg' },
            { name: 'Subramanya Siva Memorial', description: 'Memorial for the famous freedom fighter.', image: IMG.HERITAGE }
        ],
        travelCost: 1800, stayCostPerDay: 1100, foodCostPerDay: 500,
        weather: { temp: 27, condition: 'Clear', forecast: getForecast(27) }
    },
    Dindigul: {
        name: 'Dindigul',
        places: [
            { name: 'Kodaikanal', description: 'The princess of hill stations, part of Dindigul district.', image: IMG.HILL },
            { name: 'Sirumalai Hills', description: 'Lush hill station known for its unique climate.', image: IMG.HILL },
            { name: 'Dindigul Fort', description: '17th-century hill fort with tactical importance.', image: IMG.HERITAGE },
            { name: 'Begambur Big Mosque', description: 'Over 300 years old historic mosque.', image: IMG.HERITAGE },
            { name: 'Palani Murugan Temple', description: 'One of the most visited hill shrines in TN (nearby).', image: IMG.HILL }
        ],
        travelCost: 1700, stayCostPerDay: 1300, foodCostPerDay: 700,
        weather: { temp: 25, condition: 'Clear', forecast: getForecast(25) }
    },
    Erode: {
        name: 'Erode',
        places: [
            { name: 'Bhavani Sangameshwarar Temple', description: 'Sacred confluence of three holy rivers.', image: IMG.TEMPLE },
            { name: 'Kodiveri Dam', description: 'Beautiful waterfall and public bathing site.', image: 'https://images.unsplash.com/photo-1590424072237-7f938f3883a9?auto=format&fit=crop&q=80&w=800' },
            { name: 'Vellode Bird Sanctuary', description: 'Large lake home to many migratory birds.', image: IMG.FOREST },
            { name: 'Bannari Amman Temple', description: 'Famous temple located on the NH near forest.', image: IMG.TEMPLE },
            { name: 'TNSTC Museum', description: 'Transport museum showcasing various models and history.', image: IMG.HERITAGE }
        ],
        travelCost: 1500, stayCostPerDay: 1100, foodCostPerDay: 600,
        weather: { temp: 29, condition: 'Warm', forecast: getForecast(29) }
    },
    Kallakurichi: {
        name: 'Kallakurichi',
        places: [
            { name: 'Kalvarayan Hills', description: 'Beautiful range of hills in Eastern Ghats with waterfalls.', image: IMG.HILL },
            { name: 'Gomuki Dam', description: 'Scenic dam and picnic spot at the foot of the hills.', image: IMG.FOREST },
            { name: 'Periyar Falls', description: 'Seasonal waterfall within the Kalvarayan range.', image: IMG.FOREST },
            { name: 'Megam Falls', description: 'Hidden gem with cascading water streams.', image: IMG.FOREST },
            { name: 'Chinna Salem Hills', description: 'Lesser-known hills perfect for local treks.', image: IMG.HILL }
        ],
        travelCost: 2000, stayCostPerDay: 1000, foodCostPerDay: 500,
        weather: { temp: 26, condition: 'Dry', forecast: getForecast(26) }
    },
    Kanchipuram: {
        name: 'Kanchipuram',
        places: [
            { name: 'Ekambareswarar Temple', description: 'Ancient temple representing the element of Earth.', image: IMG.TEMPLE },
            { name: 'Kamakshi Amman Temple', description: 'Golden temple of the city of temples.', image: IMG.TEMPLE },
            { name: 'Varadaraja Perumal Temple', description: 'Massive 23-acre temple complex dedicated to Vishnu.', image: IMG.TEMPLE },
            { name: 'Kailasanathar Temple', description: 'Oldest Pallava architecture sandbox temple.', image: IMG.HERITAGE },
            { name: 'Silk Weaving Centers', description: 'Witness the craft of world-famous Kanchi silk.', image: IMG.HERITAGE }
        ],
        travelCost: 1100, stayCostPerDay: 1400, foodCostPerDay: 700,
        weather: { temp: 28, condition: 'Clear', forecast: getForecast(28) }
    },
    Kanyakumari: {
        name: 'Kanyakumari',
        places: [
            { name: 'Vivekananda Rock Memorial', description: 'Iconic monument on a rock in the middle of the sea.', image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800' },
            { name: 'Thiruvalluvar Statue', description: '133ft tall stone statue representing the legendary poet.', image: IMG.BEACH },
            { name: 'Kanyakumari Beach', description: 'Confluence of three oceans with multi-colored sand.', image: IMG.BEACH },
            { name: 'Sunset & Sunrise Points', description: 'Experience both transitions from the same point.', image: IMG.BEACH },
            { name: 'Bhagavathi Amman Temple', description: 'Ancient temple dedicated to the virgin goddess.', image: IMG.TEMPLE },
            { name: 'Vattakottai Fort', description: 'Seaside fort with stunning ocean views.', image: IMG.HERITAGE }
        ],
        travelCost: 2500, stayCostPerDay: 1800, foodCostPerDay: 800,
        weather: { temp: 29, condition: 'Breezy', forecast: getForecast(29) }
    },
    Karur: {
        name: 'Karur',
        places: [
            { name: 'Pasupathieswarar Temple', description: 'Ancient Shiva temple known for its architecture.', image: IMG.TEMPLE },
            { name: 'Amaravathi River', description: 'Explore the serene banks of the river.', image: IMG.FOREST },
            { name: 'Kalyana Pasupathieswarar Temple', description: 'Another significant religious site in Karur.', image: IMG.TEMPLE },
            { name: 'Karur Textile Markets', description: 'Explore the hub of textile exports.', image: IMG.HERITAGE }
        ],
        travelCost: 1500, stayCostPerDay: 1100, foodCostPerDay: 500,
        weather: { temp: 30, condition: 'Warm', forecast: getForecast(30) }
    },
    Kodaikanal: {
        name: 'Kodaikanal',
        places: [
            { name: 'Kodaikanal Lake', description: 'Star-shaped lake perfect for serene walks and boating.', image: IMG.HILL },
            { name: 'Coaker’s Walk', description: 'Scenic pedestrian path with breathtaking valley views.', image: IMG.HILL },
            { name: 'Bryant Park', description: 'Vibrant botanical garden with rare flora.', image: IMG.FOREST },
            { name: 'Pillar Rocks', description: 'Three massive granite boulders standing tall.', image: IMG.HILL },
            { name: 'Bear Shola Falls', description: 'Seasonal waterfall in a forest area.', image: IMG.FOREST },
            { name: 'Green Valley View', description: 'Panoramic views of the vaigai dam and hills.', image: IMG.HILL }
        ],
        travelCost: 2800, stayCostPerDay: 2000, foodCostPerDay: 1000,
        weather: { temp: 19, condition: 'Misty', forecast: getForecast(19) }
    },
    Krishnagiri: {
        name: 'Krishnagiri',
        coordinates: { lat: 12.5262, lng: 78.2148 },
        places: [

            { name: 'Thally Garden and Lake', description: 'Also known as Little England, a cool climate garden.', image: '/assets/images/krishnagiri/thally_garden.jpg' },
            { name: 'Aiyur Eco Tourism Park', description: 'Lush green eco park perfect for nature lovers.', image: '/assets/images/krishnagiri/aiyur_eco_park.jpg' },
            { name: 'Krishnagiri Museum', description: 'Showcasing the history and artifacts of the region.', image: '/assets/images/krishnagiri/krishnagiri_museum.jpg' },
            { name: 'Chandra Choodaswarar Temple', description: 'Ancient hill temple dedicated to Lord Shiva.', image: '/assets/images/krishnagiri/chandra_choodaswarar_temple.jpg' },
            { name: 'Kellavarapalli Dam Park', description: 'Popular dam with a park and boating facilities.', image: '/assets/images/krishnagiri/kellavarapalli_dam.jpg' },
            { name: 'Avathanapatti Lake and Children Park', description: 'Serene lake with a well-maintained children\'s park and boating.', image: '/assets/images/krishnagiri/avathanapatti_lake.jpg' },
            { name: 'Krishnagiri Dam Park', description: 'Major reservoir with adjacent gardens, ideal for picnics.', image: '/assets/images/krishnagiri/krishnagiri_dam_park.jpg' },
            { name: 'Rayakottah Fort', description: 'Historical hill fort offering trekking and panoramic views.', image: '/assets/images/krishnagiri/rayakottah_fort.jpg' },
            { name: 'Krishnagiri Fort', description: 'Prominent rock fort built by Vijayanagar Emperors.', image: '/assets/images/krishnagiri/krishnagiri_fort.jpg' },
            { name: 'Cauvery South Wildlife Sanctuary', description: 'Protected area rich in biodiversity and wildlife.', image: '/assets/images/krishnagiri/cauvery_south_wildlife.jpg' }
        ],
        mapUrl: 'https://www.google.com/maps/search/krishnagiri+tourist+map+google/@12.514046,78.0080673,10.8z?entry=ttu',
        mapEmbedUrl: 'https://maps.google.com/maps?q=tourist%20places%20in%20Krishnagiri&t=&z=11&ie=UTF8&iwloc=&output=embed',
        travelCost: 1300, stayCostPerDay: 1100, foodCostPerDay: 500,
        weather: { temp: 26, condition: 'Clear', forecast: getForecast(26) },
        weatherRecommendations: {
            Clear: "Perfect for a trek to Rayakottai Fort or a picnic at the Dam.",
            Sunny: "Visit the lush mango farms or the local Government Museum.",
            Breezy: "Spend a relaxing evening by Avathavadi Lake."
        }
    },
    Madurai: {
        name: 'Madurai',
        places: [
            { name: 'Meenakshi Amman Temple', description: 'Ancient architectural marvel with 14 gopurams.', image: 'https://images.unsplash.com/photo-1616489953149-83bc9103c080?auto=format&fit=crop&q=80&w=800' },
            { name: 'Thirumalai Nayakkar Palace', description: 'Grand 17th-century royal palace with massive pillars.', image: IMG.HERITAGE },
            { name: 'Gandhi Memorial Museum', description: 'Dedicated to the father of the nation, set in a historic palace.', image: IMG.HERITAGE },
            { name: 'Alagar Kovil', description: 'Temple dedicated to Lord Vishnu set against hills.', image: IMG.TEMPLE },
            { name: 'Pazhamudhir Solai', description: 'A sacred Hill shrine dedicated to Lord Murugan.', image: IMG.HILL },
            { name: 'Vaigai Dam', description: 'Large dam built across the Vaigai river with parks.', image: IMG.FOREST }
        ],
        travelCost: 1800, stayCostPerDay: 1200, foodCostPerDay: 600,
        weather: { temp: 30, condition: 'Clear', forecast: getForecast(30) }
    },
    Mayiladuthurai: {
        name: 'Mayiladuthurai',
        places: [
            { name: 'Mayuranathaswami Temple', description: 'Ancient Shiva temple known for its peacock legend.', image: IMG.TEMPLE },
            { name: 'Parimala Ranganathar Temple', description: 'One of the 108 Divya Desams of Lord Vishnu.', image: IMG.TEMPLE },
            { name: 'Cauvery River Ghats', description: 'Holy bathing spots along the banks of Cauvery.', image: IMG.FOREST },
            { name: 'Vaitheeswaran Koil', description: 'Ancient Shiva temple dedicated to God of Healing (nearby).', image: IMG.TEMPLE }
        ],
        travelCost: 1500, stayCostPerDay: 1100, foodCostPerDay: 500,
        weather: { temp: 27, condition: 'Humid', forecast: getForecast(27) }
    },
    Nagapattinam: {
        name: 'Nagapattinam',
        places: [
            { name: 'Velankanni Basilica', description: 'World-famous shrine dedicated to Our Lady of Good Health.', image: IMG.HERITAGE },
            { name: 'Nagore Dargah', description: 'Historic 500-year-old spiritual site of Saint Shahul Hamid.', image: IMG.HERITAGE },
            { name: 'Nagapattinam Beach', description: 'Sandy coastline perfect for evening strolls.', image: IMG.BEACH },
            { name: 'Dutch Fort', description: 'Remnants of colonial Dutch influence (Tranquebar nearby).', image: IMG.HERITAGE },
            { name: 'Soundararaja Perumal Temple', description: '1000-year-old Vishnu temple in Nagapattinam.', image: IMG.TEMPLE }
        ],
        travelCost: 1800, stayCostPerDay: 1200, foodCostPerDay: 600,
        weather: { temp: 27, condition: 'Breezy', forecast: getForecast(27) }
    },
    Namakkal: {
        name: 'Namakkal',
        places: [
            { name: 'Namakkal Fort', description: 'Hill fort built by the Madurai Nayaks in the 17th century.', image: IMG.HERITAGE },
            { name: 'Anjaneyar Temple', description: 'Famous for the 18ft tall single stone Hanuman statue.', image: IMG.TEMPLE },
            { name: 'Kolli Hills', description: 'Unexplored hill station with 70 hair-pin bends.', image: IMG.HILL },
            { name: 'Agaya Gangai Waterfalls', description: 'Stunning 300ft waterfall set deep in the jungle.', image: IMG.FOREST },
            { name: 'Seeku Parai Viewpoint', description: 'Breath-taking viewpoints in Kolli Hills.', image: IMG.HILL }
        ],
        travelCost: 1800, stayCostPerDay: 1200, foodCostPerDay: 600,
        weather: { temp: 28, condition: 'Pleasant', forecast: getForecast(28) }
    },
    Nilgiris: {
        name: 'Nilgiris',
        places: [
            { name: 'Ooty', description: 'The Queen of Hill Stations set in the Blue Mountains.', image: IMG.HILL },
            { name: 'Coonoor', description: 'Known for its tea estates and Sim\'s Park botanical garden.', image: IMG.HILL },
            { name: 'Kotagiri', description: 'Quiet hill station perfect for trekking and nature walks.', image: IMG.HILL },
            { name: 'Doddabetta Peak', description: 'Highest point in the Nilgiri Mountains with telescope house.', image: IMG.HILL },
            { name: 'Tea Gardens', description: 'Vast, rolling tea plantations across the hills.', image: IMG.FOREST },
            { name: 'Mudumalai National Park', description: 'Wildlife sanctuary and tiger reserve in the hills.', image: IMG.FOREST }
        ],
        travelCost: 2500, stayCostPerDay: 1800, foodCostPerDay: 900,
        weather: { temp: 16, condition: 'Mist', forecast: getForecast(16) }
    },
    Ooty: {
        name: 'Ooty',
        places: [
            { name: 'Botanical Garden', description: 'Heritage gardens established in 1848 with rare species.', image: IMG.FOREST },
            { name: 'Ooty Lake', description: 'Artificial lake offering scenic boat rides since 1824.', image: IMG.HILL },
            { name: 'Rose Garden', description: 'One of the largest rose gardens in India with thousands of varieties.', image: IMG.FOREST },
            { name: 'Doddabetta Peak', description: 'Sky-high views of the Nilgiris from 2,637 meters.', image: IMG.HILL },
            { name: 'Nilgiri Mountain Railway', description: 'UNESCO World Heritage toy train experience.', image: IMG.HERITAGE },
            { name: 'Avalanche Lake', description: 'Serene lake with trout fishing and camping options.', image: IMG.HILL }
        ],
        travelCost: 2500, stayCostPerDay: 1800, foodCostPerDay: 900,
        weather: { temp: 15, condition: 'Cold', forecast: getForecast(15) }
    },
    Perambalur: {
        name: 'Perambalur',
        places: [
            { name: 'Ranjankudi Fort', description: '17th-century strategic fort built by the Nawab of Carnatic.', image: IMG.HERITAGE },
            { name: 'Visuvasapuri Dam', description: 'Local scenic spot and important irrigation reservoir.', image: IMG.FOREST },
            { name: 'Ancient Jain Caves', description: 'Rock-cut caves featuring Jain Tirthankaras.', image: IMG.HERITAGE },
            { name: 'Labbaikudikadu', description: 'Historical local township with cultural significance.', image: IMG.HERITAGE },
            { name: 'Kunnam Temples', description: 'Old temples with intricate sculptures and history.', image: IMG.TEMPLE }
        ],
        travelCost: 1400, stayCostPerDay: 1000, foodCostPerDay: 500,
        weather: { temp: 28, condition: 'Dry', forecast: getForecast(28) }
    },
    Pudukkottai: {
        name: 'Pudukkottai',
        places: [
            { name: 'Thirumayam Fort', description: 'Massive 17th-century bastion with panoramic views.', image: IMG.HERITAGE },
            { name: 'Sittanavasal Caves', description: 'Ancient Jain rock-cut cave paintings and beds.', image: IMG.HERITAGE },
            { name: 'Avudaiyarkoil Temple', description: 'Temple known for its unparalleled granite carvings.', image: IMG.TEMPLE },
            { name: 'Government Museum', description: 'Housing ancient artifacts and stone sculptures.', image: IMG.HERITAGE },
            { name: 'Kudumiyanmalai', description: 'Ancient hill temple famous for musical inscriptions.', image: IMG.HILL }
        ],
        travelCost: 1600, stayCostPerDay: 1200, foodCostPerDay: 600,
        weather: { temp: 29, condition: 'Sunny', forecast: getForecast(29) }
    },
    Ramanathapuram: {
        name: 'Ramanathapuram',
        places: [
            { name: 'Rameswaram Temple', description: 'One of the holiest Jyotirlinga shrines located on an island.', image: IMG.TEMPLE },
            { name: 'Dhanushkodi', description: 'Ghost town at the tip of India where the two oceans meet.', image: IMG.BEACH },
            { name: 'Pamban Bridge', description: 'Engineering marvel connecting island to mainland over the sea.', image: IMG.HERITAGE },
            { name: 'APJ Abdul Kalam Memorial', description: 'Dedicated to the former President of India in his hometown.', image: IMG.HERITAGE },
            { name: 'Agni Theertham', description: 'Holy beach where pilgrims take a sacred bath.', image: IMG.BEACH }
        ],
        travelCost: 2200, stayCostPerDay: 1500, foodCostPerDay: 700,
        weather: { temp: 28, condition: 'Breezy', forecast: getForecast(28) }
    },
    Ranipet: {
        name: 'Ranipet',
        places: [
            { name: 'Ratnagiri Murugan Temple', description: 'Ancient hilltop temple with exceptional spiritual energy.', image: IMG.HILL },
            { name: 'Yelagiri Hills', description: 'Serene hill station known for its orchards and roses (nearby).', image: IMG.HILL },
            { name: 'Vellore Fort', description: 'Massive granite fort with a deep moat (nearby).', image: IMG.HERITAGE },
            { name: 'Amirthi Zoological Park', description: 'Tranquil mini zoo and forest park perfect for families.', image: IMG.FOREST }
        ],
        travelCost: 1200, stayCostPerDay: 1000, foodCostPerDay: 500,
        weather: { temp: 27, condition: 'Sunny', forecast: getForecast(27) }
    },
    Salem: {
        name: 'Salem',
        places: [
            { name: 'Yercaud', description: 'The "Poor Man\'s Ooty" known for its lake and coffee estates.', image: IMG.HILL },
            { name: 'Mettur Dam', description: 'One of the largest dams in India on the Kaveri river.', image: IMG.FOREST },
            { name: 'Kiliyur Falls', description: '300ft waterfall that provides a spectacular view in Yercaud.', image: IMG.FOREST },
            { name: 'Kurumbapatti Zoo', description: 'Mini zoo and botanical park ideal for families.', image: IMG.FOREST },
            { name: '1008 Lingam Temple', description: 'Unique temple housing 1008 Shiva Lingams on a hill slope.', image: IMG.TEMPLE }
        ],
        travelCost: 1600, stayCostPerDay: 1300, foodCostPerDay: 700,
        weather: { temp: 22, condition: 'Partly Cloudy', forecast: getForecast(22) }
    },
    Sivaganga: {
        name: 'Sivaganga',
        places: [
            { name: 'Chettinad Palace', description: 'Stunning example of unique architecture and fine woodwork.', image: IMG.HERITAGE },
            { name: 'Pillayarpatti Temple', description: '6th-century rock-cut temple dedicated to Lord Ganesha.', image: IMG.TEMPLE },
            { name: 'Karaikudi', description: 'The cultural capital of Chettinad known for its mansions.', image: IMG.HERITAGE },
            { name: 'Kalaiyarkoil', description: 'Grand historic temple with a rich story of Maruthu brothers.', image: IMG.TEMPLE },
            { name: 'Kundrakudi Temple', description: 'Sacred hill temple dedicated to Lord Murugan.', image: IMG.HILL }
        ],
        travelCost: 1700, stayCostPerDay: 1500, foodCostPerDay: 800,
        weather: { temp: 29, condition: 'Clear', forecast: getForecast(29) }
    },
    Tenkasi: {
        name: 'Tenkasi',
        places: [
            { name: 'Courtallam Main Falls', description: 'The "Spa of South India" known for its medicinal waters.', image: IMG.FOREST },
            { name: 'Five Falls', description: 'Five separate cascades falling side by side in Courtallam.', image: IMG.FOREST },
            { name: 'Old Courtallam', description: 'Original falls path offering a serene bathing experience.', image: IMG.FOREST },
            { name: 'Kasi Viswanathar Temple', description: 'Massive temple with a towering gopuram and spiritual vibes.', image: IMG.TEMPLE },
            { name: 'Papanasam Dam', description: 'Calm reservoir surrounded by the Agasthiyar hills.', image: IMG.FOREST }
        ],
        travelCost: 2200, stayCostPerDay: 1400, foodCostPerDay: 600,
        weather: { temp: 26, condition: 'Pleasant', forecast: getForecast(26) }
    },
    Thanjavur: {
        name: 'Thanjavur',
        places: [
            { name: 'Brihadeeswarar Temple', description: 'UNESCO world heritage Big Temple built by Raja Raja Chola.', image: 'https://images.unsplash.com/photo-1616489953149-83bc9103c080?auto=format&fit=crop&q=80&w=800' },
            { name: 'Thanjavur Palace', description: 'Historic residence of the Nayak and Maratha kings.', image: IMG.HERITAGE },
            { name: 'Saraswathi Mahal Library', description: 'One of the oldest libraries in Asia with rare manuscripts.', image: IMG.HERITAGE },
            { name: 'Schwartz Church', description: '18th-century Danish church built by Rajah Serfoji II.', image: IMG.HERITAGE },
            { name: 'Sivaganga Park', description: 'Popular recreational park with a beautiful central pond.', image: IMG.FOREST }
        ],
        travelCost: 1500, stayCostPerDay: 1400, foodCostPerDay: 700,
        weather: { temp: 28, condition: 'Sunny', forecast: getForecast(28) }
    },
    Theni: {
        name: 'Theni',
        places: [
            { name: 'Meghamalai', description: 'Misty "High Way" mountains famous for tea and cardamom.', image: IMG.HILL },
            { name: 'Suruli Falls', description: 'Two-stage waterfall known for its medicinal properties.', image: IMG.FOREST },
            { name: 'Vaigai Dam', description: 'The lifeline of southern TN with lush gardens (nearby).', image: IMG.FOREST },
            { name: 'Kumbakkarai Falls', description: 'Lesser-known scenic waterfall ideal for nature walks.', image: IMG.FOREST },
            { name: 'Kolukkumalai', description: 'World\'s highest tea estate reachable by Jeep trail tour.', image: IMG.HILL }
        ],
        travelCost: 2000, stayCostPerDay: 1200, foodCostPerDay: 600,
        weather: { temp: 21, condition: 'Mist', forecast: getForecast(21) }
    },
    Thoothukudi: {
        name: 'Thoothukudi',
        places: [
            { name: 'Tuticorin Beach', description: 'Serene coastline perfect for sea-side relaxations.', image: IMG.BEACH },
            { name: 'Hare Island', description: 'Eco-tourism island famous for its local ecosystem.', image: IMG.BEACH },
            { name: 'Our Lady of Snows Basilica', description: '400-year-old sanctuary of stunning architecture.', image: IMG.HERITAGE },
            { name: 'Manapad Church', description: 'Historic church set on a cliff overlooking the sea.', image: IMG.HERITAGE },
            { name: 'Kayalpattinam', description: 'Historic coastal town with unique culture and architecture.', image: IMG.HERITAGE }
        ],
        travelCost: 1800, stayCostPerDay: 1200, foodCostPerDay: 600,
        weather: { temp: 28, condition: 'Breezy', forecast: getForecast(28) }
    },
    Tiruchirappalli: {
        name: 'Tiruchirappalli',
        places: [
            { name: 'Srirangam Temple', description: 'Largest functioning temple complex in the world.', image: IMG.TEMPLE },
            { name: 'Rockfort Temple', description: 'Ancient temple perched on a 273ft high rock.', image: IMG.HERITAGE },
            { name: 'Kallanai Dam', description: 'World\'s oldest stone dam still in use, built by Karikala Chola.', image: IMG.FOREST },
            { name: 'Butterfly Park', description: 'One of the largest butterfly conservatories in Asia.', image: IMG.FOREST },
            { name: 'Puliancholai', description: 'Forest area on the foothills of Kolli Hills with streams.', image: IMG.FOREST }
        ],
        travelCost: 1300, stayCostPerDay: 1500, foodCostPerDay: 800,
        weather: { temp: 29, condition: 'Clear', forecast: getForecast(29) }
    },
    Tirunelveli: {
        name: 'Tirunelveli',
        places: [
            { name: 'Nellaiappar Temple', description: 'Massive Shiva temple featuring a musical pillar hall.', image: IMG.TEMPLE },
            { name: 'Manimuthar Falls', description: 'Scenic waterfall and reservoir in the Western Ghats.', image: IMG.FOREST },
            { name: 'Papanasam', description: 'Spiritual site known for its riverside holy baths.', image: IMG.FOREST },
            { name: 'Agasthiyar Falls', description: 'Pious waterfall where the Tamirabarani river begins.', image: IMG.FOREST }
        ],
        travelCost: 2000, stayCostPerDay: 1200, foodCostPerDay: 600,
        weather: { temp: 28, condition: 'Dry', forecast: getForecast(28) }
    },
    Tirupathur: {
        name: 'Tirupathur',
        places: [
            { name: 'Yelagiri Hills', description: 'Nature’s paradise near Chennai known for its hills and rose gardens.', image: IMG.HILL },
            { name: 'Jalagamparai Waterfalls', description: 'Scenic waterfall created by the River Attaru.', image: IMG.FOREST },
            { name: 'Nature Park', description: 'Well-maintained park with fish aquarium and seasonal garden.', image: IMG.FOREST },
            { name: 'Swamimalai Hills', description: 'Highest point in Yelagiri perfect for trekking.', image: IMG.HILL }
        ],
        travelCost: 1400, stayCostPerDay: 1500, foodCostPerDay: 700,
        weather: { temp: 24, condition: 'Clear', forecast: getForecast(24) }
    },
    Tiruppur: {
        name: 'Tiruppur',
        places: [
            { name: 'Amaravathi Dam', description: 'Popular picnic spot with a crocodile park nearby.', image: IMG.FOREST },
            { name: 'Avinashi Temple', description: 'Ancient temple known for its carvings and local history.', image: IMG.TEMPLE },
            { name: 'Kodiveri Falls', description: 'Scenic water cascades perfect for a day trip (nearby).', image: 'https://images.unsplash.com/photo-1590424072237-7f938f3883a9?auto=format&fit=crop&q=80&w=800' },
            { name: 'Textile Parks', description: 'Explore the massive industrial hub of knitting and exports.', image: IMG.HERITAGE }
        ],
        travelCost: 1500, stayCostPerDay: 1200, foodCostPerDay: 600,
        weather: { temp: 28, condition: 'Clear', forecast: getForecast(28) }
    },
    Tiruvallur: {
        name: 'Tiruvallur',
        places: [
            { name: 'Veera Raghava Perumal Temple', description: 'Ancient Vaishnavaite shrine with healing significance.', image: IMG.TEMPLE },
            { name: 'Pulicat Lake', description: 'Second largest brackish water lake in India.', image: IMG.FOREST },
            { name: 'Pulicat Bird Sanctuary', description: 'Haven for flamingoes and migratory birds.', image: IMG.FOREST },
            { name: 'Tiruttani Murugan Temple', description: 'One of the six abodes of Lord Murugan on a hill.', image: IMG.HILL }
        ],
        travelCost: 1000, stayCostPerDay: 1100, foodCostPerDay: 500,
        weather: { temp: 27, condition: 'Clear', forecast: getForecast(27) }
    },
    Tiruvannamalai: {
        name: 'Tiruvannamalai',
        places: [
            { name: 'Arunachaleswarar Temple', description: 'One of the largest temples in India representing the element of Fire.', image: IMG.TEMPLE },
            { name: 'Arunachala Hill', description: 'Sacred hill considered as a manifestation of Shiva.', image: IMG.HILL },
            { name: 'Ramana Ashram', description: 'Spiritual center established by the sage Ramana Maharshi.', image: IMG.HERITAGE },
            { name: 'Skandashram', description: 'Cave ashram where Ramana Maharshi stayed.', image: IMG.HILL },
            { name: 'Gingee Fort', description: 'The "Troy of the East" - an impregnable fortress (nearby).', image: IMG.HERITAGE }
        ],
        travelCost: 1500, stayCostPerDay: 1300, foodCostPerDay: 600,
        weather: { temp: 28, condition: 'Partly Cloudy', forecast: getForecast(28) }
    },
    Tiruvarur: {
        name: 'Tiruvarur',
        places: [
            { name: 'Thyagaraja Temple', description: 'Home to the world\'s largest and heaviest temple car.', image: IMG.TEMPLE },
            { name: 'Kamalalayam Tank', description: 'Massive sacred tank within the temple complex.', image: IMG.FOREST },
            { name: 'Muthupet Mangrove Forest', description: 'Vast ecological area of lagoon and mangroves.', image: IMG.FOREST },
            { name: 'Koothanur Saraswathi Temple', description: 'Only separate temple for Goddess Saraswathi in TN.', image: IMG.TEMPLE }
        ],
        travelCost: 1600, stayCostPerDay: 1100, foodCostPerDay: 500,
        weather: { temp: 27, condition: 'Humid', forecast: getForecast(27) }
    },
    Vellore: {
        name: 'Vellore',
        places: [
            { name: 'Vellore Fort', description: 'Powerful 16th-century fort made of granite with a massive moat.', image: IMG.HERITAGE },
            { name: 'Sripuram Golden Temple', description: 'Stunning spiritual oasis covered with 1,500kg of pure gold.', image: IMG.HERITAGE },
            { name: 'Yelagiri Hills', description: 'Serene hill station known for its healthy climate (nearby).', image: IMG.HILL },
            { name: 'Jalakandeswarar Temple', description: 'Ancient temple within the fort known for its exquisite carvings.', image: IMG.TEMPLE }
        ],
        travelCost: 1300, stayCostPerDay: 1400, foodCostPerDay: 700,
        weather: { temp: 29, condition: 'Clear', forecast: getForecast(29) }
    },
    Viluppuram: {
        name: 'Viluppuram',
        places: [
            { name: 'GINGEE FORT', description: 'One of the most impregnable forts in India, often called the Troy of the East.', image: '/assets/images/viluppuram/gingee_fort.jpg' },
            { name: 'AUROVILLE', description: 'Experimental township and spiritual destination dedicated to human unity.', image: '/assets/images/viluppuram/auroville.png' },
            { name: 'VEEDUR DAM', description: 'Scenic irrigation dam and park, ideal for weekend picnics.', image: '/assets/images/viluppuram/veedur_dam.png' },
            { name: 'ARULMIGU MAILAM MURUGAN TEMPLE', description: 'Revered hilltop temple dedicated to Lord Murugan with ancient history.', image: '/assets/images/viluppuram/mailam_temple.png' }
        ],
        travelCost: 1400, stayCostPerDay: 1300, foodCostPerDay: 600,
        weather: { temp: 28, condition: 'Clear', forecast: getForecast(28) }
    },
    Virudhunagar: {
        name: 'Virudhunagar',
        places: [
            { name: 'SRIVILLIPUTHUR ANDAL KOVIL', description: 'Iconic temple tower which is the official emblem of Tamil Nadu Government.', image: '/assets/images/virudhunagar/andal_kovil_1.png' },
            { name: 'Vidhynathan Swamy Temple', description: 'Ancient spiritual sanctuary known for its serene and powerful atmosphere.', image: '/assets/images/virudhunagar/andal_kovil_2.jpg' },
            { name: 'PILAVAKKAL DAM', description: 'Scenic irrigation dam located at the foothills of the Western Ghats.', image: '/assets/images/virudhunagar/pilavakkal_dam.png' },
            { name: 'AYYANAR FALLS', description: 'Breathtaking waterfall set amidst lush green forests.', image: '/assets/images/virudhunagar/ayyanar_falls.jpg' },
            { name: 'SENBAGA THOPPU', description: 'Ecological hotspot and wildlife sanctuary known for its rich biodiversity.', image: '/assets/images/virudhunagar/senbaga_thoppu.png' }
        ],
        travelCost: 1800, stayCostPerDay: 1100, foodCostPerDay: 500,
        weather: { temp: 30, condition: 'Sunny', forecast: getForecast(30) }
    }
};

// Automatically enhance all places in mockLocations with metadata
Object.keys(mockLocations).forEach(key => {
    if (mockLocations[key].places) {
        mockLocations[key].places = enhancePlaces(mockLocations[key].places);
    }
});
