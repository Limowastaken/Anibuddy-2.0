# AnimeList - Discover Amazing Anime

A comprehensive mobile-first web application for discovering and exploring anime, powered by the Jikan API. Built with modern web technologies and featuring a sophisticated dark blue and purple theme.

## Features

### 🏠 **Main Feed (index.html)**
- **Infinite Scrolling**: Continuously loads anime as you scroll
- **Real-time Search**: Search anime by title with live results
- **Genre Filtering**: Filter anime by multiple genres
- **Interactive Cards**: Hover effects and smooth animations
- **Favorites System**: Save your favorite anime locally
- **Visual Effects**: Particle background animations with PIXI.js

### 📊 **Anime Details (details.html)**
- **Comprehensive Information**: Detailed anime data including synopsis, characters, staff
- **High-Quality Images**: Large cover images and character artwork
- **Related Anime**: Discover similar anime recommendations
- **Interactive Elements**: Expandable text sections and image carousels
- **Responsive Design**: Optimized for mobile viewing

### 🏆 **Rankings (rankings.html)**
- **Interactive Charts**: Visual data representation with ECharts.js
- **Multiple Categories**: Top Anime, Currently Airing, Upcoming, TV, Movies, OVA
- **Real-time Rankings**: Live data from Jikan API
- **Beautiful Visualizations**: Animated bar charts and ranking lists

## Technical Stack

### **Frontend Technologies**
- **HTML5**: Semantic markup and responsive design
- **Tailwind CSS**: Utility-first CSS framework
- **Vanilla JavaScript**: Modern ES6+ features

### **Animation & Visual Libraries**
- **Anime.js**: Smooth micro-interactions and transitions
- **PIXI.js**: Particle effects and background animations
- **ECharts.js**: Interactive data visualizations
- **Splide**: Image carousels and galleries

### **API Integration**
- **Jikan API v4**: Unofficial MyAnimeList API
- **Rate Limiting**: Respects API limits (60 requests/minute)
- **Caching**: 24-hour cache for optimal performance
- **Error Handling**: Graceful fallbacks for API failures

## Design System

### **Color Palette**
- **Primary**: Deep Navy Blue (#1a1a2e)
- **Secondary**: Rich Purple (#16213e)
- **Accent**: Electric Blue (#00d4ff)
- **Supporting**: Soft Purple (#6b5b95)

### **Typography**
- **Primary Font**: Inter (UI elements)
- **Secondary Font**: Poppins (headings)
- **Accent Font**: JetBrains Mono (data/numbers)

### **Visual Effects**
- **Particle Background**: Floating geometric shapes
- **Card Animations**: Staggered loading and hover effects
- **Gradient Overlays**: Smooth color transitions
- **Glassmorphism**: Blurred backgrounds and modern aesthetics

## Mobile Optimization

### **Touch Interactions**
- **Swipe Gestures**: Navigate through content
- **Pull-to-Refresh**: Update anime data
- **Touch-Friendly**: Minimum 44px touch targets
- **Responsive Grid**: Adaptive layout for all screen sizes

### **Performance**
- **Lazy Loading**: Progressive image loading
- **Image Optimization**: WebP format with fallbacks
- **Smooth Animations**: GPU-accelerated transitions
- **Battery Efficient**: Optimized for mobile devices

## File Structure

```
/
├── index.html          # Main anime feed with infinite scrolling
├── details.html        # Anime detail page
├── rankings.html       # Rankings and statistics
├── main.js            # Core JavaScript functionality
├── resources/         # Local assets
│   ├── hero_background.png
│   ├── anime_characters.png
│   └── geometric_pattern.png
└── README.md          # Project documentation
```

## Usage

### **Getting Started**
1. Open `index.html` in a web browser
2. Use the search bar to find specific anime
3. Tap genre chips to filter by category
4. Scroll down to load more anime automatically
5. Tap any anime card to view detailed information

### **Navigation**
- **Home**: Main anime discovery feed
- **Rankings**: Top anime across different categories
- **Favorites**: Your saved anime (coming soon)

### **Interactions**
- **Tap Cards**: View detailed anime information
- **Heart Icon**: Add anime to favorites
- **Genre Chips**: Filter by anime genres
- **Search**: Real-time anime title search

## API Reference

### **Jikan API Endpoints**
- `/top/anime` - Get top-ranked anime
- `/anime/{id}` - Get detailed anime information
- `/anime?q={query}` - Search anime by title
- `/genres/anime` - Get anime genres
- `/seasons/now` - Get currently airing anime

### **Data Management**
- **Local Storage**: Favorites and user preferences
- **Session Storage**: Current search and filter state
- **Cache Strategy**: Optimized API request caching

## Browser Support

### **Modern Browsers**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### **Mobile Browsers**
- iOS Safari 13+
- Chrome Mobile 80+
- Samsung Internet 12+

## Performance Features

### **Loading Optimization**
- **Skeleton Screens**: Smooth loading states
- **Progressive Enhancement**: Core functionality first
- **Image Lazy Loading**: Load images as needed
- **Code Splitting**: Modular JavaScript architecture

### **Accessibility**
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: WCAG compliant color ratios
- **Focus Management**: Clear focus indicators

## Future Enhancements

### **Planned Features**
- User authentication and profiles
- Personal anime lists and tracking
- Advanced filtering and sorting
- Social features and sharing
- Offline reading capability
- Push notifications for new episodes

### **Technical Improvements**
- Service worker implementation
- Web app manifest
- Advanced caching strategies
- Performance monitoring
- Error tracking and analytics

## Development

### **Local Development**
```bash
# Serve locally using Python
python -m http.server 8000

# Or using Node.js
npx serve .

# Or using PHP
php -S localhost:8000
```

### **Deployment**
The application is designed as a static website and can be deployed to any web server or CDN.

## License

This project is built using the Jikan API which is provided under MIT License. All anime data and images are property of their respective owners.

---

**Built with ❤️ for the anime community**