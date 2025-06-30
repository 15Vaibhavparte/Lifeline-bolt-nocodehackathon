import { ScrollDrivenImageSequence } from '../components/ScrollDrivenImageSequence';

// Simple test sequence with SVG data URIs instead of external placeholder images
const testImages = [
  { src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23F59E0B"/><text x="300" y="200" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">Frame 1 - Start</text></svg>', alt: 'Test frame 1' },
  { src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%233B82F6"/><text x="300" y="200" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">Frame 2 - Progress</text></svg>', alt: 'Test frame 2' },
  { src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23059669"/><text x="300" y="200" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">Frame 3 - Continue</text></svg>', alt: 'Test frame 3' },
  { src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23DC2626"/><text x="300" y="200" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">Frame 4 - Final</text></svg>', alt: 'Test frame 4' },
];

export function TestScrollSequence() {
  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Scroll-Driven Image Sequence Test</h1>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Test Sequence (4 frames)</h2>
          <ScrollDrivenImageSequence
            images={testImages}
            frameHeight={300}
            containerClassName="shadow-lg"
            scrollMultiplier={1.0}
          />
        </div>

        <div className="text-center text-gray-600">
          <p>Scroll within the image container above to see frame transitions.</p>
        </div>
      </div>
    </div>
  );
}

export default TestScrollSequence;
