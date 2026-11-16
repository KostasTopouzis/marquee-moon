# Marquee Moon v0.4.0

Marquee Moon is an aggregator page that presents films in a clean, poster-first layout. At this stage it is a React single-page application styled with Tailwind CSS and allows browsing and searching of movies as well as creating your own favorites list. I am currently fetching data from the TMDB API, but my future goal is to draw from many different sources and perhaps even creating a multi-page structure that will allow users to browse other multimedia types like television series, music albums, radio shows, theatre productions, etc.

![Marquee Moon home page](/public/home-page.png)

## New Features (v0.4.0)

- A backend layer of Vercel Functions now talks to TMDB, so the API token stays on the server and never reaches the browser.
- Clear error messages that tell you whether the movie service is busy, down, or unreachable.
- Typing in the search box no longer hides results: the grid always shows what your last search returned, and an empty search brings back the popular films.
- Films without a poster show a title card instead of a broken image.

## Tech Stack

- ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
- ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
- ![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
- ![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white)

## Learning Goals

- improve my experience with data fetching and API requests, and deal with the various problems that arise in the process.
- design better solutions for potential users.
- be able to begin from a basic, generic functionality and gradually provide a more expertized and distinctive application purpose.
- get deeper into React and explore its potential at greater depth.
- get an even more concrete understanding of browser behavior and debugging approaches.
- increase my experience and familiarity with DevOps practices, CI/CD operations, and professional development workflows.

## AI-Assisted Development

Claude Code was used as an AI coding assistant during the development of this project. My learning goals for this project (and, therefore, the skills it is meant to demonstrate) are mostly focused in the following areas:

- overall full-stack design and integration
- implementation of serverless programming patterns
- data fetching from external API sources
- security concerns (authentication, validation, login mechanisms)
- implementation of appropriate business practices

It is impossible in our times to fully separate code written by AI and human hand, but my contribution is more acutely felt in the areas above. For this project then, I take a greater share of responsibility for the code handling API requests, data manipulation/management, general backend logic and DevOps practices. And of course setting up the project and creating its initial template, defining its purpose and requirements, directing design iterations, reviewing generated code and integrating components into the application.

Now, in other areas... well, besides using Claude Code as a general assistant to speed up processes, I particularly used its services for UI design exploration, visual styling, and implementation of frontend components. My usual strategy is to describe the brand/project aimed aesthetic and target audience (`docs/ai/design-directions/brand-character.md`), create or adjust the necessary skills (as found in the relevant `.claude` folder), set up guidelines and then ask it to present me with two or three alternative stylings that I can review and choose from. Then, I may tinker a bit with the code myself to refine them further.

AI-generated code was reviewed and adapted as needed. But the overall responsibility and any possible flaws of the project are mine.

## How to Run

Visit the live site: [https://marquee-moon.vercel.app/]

Locally: you need a current Node.js LTS release, npm, the [Vercel CLI](https://vercel.com/docs/cli) and a [TMDB API Read Access Token](https://developer.themoviedb.org/docs/getting-started).

The app fetches its data through Vercel Functions in the `api/` folder, which hold the TMDB token on the server. `npm run dev` starts only the Vite frontend, so movies will not load with it. Use `vercel dev` instead, which runs the frontend and the functions together.

1. Create a `.env.local` file in the project root with your token. Do not add the `VITE_` prefix, which would expose the token in the browser bundle:

   ```
   TMDB_READ_ACCESS_TOKEN=your_token_here
   ```

2. Install, link and run:

```bash
# Install dependencies
npm install

# Link the folder to a Vercel project (first time only)
vercel link

# Start the frontend and the functions (http://localhost:3000 by default)
vercel dev

# Check the code with ESLint
npm run lint

# Build for production into the dist folder
npm run build

# Serve the production build locally
npm run preview
```

## Future Goals

Implement pagination, so that searches can display more than the first 20 results.

## To Fix

- A pagination mechanism needs to be applied to allow more results to display upon search.

## To Improve

- **Search engine UX**: the current setup is misleading. The user doesn't understand that they need to press the Search button to perform a search on all available movies and not just the already existing most popular ones. **Suggestion**: add filters for searching (e.g, Popular Movies This Week) and so the search engine takes the filters into account to limit the sample in which it performs the search. This way, I can give the users the hints they need to know what to expect from the search engine's behavior.

## Insights

Check the docs folder for material concerning this project: bugs that remain to be fixed, areas that still need improvement, the problems I faced during the project's construction, skills I learned or improved, areas I hope to improve in the future, and general realizations or thoughts I had during this project.

## License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is distributed under the MIT License. See the `LICENSE` file for the full text and details.

## How to Reach Me

* You can reach me via the email address on my profile page or through my LinkedIn profile: [Kostas Topouzis | LinkedIn](https://www.linkedin.com/in/kostas-topouzis-03992b410/)
* If you are interested, you can also check my music on my official artist channel. I operate under the name Vayos Avramides: [Vayos Avramides | YouTube](https://www.youtube.com/@vayosavramides). Also, feel free to follow my Facebook channel: [Vayos Avramides | Facebook](https://www.facebook.com/profile.php?id=61594800706567)
