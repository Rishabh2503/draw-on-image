# Paint On Image

A React-based web application that allows users to paint on images and generate masks. Built with React and Tailwind CSS. Use this to edit PC for college😂

## Features
- Image upload with drag & drop support
- Canvas-based painting interface
- Adjustable brush size
- Mask generation
- Dark mode support
- Responsive design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup
1. Clone and install dependencies:

```bash
git clone url
cd image-inpainting
npm install   
```

2. Start development server:

```bash
npm run dev  
```

The application will be available at `http://localhost:5173`
## Demo Link - https://draw-on-image-phi.vercel.app/

## Development Challenges & Solutions

### Canvas Scaling Issues
**Challenge**: The canvas drawing coordinates weren't aligning with the mouse cursor, especially on different screen sizes.

**Solution**: Implemented proper scaling calculations using `getBoundingClientRect()` and maintaining aspect ratio:javascript
const rect = canvas.getBoundingClientRect();
const scaleX = canvas.width / rect.width;
const scaleY = canvas.height / rect.height;
Visit `http://localhost:5173`

## Tech Stack & Libraries
- React (Frontend framework)
- Tailwind CSS (Styling)
- React Icons (UI icons)
- HTML5 Canvas API (Drawing functionality)

## Development Challenges & Solutions

### 1. Canvas Scaling Issues
Initially, the canvas drawing coordinates weren't aligning with the mouse cursor. Solved by implementing proper scaling calculations:
### 2. Image Resizing
Needed to fit uploaded images within canvas while maintaining aspect ratio.

### 3. Responsive Canvas
Made canvas responsive while maintaining drawing quality using resize event listener:

## Future Improvements
- Touch device support
- Multiple brush types
- Undo/Redo functionality
- Image filters
- Save drawing progress

## Contributing
Feel free to submit issues and enhancement requests.
