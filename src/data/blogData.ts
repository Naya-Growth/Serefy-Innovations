export interface Author {
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
  role?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML or Markdown
  featuredImage: string;
  author: Author;
  publishDate: string;
  category: string;
  tags: string[];
  readTime: string;
}

export const authorsData: Record<string, Author> = {
  'dr-vidhya-sharma': {
    name: 'Dr. Vidhya Sharma',
    slug: 'dr-vidhya-sharma',
    bio: 'Avian Specialist with over 15 years of experience in modern incubation technologies and poultry health management.',
    role: 'Chief Avian Specialist',
    avatar: 'V'
  },
  'aditya-patel': {
    name: 'Aditya Patel',
    slug: 'aditya-patel',
    bio: 'Agricultural technology researcher focused on sustainable energy solutions for rural farming.',
    role: 'Agri-Tech Researcher',
    avatar: 'A'
  }
};

export const categoriesData = [
  'All', 
  'Technology', 
  'Guide', 
  'Business', 
  'Sustainability', 
  'Education', 
  'Industry'
];

export const mockArticles: Article[] = [
  {
    id: '1',
    slug: 'achieving-90-hatch-rates-science-behind-sere-technology',
    title: 'Achieving 90% Hatch Rates: The Science Behind SERE Technology',
    excerpt: 'Discover how precision temperature control and automated humidity management can dramatically improve your poultry farming outcomes.',
    content: `
      <p class="mb-6">In modern poultry farming, achieving a high hatch rate is crucial for profitability. The difference between a 75% and a 90% hatch rate can mean thousands of additional healthy chicks over a year. SERE Technology's advanced incubation systems utilize precision sensors to maintain an optimal environment.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">The Importance of Precision</h2>
      <p class="mb-6">Even a fluctuation of 0.5°C can impact embryo development. Our systems ensure temperature remains constant across all tiers of the incubator, avoiding the cold and hot spots common in traditional machines. The precision is achieved through our proprietary airflow algorithms which constantly monitor and adjust the micro-climate around each egg.</p>
      
      <div class="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 my-8">
        <h3 class="font-bold text-emerald-800 mb-2">Key Takeaway</h3>
        <p class="text-emerald-700">Consistency is the secret to high hatch rates. Automated systems eliminate human error, ensuring a perfect environment 24/7.</p>
      </div>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">Humidity Management</h2>
      <p class="mb-6">Automated humidity control is equally vital, especially during the final days of incubation. We will explore how maintaining the correct wet-bulb temperature leads to stronger, healthier chicks. During the 'lockdown' phase (days 18-21), humidity must be elevated to prevent the egg membranes from drying out and trapping the chick.</p>
      
      <img src="/media/Machine process/IMG_4238.jpg" alt="Incubation process" class="w-full rounded-2xl my-8 object-cover h-64 shadow-md" />
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">Conclusion</h2>
      <p>By upgrading to smart technology, farmers not only see an immediate increase in their hatch rates but also produce more robust chicks with lower early mortality rates.</p>
    `,
    featuredImage: '/media/sere-120.webp',
    author: authorsData['dr-vidhya-sharma'],
    publishDate: '2024-01-15',
    category: 'Technology',
    tags: ['Incubation', 'Temperature Control', 'Hatch Rates'],
    readTime: '5 min read'
  },
  {
    id: '2',
    slug: 'small-scale-poultry-farming-complete-guide',
    title: 'Small-Scale Poultry Farming: A Complete Guide to Getting Started',
    excerpt: 'Everything you need to know about setting up your first poultry farm, from equipment selection to market strategies.',
    content: `
      <p class="mb-6">Starting a small-scale poultry farm is an excellent way to generate sustainable income. However, it requires careful planning, the right equipment, and an understanding of the local market.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">Choosing the Right Equipment</h2>
      <p class="mb-6">For beginners, investing in a reliable incubator is the first step. The SERE-120 is perfect for starting out, offering professional-grade features in a compact size.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">Market Strategies</h2>
      <p class="mb-6">We'll discuss how to identify your target market—whether it's selling day-old chicks, table eggs, or mature birds—and how to build relationships with local buyers.</p>
    `,
    featuredImage: '/media/happy-poultry-farmer.png',
    author: authorsData['aditya-patel'],
    publishDate: '2024-01-10',
    category: 'Guide',
    tags: ['Beginners', 'Equipment', 'Business Plan'],
    readTime: '7 min read'
  },
  {
    id: '3',
    slug: 'economics-of-automated-incubation-roi',
    title: 'The Economics of Automated Incubation: ROI Breakdown',
    excerpt: 'A detailed analysis of how investing in smart incubation technology can transform your poultry business economics.',
    content: `
      <p class="mb-6">Investing in smart incubation technology might seem like a large upfront cost, but the return on investment (ROI) is realized much faster than traditional methods.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">Labor Cost Reduction</h2>
      <p class="mb-6">Automated systems reduce the need for manual egg turning, temperature checking, and water refilling. This allows you to scale your operation without proportionally increasing your labor costs.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">Increased Output</h2>
      <p class="mb-6">With hatch rates consistently above 85%, the number of sellable chicks increases significantly, directly boosting your bottom line within the first few batches.</p>
    `,
    featuredImage: '/media/Machine%20process/IMG_4238.jpg',
    author: authorsData['dr-vidhya-sharma'],
    publishDate: '2024-01-05',
    category: 'Business',
    tags: ['ROI', 'Economics', 'Scaling'],
    readTime: '6 min read'
  },
  {
    id: '4',
    slug: 'solar-powered-poultry-sustainable-farming',
    title: 'Solar-Powered Poultry: Sustainable Farming for Rural India',
    excerpt: 'How renewable energy integration is making smart poultry farming accessible and sustainable across rural communities.',
    content: `
      <p class="mb-6">In many rural areas, inconsistent power supply is the biggest hurdle to successful incubation. A power cut of just a few hours can ruin an entire batch of eggs.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">The Solar Solution</h2>
      <p class="mb-6">Integrating solar power with battery backup ensures uninterrupted operation. SERE incubators are designed to be highly energy-efficient, making them perfect for solar integration.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">Environmental Impact</h2>
      <p class="mb-6">Beyond reliability, solar-powered farming significantly reduces the carbon footprint of your operation, leading the way for sustainable agriculture in India.</p>
    `,
    featuredImage: '/media/sere-120.webp',
    author: authorsData['aditya-patel'],
    publishDate: '2023-12-28',
    category: 'Sustainability',
    tags: ['Solar Power', 'Rural Farming', 'Sustainability'],
    readTime: '4 min read'
  },
  {
    id: '5',
    slug: 'understanding-egg-incubation-basics',
    title: 'Understanding Egg Incubation: Temperature and Humidity Basics',
    excerpt: 'The fundamental principles of egg incubation explained in simple terms for beginners and experienced farmers alike.',
    content: `
      <p class="mb-6">Successful incubation rests on four pillars: temperature, humidity, ventilation, and turning. Mastering these basics is essential for any poultry farmer.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">Temperature: The Engine of Growth</h2>
      <p class="mb-6">Maintaining a temperature of 37.5°C is critical. We explain how this temperature mimics the natural body heat of a brooding hen and drives cellular development.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">Humidity: Managing Moisture Loss</h2>
      <p class="mb-6">Eggs need to lose a specific percentage of their weight during incubation. Correct humidity levels control this moisture loss, ensuring the chick doesn't stick to the shell or drown in excess fluid.</p>
    `,
    featuredImage: '/media/happy-poultry-farmer.png',
    author: authorsData['dr-vidhya-sharma'],
    publishDate: '2023-12-20',
    category: 'Education',
    tags: ['Basics', 'Temperature', 'Humidity'],
    readTime: '8 min read'
  },
  {
    id: '6',
    slug: 'evolution-of-poultry-farming-in-india',
    title: 'From Traditional to Smart: Evolution of Poultry Farming in India',
    excerpt: 'Tracing the journey of Indian poultry farming from manual methods to AI-powered precision systems.',
    content: `
      <p class="mb-6">Poultry farming in India was traditionally a backyard activity. Manual incubation using heated sand or natural brooding was the norm, leading to unpredictable results.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">The Industrial Shift</h2>
      <p class="mb-6">The introduction of large-scale commercial farming changed the landscape, but it also centralized production, leaving rural farmers behind.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">The Smart Revolution</h2>
      <p class="mb-6">Today, IoT and AI are democratizing precision farming. Smart, affordable incubators like SERE are enabling decentralized, high-efficiency farming across the country.</p>
    `,
    featuredImage: '/media/Machine%20process/IMG_4238.jpg',
    author: authorsData['aditya-patel'],
    publishDate: '2023-12-15',
    category: 'Industry',
    tags: ['History', 'IoT', 'Smart Farming'],
    readTime: '5 min read'
  }
];
