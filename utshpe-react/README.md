# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Hero slideshow: `flickr-slideshow` Edge Function

The home page hero slideshow (`src/components/ImageSlideshow.jsx`) shows 10
photos from the [UT SHPE Flickr](https://www.flickr.com/photos/201375415@N03/),
served by the Supabase Edge Function in `supabase/functions/flickr-slideshow/`.
If the function is unavailable, the slideshow keeps showing the local images in
`public/assets/images/Home_Page/`.

How the photos are picked:

- The pool is every public photo taken in the 2.5 weeks before this week's
  Monday (00:00 Chicago time) and uploaded before that Monday. Photos uploaded
  mid-week join the pool the following week, so the set never changes partway
  through a week. If the camera dates are wrong, photos uploaded in that window
  are included too.
- If that still finds fewer than 10 photos, the window widens to 6 weeks, then
  3 months, then 6 months.
- 10 are chosen at random, seeded by the ISO week in Chicago time, so everyone
  sees the same set all week and it changes every Monday.
- To keep a photo out of the slideshow, add the tag `nowebsite` to it on Flickr.

Deploy it with the [Supabase CLI](https://supabase.com/docs/guides/cli), from
this `utshpe-react/` folder:

```sh
# One-time: link the CLI to the project (ref is in the Supabase dashboard URL)
supabase link --project-ref <project-ref>

# Store the Flickr credentials as secrets. Never commit the API key.
supabase secrets set FLICKR_API_KEY=<your-flickr-api-key> FLICKR_USER_ID=201375415@N03

# Deploy (the site calls it without a user session, so skip JWT verification)
supabase functions deploy flickr-slideshow --no-verify-jwt
```

Results are cached in the function's memory for up to 6 hours (and reset when
the week changes), so a new `nowebsite` tag can take up to 6 hours to apply.
CORS allows `https://utshpe.us` and `http://localhost:5173`; edit
`ALLOWED_ORIGINS` in `index.ts` to add more.

## Home page: "This Week in SHPE" collage

1. Put the week's photos in `public/assets/images/this-week/`.
2. Edit `src/data/thisWeek.js`. The first entry is the large tile. 3 to 6
   entries are supported. `pillar` and `focus` are optional.
