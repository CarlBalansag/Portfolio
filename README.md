# Carl Balansag - Portfolio

A minimalist, artistic portfolio website built with Next.js, React, TypeScript, and Tailwind CSS. Features sophisticated generative art and particle animations inspired by [soulwire.co.uk](https://soulwire.co.uk/), with an emphasis on creative coding and interactive design.

## Features

- 🎨 **Generative Art Canvas** - Flow field-based particle system with organic movement
- ✨ **Interactive Animation** - Particles respond to mouse movement and clicks
- 🌊 **Smooth Transitions** - Elegant page animations with Framer Motion
- 🎯 **Minimalist Design** - Clean typography and layout that lets the animation shine
- 📱 **Fully Responsive** - Optimized for all screen sizes
- 🌙 **Dark Theme** - Sophisticated black background with cyan accents
- ⚡ **Performance** - Built with Next.js 15 for optimal performance
- 💻 **TypeScript** - Full type safety throughout the codebase

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd Portfolio
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Design Philosophy

This portfolio embraces a minimalist aesthetic inspired by creative coding portfolios like soulwire.co.uk:

- **Canvas as Hero** - The generative art animation is the centerpiece
- **Typography** - Clean, light fonts with ample spacing
- **Interaction** - Subtle, meaningful interactions that enhance the experience
- **Color** - Monochromatic with cyan accent for focus
- **White Space** - Strategic use of negative space for breathing room

## Customization

### Personal Information

Edit the following files to update your content:

- `components/sections/Hero.tsx` - Update name, title, and introduction
- `components/sections/Work.tsx` - Add your projects with descriptions
- `components/sections/AboutMinimal.tsx` - Update bio and skills
- `components/sections/ContactMinimal.tsx` - Update social links and contact info

### Animation System

Customize the creative canvas in `components/CreativeCanvas.tsx`:

- **Flow Field** - Adjust resolution and update frequency
- **Particles** - Modify count, size, lifetime, and colors
- **Interactions** - Change mouse repulsion/attraction behavior
- **Visual Style** - Adjust trails, connections, and gradients
- **Performance** - Tune particle count based on screen size

### Styling

- `app/globals.css` - Global styles, scrollbar, and selection colors
- Individual component files - Section-specific styling
- `tailwind.config.ts` - Tailwind configuration

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and deploy

### Other Platforms

You can also deploy to:
- Netlify
- AWS Amplify
- Railway
- Any platform that supports Next.js

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library for smooth transitions
- **Canvas API** - Generative art and particle system
- **Flow Fields** - Organic particle movement patterns

## License

This project is open source and available under the MIT License.

## Contact

Carl Balansag - [email protected]

Project Link: [https://github.com/CarlBalansag/Portfolio](https://github.com/CarlBalansag/Portfolio)
