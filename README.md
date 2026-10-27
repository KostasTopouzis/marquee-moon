# Marquee Moon v0.1.1

Marquee Moon is a movie aggregator that presents films in a clean, poster-first layout. It is a React single-page application styled with Tailwind CSS. Browsing, search and favorites are in place, but the movie data is still mock data. Connecting to the TMDB API is the next planned step.

![Marquee Moon home page](/public/home-page.png)

## New Features (v0.1.1)

- Marquee visual identity: a warm ink background, paper-coloured text, a single amber accent, and a serif display face for the wordmark and headings.
- Sticky navigation bar with active-page indicators and a Favorites page.
- Hero search field with a live result count and a clear no-results message.
- Poster grid that adapts from two to five columns across phone, tablet and desktop widths.
- Favorite buttons that stay visible on touch screens and appear on hover or keyboard focus on larger screens.
- Visible focus rings and labelled controls for keyboard and screen reader users.
- Removed the unused legacy stylesheets, so all styling now comes from Tailwind classes and a single theme file.

## Tech Stack

- ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
- ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
- ![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
- ![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white)

## Learning Goals

- improve my experience with data fetching and API requests.
- design better solutions for potential users.
- be able to begin from a basic, generic functionality and gradually provide a more expertized and distinctive application purpose.

## AI-Assisted Development

Claude Code was used as an AI coding assistant during the development of this project. My emphasis as a developer and my learning goals (and, therefore, the skills this project is meant to demonstrate) are mostly focused in the following areas:

- overall full-stack design and integration
- backend/database workflows, including data modelling and database schema design
- data fetching/scraping/extraction/manipulation techniques
- security concerns (authentication, validation, login mechanisms)
- implementation of appropriate business practices

It is impossible in our times to fully separate code written by AI and human hand, but my contribution is more acutely felt in the areas above. For this project then, I take a greater share of responsibility for the code handling API requests, data manipulation/management, general backend logic and DevOps practices. And of course setting up the project and creating its initial template, defining its purpose and requirements, directing design iterations, reviewing generated code and integrating components into the application.

Now, in other areas... well, besides using Claude Code as a general assistant to speed up processes, I particularly used its services for UI design exploration, visual styling, and implementation of frontend components. My usual strategy is to describe the brand/project aimed aesthetic and target audience (`docs/ai/design-directions/brand-character.md`), create or adjust the necessary skills (as found in the relevant `.claude` folder), set up guidelines and then ask it to present me with two or three alternative stylings that I can review and choose from. Then, I may tinker a bit with the code myself to refine them further.

AI-generated code was reviewed and adapted as needed. But the overall responsibility and any possible flaws of the project are mine.

## How to Run

Requirements: a current Node.js LTS release and npm.

```bash
# Install dependencies
npm install

# Start the development server (http://localhost:5173 by default)
npm run dev

# Check the code with ESLint
npm run lint

# Build for production into the dist folder
npm run build

# Serve the production build locally
npm run preview
```

<!-- Live site: [URL to be added] -->

## Future Goals

Connect the application to the TMDB API so that films, posters and details come from live data instead of the mock list.

## To Fix

- No known open bugs are recorded at this time.

## Insights

Check the docs folder for interesting material concerning this project, like the problems I faced during its construction, skills I learned or improved, areas I hope to improve in the future, and general realizations or thoughts I had during this project.

## License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is distributed under the MIT License. See the `LICENSE` file for the full text and details.

## How to Reach Me

* You can reach me via the email address on my profile page or through my LinkedIn profile: [Kostas Topouzis | LinkedIn](https://www.linkedin.com/in/kostas-topouzis-03992b410/)
* If you are interested, you can also check my music on my official artist channel. I operate under the name Vayos Avramides: [Vayos Avramides | YouTube](https://www.youtube.com/@vayosavramides). Also, feel free to follow my Facebook channel: [Vayos Avramides | Facebook](https://www.facebook.com/profile.php?id=61594800706567)
