# Design Guidelines - Portfolio E-Commerce (Instagram-Inspired Dark Theme)

## Design Approach
**Reference-Based Design**: Instagram-inspired interface with dark, elegant aesthetics optimized for mobile-first experience with fluid navigation and seamless interactions.

## Core Design Elements

### A. Color Palette

**Dark Mode Foundation:**
- Background Primary: 0 0% 10% (rich dark background)
- Background Secondary: 0 0% 14% (card/post containers)
- Background Tertiary: 0 0% 18% (elevated elements, modals)
- Border Subtle: 0 0% 25% (dividers, card borders)

**Text Colors:**
- Primary Text: 0 0% 95% (headings, post titles)
- Secondary Text: 0 0% 70% (descriptions, metadata)
- Muted Text: 0 0% 50% (timestamps, auxiliary info)

**Brand/Accent:**
- Primary Action: 220 90% 56% (elegant blue for CTAs, links)
- Primary Hover: 220 90% 48%
- Success/Confirmation: 142 71% 45% (WhatsApp green for send buttons)
- Destructive: 0 72% 51% (delete actions)

### B. Typography

**Font Stack:**
- Primary: 'Inter' via Google Fonts - clean, modern sans-serif
- Monospace: 'JetBrains Mono' for code/technical elements if needed

**Type Scale:**
- Hero/Page Title: text-2xl md:text-3xl font-bold (24-30px)
- Post Title: text-lg md:text-xl font-semibold (18-20px)
- Body Text: text-sm md:text-base (14-16px)
- Metadata/Labels: text-xs md:text-sm (12-14px)
- Button Text: text-sm font-medium (14px)

### C. Layout System

**Spacing Primitives:**
Core spacing units: 2, 3, 4, 6, 8, 12, 16 (e.g., p-4, gap-6, mt-8)

**Mobile-First Grid:**
- Feed Container: max-w-2xl mx-auto px-4
- Post Cards: w-full with rounded-lg borders
- Admin Grid: grid-cols-1 md:grid-cols-2 gap-4
- Product Grid: grid-cols-1 sm:grid-cols-2 gap-4

**Consistent Vertical Rhythm:**
- Section Padding: py-6 md:py-8
- Card Spacing: space-y-6
- Component Gaps: gap-4 to gap-6

### D. Component Library

**Instagram-Style Post Card:**
- Rounded container (rounded-lg) with subtle border
- Square/4:3 aspect ratio image with rounded-t-lg
- Post header: avatar placeholder + username/project name
- Description area with max-height and "ver mais" expansion
- Pricing badge with currency formatting (R$ XXX/mês)
- "Adicionar ao Carrinho" button (full-width, primary color)
- Like/share icons (optional, Instagram aesthetic)

**Navigation:**
- Top sticky bar with logo/title (left), "Projetos Personalizados" button (right)
- Bottom mobile navigation if needed (fixed bottom bar)
- Shopping cart icon with badge counter (top-right)

**Buttons:**
- Primary: bg-blue rounded-lg px-6 py-3 font-medium
- Secondary: border border-gray-600 rounded-lg px-6 py-3
- Ghost: text-blue hover:bg-white/5 rounded-lg px-4 py-2
- Icon buttons: rounded-full p-2 hover:bg-white/10

**Forms (Cart/Custom Projects):**
- Dark input fields with border-gray-600
- Rounded-lg borders, px-4 py-3
- Focus state: border-blue ring-1 ring-blue
- Labels above inputs (text-sm text-gray-400)
- Payment method selector: radio cards with icons

**Admin Panel:**
- Sidebar navigation (desktop) or top tabs (mobile)
- Data table with hover states for posts
- Inline editing with modal overlays
- Image URL input fields with preview
- WhatsApp number configuration field

**Modal/Overlays:**
- Dark backdrop (bg-black/60 backdrop-blur-sm)
- Centered modal with max-w-lg
- Slide-up animation on mobile
- Close button (top-right X icon)

**Cart Drawer:**
- Slide-in from right (desktop) or bottom (mobile)
- Item list with thumbnail, title, price
- Quantity adjustment (+/- buttons)
- Total calculation sticky at bottom
- WhatsApp send button (green with icon)

### E. Animations

**Micro-interactions (Subtle):**
- Card hover: subtle scale (hover:scale-[1.02]) + shadow increase
- Button press: scale-[0.98] active state
- Cart icon: bounce animation on item add
- Page transitions: fade-in opacity-0 to opacity-100

**Navigation:**
- Smooth scroll behavior
- Modal slide-in: translate-y-4 to translate-y-0
- Drawer slide: translate-x-full to translate-x-0

**Loading States:**
- Skeleton loaders for posts (pulsing gray rectangles)
- Spinner for form submissions

## Images

**Hero Section:** 
Featured project showcase at top - full-width image banner (16:9 aspect ratio) with gradient overlay and centered text. Display main portfolio title and tagline.

**Post Images:**
Each publication displays a single featured image (square or 4:3 ratio), hosted via URL. Images should have rounded-t-lg corners matching card container.

**Example Post Content:**
Create sample post for "Menu Interativo" project:
- Image: Screenshot of the menu interface
- Title: "Sistema Menu Interativo - Restaurantes"
- Description: "Cardápio digital completo com gestão de pedidos, integração WhatsApp e painel administrativo. Desenvolvido com React e Supabase. [Ver demo](https://menu-interativo.onrender.com/)"
- Price: "R$ 150/mês"

**Admin Area:**
Simple, functional interface - no decorative imagery needed. Focus on data tables and forms.

## Key Design Principles

1. **Mobile-First Excellence**: Every interaction optimized for touch, thumb-friendly zones
2. **Instagram Familiarity**: Users feel immediately comfortable with interface patterns
3. **Dark Elegance**: Sophisticated color scheme that reduces eye strain
4. **Fluid Performance**: Smooth 60fps scrolling, minimal layout shifts
5. **Content Focus**: Posts are hero elements, UI stays minimal and supportive
6. **WhatsApp Integration**: Green accent for send actions creates clear mental model
7. **Admin Simplicity**: Functional over decorative, quick CRUD operations