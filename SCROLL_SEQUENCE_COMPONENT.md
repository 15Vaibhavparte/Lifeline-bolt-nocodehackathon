# Scroll-Driven Image Sequence Component

## Overview
The `ScrollDrivenImageSequence` component creates an interactive scroll-driven animation system that displays image frames based on scroll position within the component. It's designed to create smooth, engaging storytelling experiences for showcasing processes and workflows.

## Features

### Core Functionality
- **Smooth Frame Transitions**: Uses Framer Motion with spring animations for fluid frame changes
- **Internal Scrolling**: Scroll area is contained within the component, not dependent on window scroll
- **Preloading**: All images are preloaded for seamless playback
- **Responsive Design**: Adapts to different screen sizes and devices
- **Accessibility**: Includes proper alt text and scroll indicators

### Enhanced User Experience
- **Custom Scrollbar**: Styled scrollbar with Lifeline branding
- **Progress Indicators**: Shows current frame and overall progress
- **Scroll Hints**: Animated indicators guide user interaction
- **Smooth Controls**: Enhanced scroll sensitivity and momentum for better control
- **Visual Feedback**: Frame counter and progress bar provide clear feedback

### Technical Features
- **Performance Optimized**: Uses `willChange` and `imageRendering` for smooth animations
- **TypeScript Support**: Fully typed interface with proper error handling
- **Mobile Optimized**: Touch scrolling with momentum for iOS devices
- **Frame Interpolation**: Smooth transitions between frames using spring physics

## Usage

### Basic Implementation
```tsx
import { ScrollDrivenImageSequence } from '../components/ScrollDrivenImageSequence';
import { sequenceConfigs } from '../utils/imageSequences';

// Use a predefined sequence
<ScrollDrivenImageSequence
  images={sequenceConfigs.aiMatching.frames}
  frameHeight={350}
  containerClassName="shadow-2xl"
  className="hover:scale-105 transition-transform duration-300"
/>
```

### Custom Sequence
```tsx
const customFrames = [
  { src: '/path/to/frame001.jpg', alt: 'Process step 1' },
  { src: '/path/to/frame002.jpg', alt: 'Process step 2' },
  // ... more frames
];

<ScrollDrivenImageSequence
  images={customFrames}
  frameHeight={400}
  scrollMultiplier={1.5}
  containerClassName="custom-styling"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `ImageFrame[]` | Required | Array of image objects with src and alt |
| `frameHeight` | `number` | `400` | Height of the image display area in pixels |
| `className` | `string` | `''` | CSS classes for the image container |
| `containerClassName` | `string` | `''` | CSS classes for the outer container |
| `scrollMultiplier` | `number` | `1.2` | Controls scroll sensitivity (higher = more sensitive) |

## Image Frame Interface
```typescript
interface ImageFrame {
  src: string;     // Image URL or path
  alt?: string;    // Alternative text for accessibility
}
```

## Styling

### Custom Scrollbar
The component includes custom scrollbar styling that matches the Lifeline brand:
- Red gradient thumb (#DC2626 to #B91C1C)
- Thin scrollbar (6px width)
- Smooth hover effects
- Cross-browser compatibility

### Animation States
- **Loading**: Spinner with branded colors
- **Scrolling**: Enhanced brightness and scale effects
- **Progress**: Animated progress bar with glow effects
- **Completion**: Visual feedback when reaching the end

## Performance Considerations

### Image Optimization
- **Preloading**: All images are loaded before playback begins
- **Format**: Optimized for JPG sequences (as specified)
- **Lazy Loading**: Component itself can be lazy-loaded
- **Memory Management**: Efficient image handling for long sequences

### Scroll Performance
- **Debouncing**: Frame updates are debounced to prevent excessive renders
- **requestAnimationFrame**: Smooth animation frame handling
- **GPU Acceleration**: Uses transform properties for hardware acceleration

## Accessibility

### WCAG Compliance
- **Alt Text**: Proper alternative text for all images
- **Keyboard Navigation**: Scrollable with keyboard
- **Screen Readers**: Descriptive frame indicators
- **Reduced Motion**: Respects user motion preferences

### User Guidance
- **Visual Hints**: Clear scroll indicators and progress bars
- **Text Feedback**: Frame counters and completion messages
- **Animation Cues**: Smooth transitions guide user attention

## Production Setup

### Real Image Sequences
For production use with actual JPG sequences:

```typescript
// Replace placeholder with real images
export const productionSequences = {
  aiMatching: Array.from({ length: 65 }, (_, i) => ({
    src: `/assets/sequences/ai-matching/frame-${String(i + 1).padStart(3, '0')}.jpg`,
    alt: `AI Matching process step ${i + 1}`
  })),
  // ... other sequences
};
```

### Optimization Tips
1. **Image Compression**: Use optimized JPGs (quality 80-85)
2. **Consistent Dimensions**: All frames should be the same size
3. **Sequential Naming**: Use padded numbers (001, 002, etc.)
4. **CDN Delivery**: Host images on a fast CDN for best performance

## Integration with Lifeline

The component is integrated into the "Why Choose Lifeline?" section of the homepage, showcasing:

1. **AI-Powered Matching** (25 frames): Shows the AI matching process
2. **Blockchain Verification** (20 frames): Demonstrates security features  
3. **Voice Interface** (15 frames): Highlights accessibility features
4. **Emergency Response** (30 frames): Shows real-time alert system

Each sequence tells a visual story that helps users understand Lifeline's technology and capabilities.

## Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+
- **Scroll Behavior**: Enhanced on browsers with smooth scrolling support
- **Animations**: Graceful degradation for older browsers

## Future Enhancements

### Planned Features
- **Touch Gestures**: Swipe controls for mobile devices
- **Keyboard Controls**: Arrow key navigation
- **Auto-play**: Optional automatic progression
- **Sound Integration**: Audio narration sync
- **Variable Speed**: User-controlled playback speed

### Advanced Options
- **Branching Sequences**: Multiple story paths
- **Interactive Hotspots**: Clickable elements within frames
- **3D Effects**: Parallax and depth animations
- **Multi-sequence Sync**: Synchronized multiple sequences
